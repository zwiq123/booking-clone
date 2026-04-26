import { Request, Response } from "express";

export const uploadFiles = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length == 0) {
        return res.status(400).json({message: "No images uploaded"});
    }

    const imageUrls = files.map(file => ({
        url: `/uploads/${file.filename}`,
        originalName: file.originalname
    }));

    res.json({images: imageUrls});
}