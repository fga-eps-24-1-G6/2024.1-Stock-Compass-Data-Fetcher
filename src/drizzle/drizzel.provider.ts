import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzelNode } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../db/schema";

export const connectDB = async () => {
    console.log("Connecting with DB...");

    if (process.env.ENVIRONMENT == "development") {
        try{
            console.log(process.env.DEV_DB_URL)
            const client = new Client({
                connectionString: process.env.DEV_DB_URL,
            });
            await client.connect();
            // refatorar para conseguir encerrar conexao apos uso
    
            const db = drizzelNode(client, { schema });
            console.log("Connection established!");

            return db;            
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    try{
        const sql = neon(process.env.DB_URL!);

        const db = drizzleNeon(sql, {
            schema,
        });
        console.log("Connection established!");

        return db;            
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const DrizzleAsyncProvider = "drizzel_provider"

export const drizzleProvider = [
    {
        provide: DrizzleAsyncProvider,
        useFactory: async () => {
            const db = await connectDB();
            return db;
        },
        exports: [DrizzleAsyncProvider]
    }
];