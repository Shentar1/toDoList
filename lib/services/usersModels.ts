import { Role } from "@/app/generated/prisma/enums";
import { List } from "./listsModels";

export type User = {
  uuid: string;
  username: string;
  password: string;
  time_created?: Date;
  role: Role;
  lists?: List[];
};
