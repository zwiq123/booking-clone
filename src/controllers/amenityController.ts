import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";

export const getRoomAmenityTypes = async (req: Request, res: Response) => {
    const types = await prisma.roomAmenityType.findMany();
    res.json(types);
}

export const getRoomAmenityCategories = async (req: Request, res: Response) => {
    const types = await prisma.roomAmenityCategory.findMany();
    res.json(types);
}

export const getPropertyAmenityTypes = async (req: Request, res: Response) => {
    const types = await prisma.propertyAmenityType.findMany();
    res.json(types);
}