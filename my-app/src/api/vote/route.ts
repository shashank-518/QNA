import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/Server/config";
import { UserPrefs } from "@/Store/auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

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

            await databases.deleteDocument(db , voteCollection , response.documents[0].$id )

            const questionoranswer = await databases.getDocument(
                db ,
                type ==="question" ? questionCollection : answerCollection,
                typeId
            )

            const authPref = await users.getPrefs<UserPrefs>(questionoranswer.authorId)

            await users.updatePrefs<UserPrefs>(questionoranswer.authorId , {
                reputation : voteStatus === "upvoted" ? Number(authPref.reputation) - 1 :
                Number(authPref.reputation) + 1 
            })


        }

        if(response.documents[0]?.voteStatus !== voteStatus){

            const docs = await databases.createDocument(
                db , voteCollection , ID.unique() ,{
                    votedById,
                    type,
                    typeId,
                    voteStatus
                }
            )

            const questionoranswer = await databases.getDocument(
                db ,
                type ==="question" ? questionCollection : answerCollection,
                typeId
            )

            const authPref = await users.getPrefs<UserPrefs>(questionoranswer.authorId)

             if (response.documents[0]) {
                await users.updatePrefs<UserPrefs>(questionoranswer.authorId, {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        response.documents[0].voteStatus === "upvoted"
                            ? Number(authPref.reputation) - 1
                            : Number(authPref.reputation) + 1,
                })
            } else {
                await users.updatePrefs<UserPrefs>(questionoranswer.authorId, {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        voteStatus === "upvoted"
                            ? Number(authPref.reputation) + 1
                            : Number(authPref.reputation) - 1,
                })
        }
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