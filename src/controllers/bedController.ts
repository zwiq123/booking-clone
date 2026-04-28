import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";

export const getBedTypes = async (req: Request, res: Response) => {
    const types = await prisma.bedType.findMany();
    res.json(types);
}

export const createBed = async (req: Request, res: Response) => {

    const roomID = res.locals.params.id;

    const room = await prisma.room.findUnique({where: {id: roomID}, include: {property: true}});
    if (!room || room.property.ownerId != (req as any).user.id) {
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

export const deleteBed = async (req: Request, res: Response) => {
    const bedId = res.locals.params.id;

    const bed = await prisma.bed.findUnique({where: {id: bedId}, include: {room: {include: {property: true}}}});

    if (!bed || bed.room.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Bed with id ${bedId} not found or not yours`});
    }

    // email booked / disable if booked

    await prisma.bed.delete({where: {id: bedId}});
    res.json({message: `Successfully deleted bed with id ${bedId}`});
}

export const updateBed = async (req: Request, res: Response) => {
    const bedId = res.locals.params.id;

    const bed = await prisma.bed.findUnique({where: {id: bedId}, include: {room: {include: {property: true}}}});

    if (!bed || bed.room.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Bed with id ${bedId} not found or not yours`});
    }

    const bedTypeId = req.body.type;
    const count = req.body.type;

    const bedType = await prisma.bedType.findUnique({where: {id: bedTypeId}});
    if (!bedType) { 
        return res.status(404).json({message: `Bed type with id ${bedId} not found`});
    }

    await prisma.bed.update({
        where: {id: bedId},
        data: {
            ...(count && {count}),
            ...(bedTypeId && {typeId: bedTypeId})
        }
    })

    res.json({message: `Successfully updated bed with id ${bedId}`});
}
