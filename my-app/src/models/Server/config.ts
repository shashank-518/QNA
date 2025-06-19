import {Client , Storage , Avatars , Databases , Users } from "node-appwrite"
import env from "@/app/env";


let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.secretKey) // Your secret API key
;

const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const users = new Users(client); 

export { client , storage , avatars , databases , users };
