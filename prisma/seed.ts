import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';
import bcrypt from "bcrypt";
import 'dotenv/config'


const pool = new pg.Pool({connectionString: `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

async function main() {
    try {
        await prisma.role.createMany({
            data: [
                {id: 1, name: "user"},
                {id: 2, name: "host"},
                {id: 3, name: "admin"}
            ],
            skipDuplicates: true
        })
    } catch (e) {
        console.log('Role table may not exist yet')
    }

    try {
        await prisma.propertyStatus.createMany({
            data: [
                {id: 1, name: "published"},
                {id: 2, name: "in progress"},
                {id: 3, name: "hidden"}
            ],
            skipDuplicates: true
        })
    } catch (e) {
        console.log('PropertyStatus table may not exist yet')
    }

    try {
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
    } catch (e) {
        console.log('PropertyType table may not exist yet')
    }

    try {
        await prisma.roomAmenityCategory.createMany({
            data: [
                {id: 1, name: "Jedzenie i napoje"},
                {id: 2, name: "Część zewnętrzna i widoki"},
                {id: 3, name: "Ogólne udogodnienia"},
                {id: 4, name: "Wyposażenie pokoju"}
            ],
            skipDuplicates: true
        })
    } catch (e) {
        console.log('RoomAmenityCategory table may not exist yet')
    }

    try {
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
    } catch (e) {
        console.log('RoomAmenityType table may not exist yet')
    }

    try {
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
    } catch (e) {
        console.log('PropertyAmenityType table may not exist yet')
    }

    try {
        await prisma.languageType.createMany({
            data: [
                {id: 1, name: "english"},
                {id: 2, name: "polski"},
                {id: 3, name: "deutsch"}
            ],
            skipDuplicates: true
        })
    } catch (e) {
        console.log('LanguageType table may not exist yet')
    }

    try {
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
    } catch (e) {
        console.log('BedType table may not exist yet')
    }

    try {
        await prisma.bookingStatus.createMany({
            data: [
                {id: 1, name: "awaiting payment"},
                {id: 2, name: "confirmed"},
                {id: 3, name: "in progress"},
                {id: 4, name: "completed"}
            ],
            skipDuplicates: true
        })
    } catch (e) {
        console.log('BookingStatus table may not exist yet')
    }

    console.log('Seed completed - seeded all available tables')

        const demoPassword = await bcrypt.hash("Demo1234!", 10);

    await prisma.user.createMany({
        data: [
            {
                id: 1,
                email: "guest1@example.com",
                firstName: "Guest",
                lastName: "One",
                passwordHash: demoPassword,
                accountVerified: true,
                roleId: 1
            },
            {
                id: 2,
                email: "guest2@example.com",
                firstName: "Guest",
                lastName: "Two",
                passwordHash: demoPassword,
                accountVerified: true,
                roleId: 1
            },
            {
                id: 3,
                email: "host1@example.com",
                firstName: "Host",
                lastName: "One",
                passwordHash: demoPassword,
                accountVerified: true,
                roleId: 2
            },
            {
                id: 4,
                email: "host2@example.com",
                firstName: "Host",
                lastName: "Two",
                passwordHash: demoPassword,
                accountVerified: true,
                roleId: 2
            }
        ],
        skipDuplicates: true
    });

    await prisma.property.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "Sunny City Flat",
            rating: 4,
            avgReviews: 4.2,
            ownerId: 3,
            statusId: 1,
            propertyTypeId: 1,
            propertyDescription: "A bright demo apartment close to the demo city center.",
            ownerDescription: "Friendly demo host with demo local recommendations.",
            surroundingsDescription: "Near demo restaurants, demo tram stop, and demo parks.",
            address: {
                create: {
                    latitude: 50.06465,
                    longitude: 19.94498,
                    country: "Poland",
                    city: "Kraków",
                    street: "Demo Street 1",
                    postalCode: "31-000"
                }
            },
            amenities: {
                create: [
                    { amenityTypeId: 15 },
                    { amenityTypeId: 16 },
                    { amenityTypeId: 12 }
                ]
            },
            spokenLanguages: {
                create: [
                    { languageTypeId: 1 },
                    { languageTypeId: 2 }
                ]
            },
            images: {
                create: [
                    { path: "/uploads/demo1.png", isMain: true }
                ]
            },
            rooms: {
                create: [
                    {
                        id: 1,
                        name: "Standard Room",
                        capacity: 2,
                        area: 18,
                        smokingAllowed: false,
                        bathroomPrivate: true,
                        beds: {
                            create: [{ typeId: 2, count: 1 }]
                        },
                        amenities: {
                            create: [
                                { amenityTypeId: 10 },
                                { amenityTypeId: 13 }
                            ]
                        },
                        pricing: {
                            create: { price: 120.0 }
                        }
                    },
                    {
                        id: 2,
                        name: "Family Room",
                        capacity: 4,
                        area: 28,
                        smokingAllowed: false,
                        bathroomPrivate: true,
                        beds: {
                            create: [{ typeId: 2, count: 2 }]
                        },
                        amenities: {
                            create: [
                                { amenityTypeId: 12 },
                                { amenityTypeId: 15 }
                            ]
                        },
                        pricing: {
                            create: { price: 190.0 }
                        }
                    }
                ]
            }
        }
    });

    await prisma.property.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            name: "Cozy demo Countryside House",
            rating: 5,
            avgReviews: 4.8,
            ownerId: 4,
            statusId: 1,
            propertyTypeId: 16,
            propertyDescription: "Quiet demo home with demo garden and demo countryside views.",
            ownerDescription: "Perfect for demo weekend stays and demo nature lovers.",
            surroundingsDescription: "Close to demo hiking trails and demo local bakery.",
            address: {
                create: {
                    latitude: 50.12345,
                    longitude: 19.98765,
                    country: "Poland",
                    city: "Wieliczka",
                    street: "Demo Lane 2",
                    postalCode: "32-020"
                }
            },
            amenities: {
                create: [
                    { amenityTypeId: 7 },
                    { amenityTypeId: 8 },
                    { amenityTypeId: 15 }
                ]
            },
            spokenLanguages: {
                create: [
                    { languageTypeId: 1 },
                    { languageTypeId: 2 }
                ]
            },
            images: {
                create: [
                    { path: "/uploads/demo2.png", isMain: true }
                ]
            },
            rooms: {
                create: [
                    {
                        id: 3,
                        name: "Garden Room",
                        capacity: 2,
                        area: 20,
                        smokingAllowed: false,
                        bathroomPrivate: true,
                        beds: {
                            create: [{ typeId: 2, count: 1 }]
                        },
                        amenities: {
                            create: [
                                { amenityTypeId: 7 },
                                { amenityTypeId: 11 }
                            ]
                        },
                        pricing: {
                            create: { price: 150.0 }
                        }
                    }
                ]
            }
        }
    });

    await prisma.booking.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            statusId: 2,
            roomId: 1,
            userId: 1,
            checkIn: new Date("2026-06-10T14:00:00.000Z"),
            checkOut: new Date("2026-06-12T11:00:00.000Z"),
            guestCount: 2,
            totalPrice: 240.0
        }
    });

    await prisma.booking.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            statusId: 1,
            roomId: 3,
            userId: 2,
            checkIn: new Date("2026-07-05T14:00:00.000Z"),
            checkOut: new Date("2026-07-08T11:00:00.000Z"),
            guestCount: 2,
            totalPrice: 450.0
        }
    });

    console.log("Added demo data (hopefully)")
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

