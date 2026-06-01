import { List } from "./listsModels"

export type Users = {
    user_id:number,
    username:string,
    password:string,
    timeCreated:Date,
    role:"Admin"|"User"|"Unverified"
}