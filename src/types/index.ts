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
