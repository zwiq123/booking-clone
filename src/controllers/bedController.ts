import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";

export const getBedTypes = async (req: Request, res: Response) => {
    const types = await prisma.bedType.findMany();
    res.json(types);
}

export const createBed = async (req: Request, res: Response) => {

    const roomID = parseInt(req.params.id);

    const room = await prisma.room.findUnique({where: {id: roomID}, include: {property: true, pricing: true}});
    if (!room || room.property.ownerId != req.user.id) {
        return res.status(404).json({message: `Room with id ${roomID} not found or not yours`});
    }

    const bedType = req.body.type;
    const count = req.body.count;

    if (count < 1) {
        return res.status(400).json({message: "Invalid bed count"});
    }

    await prisma.bed.create({
        data: {
            roomId: roomID,
            typeId: bedType,
            ...(count && {count})
        }
    })

    res.json({message: "Successfully created bed(s)"});
}
