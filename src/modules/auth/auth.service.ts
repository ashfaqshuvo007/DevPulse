import { connectionPool } from "../../db";
import { encrypt } from "../../utils/encrypt";
import bcrypt from "bcryptjs";
import config from "../../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IloginUser, IUser } from "./auth.interface";

const loginUser = async (payload: IloginUser) => {
  const { email, password } = payload;
  // Check if user exists
  const userDetails = await connectionPool.query(
    `
        SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  if (userDetails.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  const user = userDetails.rows[0];
  // Match password
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  // if match found generate token with TTL
  const token = jwt.sign(userPayload, config.jwtSecret as string, {
    expiresIn: "1d",
  });

  //Refresh token
  const refreshToken = jwt.sign(userPayload, config.refreshSecret as string, {
    expiresIn: "10d",
  });

  return { token, refreshToken, user };
};

const registerUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const encryptedPassword = await encrypt(password, 10);

  const result = await connectionPool.query(
    `INSERT INTO users (name, email, password, role)
                VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
    [name, email, encryptedPassword, role],
  );

  return result;
};

// Authorization: Check if user can update resources
const canUserUpdateResource = async (
  resourceId: string,
  loggedInUser: JwtPayload,
  resourceTable: string,
  ownerColumn: string,
) => {
  const userRole = loggedInUser?.role;
  const userId = loggedInUser?.id;
  const resourceType = resourceTable.slice(0, -1);
  if (userRole === "maintainer") {
    return true;
  }

  if (userRole === "contributor") {
    const resource = await connectionPool.query(
      `SELECT ${ownerColumn}, status FROM ${resourceTable} WHERE id = $1`,
      [resourceId],
    );
    if (resource.rows.length === 0) {
      throw new Error(
        `${resourceType.toUpperCase} with id: ${resourceId} not found`,
      );
    }
    if (resource.rows[0][ownerColumn] !== userId) {
      throw new Error(
        `Unauthorized to update ${resourceType} with id: ${resourceId}`,
      );
    }

    if (resource.rows[0].status !== "open") {
      throw new Error(
        `Unauthorized to update ${resourceType} without status: 'open'`,
      );
    }

    return true;
  }
  throw new Error("Unauthorized role");
};

const generateRefreshToken = async (token: string) => {
  //* Check refresh token in cookies
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(
    token as string,
    config.refreshSecret as string,
  ) as JwtPayload;

  const userData = await connectionPool.query(
    `SELECT * FROM users WHERE id=$1`,
    [decodedToken.id],
  );

  //* Check user existss
  if (userData.rows.length === 0) {
    throw new Error("User not Found");
  }

  const user = userData.rows[0];
  delete user.password;

  const userPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  // if match found generate token with TTL
  const accessToken = jwt.sign(userPayload, config.jwtSecret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUser,
  registerUserIntoDB,
  canUserUpdateResource,
  generateRefreshToken,
};
