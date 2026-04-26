import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";

export const getLanguageTypes = async (req: Request, res: Response) => {
    const types = await prisma.languageType.findMany();
    res.json(types);
}
