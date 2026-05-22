import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    delete result.user.password;

    res.status(200).json({
      success: true,
      message: "Login Successful!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserIntoDB(req.body);
    delete result.rows[0].password;

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};

export const authController = {
  login,
  register,
};
