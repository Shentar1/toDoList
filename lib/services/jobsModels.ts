export type Job = {
  id: number;
  job_description: string | null;
  status: string | null;
  list_id: number;
  time_created: Date;
};
export type jobDTO = {
  id: number;
  list_id: number;
  job_description: string | null;
  status: string | null;
  time_created?: Date;
};
