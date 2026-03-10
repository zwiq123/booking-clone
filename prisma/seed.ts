import { PrismaClient } from "./../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    conntectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter });

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
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        prisma.$disconnect();
    })

