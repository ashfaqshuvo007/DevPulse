export const USER_ROLES = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type ROLES = "contributor" | "maintainer";

export const ISSUE_STATUS = {
  open: "open",
  inProgress: "in_progress",
  resolved: "resolved",
} as const;

export type STATUS = "open" | "in_progress" | "resolved";

export type QueryParams = {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};

export type SortIssues = "newest" | "oldest";
export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";
