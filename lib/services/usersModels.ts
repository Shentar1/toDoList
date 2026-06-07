import { List } from "./listsModels"

export type User = {
    id:number,
    username:string,
    password:string,
    time_created:Date,
    role:string,
    lists?:List[]
}