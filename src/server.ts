import express, { response } from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { createReadStream } from "fs";
import { create } from "domain";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_NAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

const generateToken = (user: {id: number; role: string}) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1d'}
    )
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message: "No authentication token provided"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded as {id: number, role: string};
        next();
    } catch (err) {
        return res.status(401).json({message: "Invalid authentication token"});
    }
};

const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({message: "Wrong user role"});
        }
        next();
    }
}

app.get("/", authenticate, authorize(["user"]), (req, res) => {
    res.send("hello world");
})

app.post("/register", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role ?? "user";

    // validation
    if (!["user", "host"].includes(role)) {
        return res.status(400).json({message: "Invalid user role"});
    }

    if (!password || !email || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({message: "Not all the input fields were filled"});
    }

    if (password != confirmPassword) {
        return res.status(400).json({message: "Passwords don't match"});
    }


    // check if exists but is not verified


    // checking if user already exists
    const roleObject = await prisma.role.findUnique({where: {name: role}});
    const existingUser = await prisma.user.findUnique({where: {email_roleId: {email, roleId: roleObject!.id}}});
    
    if (existingUser && existingUser.accountVerified) {
        return res.json({message: "1Account creation successfull. You will receive an email with a verification link shortly."});
    }

    if (existingUser && !existingUser.accountVerified) {
        await prisma.user.delete({where: {id: existingUser.id}});
    }   

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const saltRounds = 3;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
        data: {
            email,
            passwordHash,
            firstName,
            lastName,
            accountVerified: false,
            role: {
                connect: {
                    name: role
                }
            },
            verificationToken: {
                create: {
                    token: verificationToken,
                    expirationDate
                }
            }
        }
    });
    
    const verificationLink = `http://localhost:3000/verify/registration?token=${verificationToken}`;
   
    await transporter.sendMail({
        from: `"Booking clone" <${process.env.GMAIL_NAME}>`,
        to: email,
        subject: "Booking clone account verification",
        html: `<p><b>Welcome,</b></p><p>Please verify you email <a href="${verificationLink}">here</a></p>`
    });
    return res.json({message: "2Account creation successfull. You will receive an email with a verification link shortly."});
})

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role ?? "user";

    // checking if user exists
    const roleObject = await prisma.role.findUnique({where: {name: role}});
    if (!roleObject) {
        // status
        return res.status(400).json({message: "Database not initialized"});
    }
    const user = await prisma.user.findUnique({where: {email_roleId: {email, roleId: roleObject!.id}}, include: {role: true}});
    if (!user) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    res.json({message: "logged in", jwt: generateToken({id: user.id, role: user.role.name})});
})

app.get("/verify/registration", async (req, res) => {
    const token = req.query.token as string;

    if (!token) {
        return res.status(400).json({message: "Missing token"});
    }

    const verificationData = await prisma.verificationToken.findUnique({where: {token}, include: {user: true}});
    
    if (!verificationData) {
        return res.status(400).json({message: "Invalid or Expired verification link"});
    }
    
    const now = new Date();
    if (verificationData.expirationDate < now) {
        await prisma.verificationToken.delete({where: {token}})
        return res.status(400).json({message: "Expired verification token"});
    }

    // all at once
    await prisma.$transaction([
        prisma.user.update({
            where: {id: verificationData.userId},
            data: {accountVerified: true}
        }),
        prisma.verificationToken.delete({
            where: {id: verificationData.id}
        })
    ]);

    // redirect ?
    res.json({message: "Account verified. You can now log in."});
})

const calculateDistance = 
    (location1: {latitude: number, longitude: number}, 
     location2: {latitude: number, longitude: number}) => {
    
    // E/W  S/N

    return 1;
}

app.get("/properties", async (req, res) => {
    const limit = req.query.limit;
    const sort = req.query.sort;
    const distance = req.query.distance;
    // parameters

    const properties = await prisma.property.findMany();
    console.log(properties);
    res.send("yo");
})

