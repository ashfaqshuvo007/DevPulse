import type { QueryResult } from "pg";
import { connectionPool } from "../../db";
import type { QueryParams } from "../../types";
import { issueHelpers } from "../../utils/IssueHelpers";
import type { IIssue } from "./issue.interface";

const getIssuesFromDB = async (queryParams?: QueryParams) => {
  const { query, params } = issueHelpers.buildFilterQuery(queryParams);
  const issues: QueryResult<any> = await connectionPool.query(query, params);

  const response = await issueHelpers.curateIssuesResponse(issues, 0);

  return { ...issues, rows: response };
};

const insertIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
  const { title, description, type } = payload;
  const issue = await connectionPool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, type, reporter_id],
  );
  return issue;
};

const updateIssueIntoDB = async (payload: IIssue, id: string) => {
  const { title, description, type } = payload;
  const issue = await connectionPool.query(
    `UPDATE issues 
        SET title=COALESCE($1,title), 
        description=COALESCE($2,description),
        type=COALESCE($3,type)

        WHERE id=$4 
        RETURNING *`,
    [title, description, type, id],
  );
  return issue;
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await connectionPool.query(
    `SELECT * FROM issues WHERE id=$1`,
    [id],
  );
  const response = await issueHelpers.curateIssuesResponse(result, 1);

  return { ...result, rows: response };
};

const deleteIssueFromDB = async (id: string) => {
  const result = await connectionPool.query(`DELETE FROM issues WHERE id=$1`, [
    id,
  ]);
  return result;
};

export const issueService = {
  getIssuesFromDB,
  insertIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
  getSingleIssueFromDB,
};
