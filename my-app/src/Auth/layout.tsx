"use client";

import { useAuthStore } from "@/Store/auth";
import { useRouter } from "next/navigation";
import  React , { useEffect } from "react";

const Layout = ({children} : {children: React.ReactNode} )=>{

    const session = useAuthStore()
    const router = useRouter()


    useEffect(()=>{
        if(session){
            router.push("/")
        }
    } ,[router,session])

    if(session){
        return children
    }

    return (
        <>
        
            <div className="">

                <div className="" >
                    {children}
                </div>

            </div>
        
        </>
    )



}

export default Layout;