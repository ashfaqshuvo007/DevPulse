import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";
import type { IssueStatus, IssueType, SortIssues } from "../../types";
import { authService } from "../auth/auth.service";
import type { JwtPayload } from "jsonwebtoken";

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const queryParams = {
      sort: (req.query.sort as SortIssues) || "newest",
      ...(req.query.type && {
        type: req.query.type as IssueType,
      }),
      ...(req.query.status && {
        status: req.query.status as IssueStatus,
      }),
    };
    const result = await issueService.getIssuesFromDB(queryParams);
    if (result.rows) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        data: result.rows,
      });
    }
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.getSingleIssueFromDB(id as string);
    if (result.rowCount !== 0) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        data: result.rows,
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue with id: ${id} not found`,
        errors: {},
      });
    }
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user?.id;
    const result = await issueService.insertIssueIntoDB(req.body, reporter_id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id: issueId } = req.params;

    // Check authorization
    await authService.canUserUpdateResource(
      issueId as string,
      req.user as JwtPayload,
      "issues",
      "reporter_id",
    );

    const result = await issueService.updateIssueIntoDB(
      req.body,
      issueId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode:
        error.message.includes("Unauthorized") ||
        error.message.includes("only update")
          ? 403
          : 500,
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.deleteIssueFromDB(id as string);
    if (result.rowCount != 0) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue deleted successfully",
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue with id: ${id} not found`,
        errors: {},
      });
    }
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const issueController = {
  getAllIssues,
  createIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
