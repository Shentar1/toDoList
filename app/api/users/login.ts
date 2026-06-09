import { NextApiRequest, NextApiResponse } from "next";
import { getUserByUsernameAndPassword} from "@/lib/services/usersService";

export default async function login(request:NextApiRequest, response:NextApiResponse){
    try{
        const {username, password} = request.body;
        const user = getUserByUsernameAndPassword(username,password);
        response.status(200).json(user)
    }catch(error){
        throw error
    }

}