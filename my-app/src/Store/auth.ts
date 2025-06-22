import {create} from "zustand"
import {persist} from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import {AppwriteException , ID , Models} from "appwrite"
import { account } from "@/models/client/config"

export interface UserPrefs{
    reputation : number
}

interface IAuthStore{
    session : Models.Session | null
    jwt : string | null
    user : Models.User<UserPrefs> | null
    hydrated:boolean

    setHydrated() : void
    Verifysession() : Promise<void>
    login(
        email:String,
        password:String  
    ): Promise<{success:boolean , 
        error?: AppwriteException | null, 
    }>

    CreateAccount(
        name:String,
        email:String,
        password:String
    ) : Promise<{success:boolean , 
        error?: AppwriteException | null, 
    }>

    logout() : Promise<void>
    


}

