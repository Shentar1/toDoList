import { Role } from "@/app/generated/prisma/enums";
import { List } from "./listsModels";

export type User = {
  id: number;
  uuid: string;
  username: string;
  password: string;
  time_created: Date;
  role: Role;
  lists?: List[];
};
export type userDTO = {
  uuid: string;
  time_created: Date;
  role: Role;
  lists?: List[];
};
