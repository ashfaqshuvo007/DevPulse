import { connectionPool } from "../../db";
import { encrypt } from "../../utils/encrypt";
import type { User } from "../../types";
import bcrypt from "bcryptjs";

const loginUser = async (payload: { email: string; password: string }) => {
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
  return { user };
};

const registerUserIntoDB = async (payload: User) => {
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
