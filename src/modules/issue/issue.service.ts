import { connectionPool } from "../../db";
import type { QueryParams } from "../../types";
import { issueHelpers } from "../../utils/IssueHelpers";
import type { IIssue } from "./issue.interface";

// Main: Get issues with reporters
const getIssuesFromDB = async (queryParams?: QueryParams) => {
  const { query, params } = issueHelpers.buildFilterQuery(queryParams);
  const issues = await connectionPool.query(query, params);

  if (issues.rows.length === 0) {
    return issues;
  }

  const reporterIds = [
    ...new Set(issues.rows.map((issue: any) => issue.reporter_id)),
  ];

  const reporterMap = await issueHelpers.fetchReporters(reporterIds);
  const issuesWithReporters = issueHelpers.attachReportersToIssues(
    issues.rows,
    reporterMap,
  );

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
