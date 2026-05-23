import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { connectionPool } from "../db";
import type { ROLES } from "../types";
import sendResponse from "../utils/sendResponse";

export const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      //* Check client sends token in header
      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access",
          data: {},
        });
      }
      const decodedToken = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload;

      const userData = await connectionPool.query(
        `SELECT * FROM users WHERE name=$1`,
        [decodedToken.name],
      );

      //* Check user existss
      if (userData.rows.length === 0) {
        sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found",
          data: {},
        });
      }
      const user = userData.rows[0];

      //* Check roles
      if (roles.length && !roles.includes(user?.role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Access forbidden with your role.",
          data: {},
        });
      }

      //* Attach logged in user to req
      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};
