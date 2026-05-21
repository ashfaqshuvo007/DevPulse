export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string; //contributor, maintainer
};

export const USER_ROLES = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type ROLES = "contributor" | "maintainer";
