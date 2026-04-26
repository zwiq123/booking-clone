import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";

export const getBedTypes = async (req: Request, res: Response) => {
    const types = await prisma.bedType.findMany();
    res.json(types);
}
