import { db, voteCollection } from "@/models/name";
import { databases } from "@/models/Server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export default async function POST(request:NextRequest){

    try {

        const {votedById , type , typeId , voteStatus} = await request.json();

        const response = await databases.listDocuments(
            db,voteCollection ,[
                Query.equal("votedById",votedById),
                Query.equal("typeId",typeId),
                Query.equal("type",type)
            ] )

        if(response.documents.length > 0){

        }

        if(response.documents[0]?.voteStatus !== voteStatus){

        }

        const [upvotes,downvotes] = await Promise.all([
            await databases.listDocuments(
                db , voteCollection ,[
                    Query.endsWith("votedById" , votedById),
                    Query.endsWith("type" , type),
                    Query.endsWith("typeId" , typeId),
                    Query.endsWith("voteStatus" , "upvoted"),
                    Query.limit(1)
                ]
            ),

            await databases.listDocuments(
                db , voteCollection ,[
                    Query.endsWith("votedById" , votedById),
                    Query.endsWith("type" , type),
                    Query.endsWith("typeId" , typeId),
                    Query.endsWith("voteStatus" , "downvoted"),
                    Query.limit(1)
                ]
            ),

        ])

        return NextResponse.json(
            {
                data:{
                    document : null ,
                    voteResult : upvotes.total === downvotes.total 
                } ,
                message: "Vote Status Updated"
            },{
                status:200
            }
        )

        
    } catch (error:any) {

        return NextResponse.json(
                    {
                        error: error?.message || "Something Went Wrong"
                    },
                    {
                        status: error?.status || 500
                    }
                )
        
    }

}