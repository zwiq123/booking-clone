import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const generateToken = (user: {id: number; role: string}) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1d'}
    )
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
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

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({message: "Wrong user role"});
        }
        next();
    }
}