import { connectionPool } from "../../db";
import type { IUser } from "../auth/auth.interface";
import type { IIssue } from "./issue.interface";

type QueryParams = {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};

// Helper: Build filter query
const buildFilterQuery = (queryParams?: QueryParams) => {
  const whereConditions = [];
  const params: any[] = [];

  if (queryParams?.type) {
    whereConditions.push(`type = $${params.length + 1}`);
    params.push(queryParams.type);
  }

  if (queryParams?.status) {
    whereConditions.push(`status = $${params.length + 1}`);
    params.push(queryParams.status);
  }

  let query = "SELECT * FROM issues";
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  const sort = queryParams?.sort || "newest";
  query +=
    sort === "newest"
      ? " ORDER BY created_at DESC"
      : " ORDER BY created_at ASC";

  return { query, params };
};

// Helper: Fetch reporter data
const fetchReporters = async (reporterIds: number[]) => {
  if (reporterIds.length === 0) return {};

  const reporters = await connectionPool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds],
  );

  return reporters.rows.reduce(
    (acc: Record<number, IUser>, reporter: IUser) => {
      acc[reporter.id] = reporter;
      return acc;
    },
    {},
  );
};

// Helper: Attach reporters to issues
const attachReportersToIssues = (
  issues: IIssue[],
  reporterMap: Record<number, any>,
) => {
  return issues.map((issue: IIssue) => {
    const { created_at, updated_at, reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: reporterMap[issue.reporter_id] || null,
      created_at,
      updated_at,
    };
  });
};

// Main: Get issues with reporters
const getIssuesFromDB = async (queryParams?: QueryParams) => {
  const { query, params } = buildFilterQuery(queryParams);
  const issues = await connectionPool.query(query, params);

  if (issues.rows.length === 0) {
    return issues;
  }

  const reporterIds = [
    ...new Set(issues.rows.map((issue: IIssue) => issue.reporter_id)),
  ];

  const reporterMap = await fetchReporters(reporterIds);
  const issuesWithReporters = attachReportersToIssues(issues.rows, reporterMap);

  return { ...issues, rows: issuesWithReporters };
};

const insertIssueIntoDB = async (payload: IIssue, id: number) => {
  const { title, description, type } = payload;
  console.log(payload);
  const issue = await connectionPool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, type, id],
  );
  console.log(issue);

  return issue;
};

export const issueService = {
  getIssuesFromDB,
  insertIssueIntoDB,
};

// Export helpers for reuse in other modules
export const issueHelpers = {
  buildFilterQuery,
  fetchReporters,
  attachReportersToIssues,
};