app.post("/properties", authenticate, authorize(["host"]), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const userID: number = req.user?.id;
    const propertyName: string = req.body.name;
    const address = req.body.address;
    const rating = req.body.rating ?? null
    const propertyTypeId = req.body.type;
    const propertyDescription = req.body.propertyDescription;
    const ownerDescription = req.body.ownerDescription ?? "";
    const surroundingsDescription = req.body.surroundingsDescription ?? "";
    const amenities = req.body.amenities;
    const spokenLanguages = req.body.spokenLanguages;
    const images = req.body.images; // to change
    const rooms = req.body.rooms;

    const property = await prisma.property.create({
        data: {
            name: propertyName,
            rating,
            propertyTypeId,
            propertyDescription,
            ownerDescription,
            surroundingsDescription,
            statusId: 1,
            ownerId: userID,
            address: {
                create: {
                    latitude: address.latitude,
                    longitude: address.longitude,
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    postalCode: address.postalCode,
                    street: address.street
                }
            },
            amenities: {
                create: amenities.map(amenityID => ({amenityTypeId: amenityID}))
            },
            spokenLanguages: {
                create: spokenLanguages.map(languageID => ({languageTypeId: languageID}))
            },
            images: {
                create: images.map(img => ({isMain: img.isMain ?? false, path: img.path}))
            }
        }
    });


    // const amenityData = [];
    // for (const amenityID of amenities) {
    //     amenityData.push({amenityTypeId: amenityID, propertyId: property.id});
    // }

    // await prisma.propertyAmenity.createMany({
    //     data: amenityData
    // });

    // const languageData = [];
    // for (const languageID of spokenLanguages) {
    //     languageData.push({languageTypeId: languageID, propertyId: property.id});
    // }

    // await prisma.language.createMany({
    //     data: languageData
    // })

    // const imageData = [];
    // for (const image of images) {
    //     imageData.push({isMain: image.isMain ?? false, path: image.path, propertyId: property.id});
    // }

    // await prisma.image.createMany({
    //     data: imageData
    // })

    for (const room of rooms) {
        const count = room.count ?? 1;
        const validAmenities = room.amenities.filter((id: number) => id >= 1 && id <= 31);

        for (let i = 0 ; i < count ; i++) {
            await prisma.room.create({
                data: {
                    name: room.name,
                    propertyId: property.id,
                    capacity: room.capacity,
                    area: room.area,
                    smokingAllowed: room.smokingAllowed,
                    bathroomPrivate: room.bathroomPrivate,
                    beds: {
                        create: room.beds.map(bed => ({typeId: bed.type, count: bed.count ?? 1}))
                    },
                    amenities: {
                        create: validAmenities.map(amenityId => ({amenityTypeId: amenityId}))
                    },
                    pricing: room.pricing ? {
                        create: {price: room.pricing.price}
                    } : undefined
                }
            })
        }
    }

    res.json({message: "Property added successfully"});

    // const roomData = [];
    // const roomAmenityData = [];
    // for (const room of rooms) {
    //     const count = room.count ?? 1;
    //     const singleRoomData = {
    //         name: room.name,
    //         propertyId: property.id,
    //         capacity: room.capacity,
    //         area: room.area ?? null,
    //         smokingAllowed: room.smokingAllowed === null ? false : room.smokingAllowed,
    //         bathroomPrivate: room.bathroomPrivate === null ? true : room.bathroomPrivate,
    //     }
    //     for (let i = 0 ; i < count ; i ++) {
    //         roomData.push(singleRoomData);
    //         if (!room.amenities) continue;
    //         for (const amenity of room.amenities) {
    //         }
    //     }
    // }

    // await prisma.room.createMany({
    //     data: roomData
    // })

})

app.get("/properties/:id", async (req, res) => {
    let propertyID;
    try {
        propertyID = parseInt(req.params.id);
    } catch (err) {
        return res.status(400).json({message: "Incorrect property ID format"});
    }
    
    const property = await prisma.property.findUnique({where: {id: propertyID}});

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    res.json(property);
})

app.get("/properties/:id/rooms", async (req, res) => {
    let propertyID;
    try {
        propertyID = parseInt(req.params.id);
    } catch (err) {
        return res.status(400).json({message: "Incorrect property ID format"});
    }

    const property = await prisma.property.findUnique({where: {id: propertyID}, include: {rooms: true}});

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    res.json(property.rooms);
})

app.get("/properties/:id/reviews", async (req, res) => {
    let propertyID;
    try {
        propertyID = parseInt(req.params.id);
    } catch (err) {
        return res.status(400).json({message: "Incorrect property ID format"});
    }

    const property = await prisma.property.findUnique({where: {id: propertyID}, include: {reviews: true}});

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    res.json(property.reviews);
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
