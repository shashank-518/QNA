import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/Server/config";
import { UserPrefs } from "@/Store/auth";
import { ID } from "appwrite";
import { NextRequest , NextResponse } from "next/server";

export  async function POST(request:NextRequest){
    try {

        const {authorId , questionId , answer} = await request.json()

        const response = await databases.createDocument(db, answerCollection , ID.unique() ,{
            content:answer,
            authorId,
            questionId
        })

        const prefs = await users.getPrefs<UserPrefs>(authorId)

        await users.updatePrefs(authorId,{
            reputation: Number(prefs.reputation) + 1
        })

        return NextResponse.json(
            {
                message: "Answered",
                data: response
            },
            {
                status: 200
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

export  async function DELETE(request:NextRequest){
    try {

      const {answerId} =  await request.json()  

      const answer =await databases.getDocument(db, answerCollection , answerId)

      const response = await databases.deleteDocument(db, answerCollection , answerId)

      const prefs = await users.getPrefs<UserPrefs>(answer.authorId)

        await users.updatePrefs(answer.authorId,{
            reputation: Number(prefs.reputation) + 1
        })

        return NextResponse.json(
            {
                message: "Answered",
                data: response
            },
            {
                status: 200
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