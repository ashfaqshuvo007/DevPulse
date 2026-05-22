import { connectionPool } from "../db";
import type { IUser } from "../modules/auth/auth.interface";
import type { IIssue } from "../modules/issue/issue.interface";
import type { QueryParams } from "../types";

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

export const issueHelpers = {
  buildFilterQuery,
  fetchReporters,
  attachReportersToIssues,
};
