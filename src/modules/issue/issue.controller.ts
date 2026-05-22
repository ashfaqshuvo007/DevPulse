import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const queryParams = {
      sort: (req.query.sort as "newest" | "oldest") || "newest",
      ...(req.query.type && {
        type: req.query.type as "bug" | "feature_request",
      }),
      ...(req.query.status && {
        status: req.query.status as "open" | "in_progress" | "resolved",
      }),
    };
    const result = await issueService.getIssuesFromDB(queryParams);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  return "Single Issue";
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
      error: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  return "Updae Issues";
};

const deleteIssue = async (req: Request, res: Response) => {
  return "Delete Issues";
};

export const issueController = {
  getAllIssues,
  createIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
