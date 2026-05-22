import { connectionPool } from "../../db";
import { encrypt } from "../../utils/encrypt";
import bcrypt from "bcryptjs";
import config from "../../config";
import jwt from "jsonwebtoken";
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
  return { token, user };
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

export const authService = {
  loginUser,
  registerUserIntoDB,
};
