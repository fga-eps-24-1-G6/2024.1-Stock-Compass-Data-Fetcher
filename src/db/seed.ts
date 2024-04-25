import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzelNode } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import { companies } from './schema';

const connectDB = async () => {
    if (process.env.ENVIRONMENT == "development") {
        const client = new Client({
            connectionString: process.env.DEV_DB_URL,
        });

        await client.connect();
        // refatorar para conseguir encerrar conexao apos uso

        const db = drizzelNode(client);
        return db;
    }

    const sql = neon(process.env.DB_URL!);

    const db = drizzleNeon(sql, {
        schema,
    });
    return db;
}

const main = async () => {
    try {
        console.log("Connecting with DB...");

        const db = await connectDB();

        console.log("Connection established!");

        console.log("Seeding DB...");

        await db.insert(companies).values({
            name: "PETROLEO BRASILEIRO S.A. PETROBRAS",
            cnpj: "33000167000101",
            ipo: 1977,
            foundationYear: 1953,
            firmValue: 754871726000,
            numberOfPapers: 13044496000,
            marketSegment: "Nível 2",
            sector: "Empresas do Setor Petróleo, Gás e Biocombustíveis",
            segment: "Empresas do Segmento Exploração  Refino e Distribuição"
        });

        console.log("DB seeded successfully! : )");
    } catch (err) {
        console.log(err);
    }
}

main();
