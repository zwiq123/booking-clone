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
            {id: 1, name: "user"},
            {id: 2, name: "host"},
            {id: 3, name: "admin"}
        ],
        skipDuplicates: true
    })

    await prisma.propertyStatus.createMany({
        data: [
            {id: 1, name: "published"},
            {id: 2, name: "in progress"},
            {id: 3, name: "hidden"}
        ],
        skipDuplicates: true
    })

    await prisma.propertyType.createMany({
        data: [
            {id: 1, name: "hotel"},
            {id: 2, name: "pensjonat"},
            {id: 3, name: "objekt B&B"},
            {id: 4, name: "kwatera prywatna"},
            {id: 5, name: "hostel"},
            {id: 6, name: "hotel apartmentowy"},
            {id: 7, name: "hotel kapsułowy"},
            {id: 8, name: "gospodarstwo wiejskie"},
            {id: 9, name: "gospodarstwo agroturystyczne"},
            {id: 10, name: "zajazd"},
            {id: 11, name: "hotel miłości"},
            {id: 12, name: "motel"},
            {id: 13, name: "riad"},
            {id: 14, name: "ryokan"},
            {id: 15, name: "domek letniskowy"},
            {id: 16, name: "dom"}
        ],
        skipDuplicates: true
    })

    await prisma.roomAmenityCategory.createMany({
        data: [
            {id: 1, name: "Jedzenie i napoje"},
            {id: 2, name: "Część zewnętrzna i widoki"},
            {id: 3, name: "Ogólne udogodnienia"},
            {id: 4, name: "Wyposażenie pokoju"}
        ],
        skipDuplicates: true
    })

    await prisma.roomAmenityType.createMany({
        data: [
            {id: 1, categoryId: 1, name: "Czajnik elektryczny"},
            {id: 2, categoryId: 1, name: "Zestaw do parzenia kawy i herbaty"},
            {id: 3, categoryId: 1, name: "Część jadalna"},
            {id: 4, categoryId: 1, name: "Stół"},
            {id: 5, categoryId: 1, name: "Kuchenka mikrofalowa"},
            {id: 6, categoryId: 2, name: "Balkon"},
            {id: 7, categoryId: 2, name: "Taras"},
            {id: 8, categoryId: 2, name: "Widok"},
            {id: 9, categoryId: 3, name: "Wieszak na ubrania"},
            {id: 10, categoryId: 3, name: "Telewizor z płaskim ekranem"},
            {id: 11, categoryId: 3, name: "Klimatyzacja"},
            {id: 12, categoryId: 3, name: "Pościel"},
            {id: 13, categoryId: 3, name: "Biurko"},
            {id: 14, categoryId: 3, name: "Budzenie na życzenie"},
            {id: 15, categoryId: 3, name: "Ręczniki"},
            {id: 16, categoryId: 3, name: "Szafa lub garderoba"},
            {id: 17, categoryId: 3, name: "Ogrzewanie"},
            {id: 18, categoryId: 3, name: "Wentylator"},
            {id: 19, categoryId: 3, name: "Sejf"},
            {id: 20, categoryId: 3, name: "Ręczniki / pościel (dostępne za dodatkową opłatą)"},
            {id: 21, categoryId: 3, name: "Całość zlokalizowana na parterze"},
            {id: 22, categoryId: 4, name: "Papier toaletowy"},
            {id: 23, categoryId: 4, name: "Przysznic"},
            {id: 24, categoryId: 4, name: "Toaleta"},
            {id: 25, categoryId: 4, name: "Suszarka do włosów"},
            {id: 26, categoryId: 4, name: "Wanna"},
            {id: 27, categoryId: 4, name: "Bezpłatny zestaw kosmetyków"},
            {id: 28, categoryId: 4, name: "Bidet"},
            {id: 29, categoryId: 4, name: "Kapcie"},
            {id: 30, categoryId: 4, name: "Szlafrok"},
            {id: 31, categoryId: 4, name: "Wanna z hydromasażem"},
        ],
        skipDuplicates: true
    })

    await prisma.propertyAmenityType.createMany({
        data: [
            {id: 1, name: "Restauracja"},
            {id: 2, name: "Bar"},
            {id: 3, name: "Całodobowa recepcja"},
            {id: 4, name: "Obsługa pokoju"},
            {id: 5, name: "Sauna"},
            {id: 6, name: "Centrum fitness"},
            {id: 7, name: "Ogród"},
            {id: 8, name: "Taras"},
            {id: 9, name: "Pokoje dla niepalących"},
            {id: 10, name: "Transfer lotniskowy"},
            {id: 11, name: "Narciarstwo"},
            {id: 12, name: "Pokoje rodzinne"},
            {id: 13, name: "Spa i centrum odnowy biologicznej"},
            {id: 14, name: "Wanna z hydromasażem / jacuzzi"},
            {id: 15, name: "Bezpłatne Wi-Fi"},
            {id: 16, name: "Klimatyzacja"},
            {id: 17, name: "Park wodny"},
            {id: 18, name: "Stacja ładowania pojazdów elektrycznych"},
            {id: 19, name: "Basen"},
            {id: 20, name: "Plaża"}
        ],
        skipDuplicates: true
    })

    await prisma.languageType.createMany({
        data: [
            {id: 1, name: "english"},
            {id: 2, name: "polski"},
            {id: 3, name: "deutsch"}
        ],
        skipDuplicates: true
    })

    await prisma.bedType.createMany({
        data: [
            {id: 1, name: "łóżko pojedyncze", size: "90-130 cm szerokości"},
            {id: 2, name: "łóżko podwójne", size: "131-150 cm szerokości"},
            {id: 3, name: "duże łóżko (typu king-size)", size: "151-180 cm szerokości"},
            {id: 4, name: "bardzo duże łóżko podwójne (typu super king-size)", size: "181-210 cm szerokości"},
            {id: 5, name: "łóżko piętrowe", size: "Różne wymiary"},
            {id: 6, name: "rozkładana sofa", size: "Różne wymiary"},
            {id: 7, name: "materac futon", size: "Różne wymiary"}
        ],
        skipDuplicates: true
    })

    await prisma.bookingStatus.createMany({
        data: [
            {id: 1, name: "awaiting payment"},
            {id: 2, name: "confirmed"},
            {id: 3, name: "in progress"},
            {id: 4, name: "completed"}
        ]
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

