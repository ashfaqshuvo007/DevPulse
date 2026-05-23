export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string; //contributor, maintainer
}

export interface IloginUser {
  email: string;
  password: string;
}
