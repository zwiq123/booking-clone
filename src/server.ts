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
            userID: user.id,
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
        req.user = decoded as any;
        next();
    } catch (err) {
        return res.status(401).json({message: "Invalid authentication token"});
    }
};

const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({message: "Worng user role"});
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
        return res.json({message: "1Account creation succesfull. You will receive an email with a verification link shortly."});
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
    return res.json({message: "2Account creation succesfull. You will receive an email with a verification link shortly."});
})

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role ?? "user";

    // checking if user exists
    const roleObject = await prisma.role.findUnique({where: {name: role}});
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

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
