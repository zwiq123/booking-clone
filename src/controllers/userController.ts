import {prisma} from "./../services/prismaInit";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/auth";
import { transporter } from "../services/mails";
import crypto from "crypto";

export const registerUser = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role ?? "user";

    if (!["user", "host"].includes(role)) {
        return res.status(400).json({message: "Invalid user role"});
    }

    if (!password || !email || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({message: "Not all the input fields were filled"});
    }

    if (password != confirmPassword) {
        return res.status(400).json({message: "Passwords don't match"});
    }

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
    
    const verificationLink = `http://localhost:3000/api/users/verify/registration?token=${verificationToken}`;
   
    await transporter.sendMail({
        from: `"Booking clone" <${process.env.GMAIL_NAME}>`,
        to: email,
        subject: "Booking clone account verification",
        html: `<p><b>Welcome,</b></p><p>Please verify you email <a href="${verificationLink}">here</a></p>`
    });
    return res.json({message: "2Account creation successfull. You will receive an email with a verification link shortly."});
}

export const loginUser = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role ?? "user";

    const roleObject = await prisma.role.findUnique({where: {name: role}});
    if (!roleObject) {
        return res.status(501).json({message: "Database not initialized"});
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
}

export const verifyRegistration = async (req: Request, res: Response) => {
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
}

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = res.locals.params.id;

    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            email: true,
            firstName: true,
            lastName: true,
            role: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!user) {
        return res.status(404).json({message: `User with id ${userId} not found`});
    }

    res.json(user);
}

export const getUserProfileSelf = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    res.json(user);
}

export const resetPassword = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
}