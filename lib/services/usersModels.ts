import { List } from "./listsModels";

export type User = {
  id: number;
  uuid: string;
  username: string;
  password: string;
  time_created?: Date;
  role: string;
  lists?: List[];
};
