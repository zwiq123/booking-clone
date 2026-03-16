import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';
import 'dotenv/config'


const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

async function main() {
    await prisma.role.createMany({
        data: [
            {name: "user"},
            {name: "partner"},
            {name: "admin"}
        ],
        skipDuplicates: true
    })
}

main()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect()
        process.exit(1);
    })
    .finally(async () => {
        prisma.$disconnect();
    })

