import { Job } from "./jobsModels";

export type List = {
  id: number; // 123
  list_name: string;
  jobs?: Job[];
  user_id?: number;
};
export type listDTO = {
  list_name: string;
  jobs?: Job[];
};
