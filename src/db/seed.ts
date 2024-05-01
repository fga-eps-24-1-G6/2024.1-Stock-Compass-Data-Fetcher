import { companies } from "./schema";
import { connectDB } from "src/drizzle/drizzel.provider";

const main = async () => {
    try {
        console.log("Seeding DB...");
        const db = await connectDB();

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
