import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASSWORD
    }
});