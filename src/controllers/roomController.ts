import { Request, Response } from "express";
import { prisma } from "../services/prismaInit";
import { property } from "zod";

export const getRoom = async (req: Request, res: Response) => {
    const roomId = res.locals.params.id;

    const room = await prisma.room.findUnique({where: {id: roomId}, include: {bookings: true}});

    if (!room) {
        return res.status(404).json({message: `Room with id ${roomId} not found`});
    }

    res.json(room);
}

export const createRooms = async (req: Request, res: Response) => {

    const propertyID = res.locals.params.id;
    
    const property = await prisma.property.findUnique({where: {id: propertyID}});

    if (!property || property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    const rooms = req.body.rooms;

    for (const room of rooms) {
        const count = room.count ?? 1;
        const validAmenities = room.amenities.filter((id: number) => id >= 1 && id <= 31);

        for (let i = 0 ; i < count ; i++) {
            await prisma.room.create({
                data: {
                    name: room.name,
                    propertyId: propertyID,
                    capacity: room.capacity,
                    ...(room.area && {area: room.area}),
                    smokingAllowed: room.smokingAllowed,
                    bathroomPrivate: room.bathroomPrivate,
                    beds: {
                        create: room.beds.map((bed: {type: number, count?: number}) => ({typeId: bed.type, count: bed.count ?? 1}))
                    },
                    amenities: {
                        create: validAmenities.map((amenityId: number) => ({amenityTypeId: amenityId}))
                    },
                    pricing: room.pricing ? {
                        create: {price: room.pricing.price}
                    } : undefined
                }
            })
        }
    }

    res.json({message: `Successfully created room(s) for property ${property.name}`})
}

export const updateRoom = async (req: Request, res: Response) => {

    const roomID = res.locals.params.id;

    const room = await prisma.room.findUnique({where: {id: roomID}, include: {property: true}});
    if (!room || room.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Room with id ${roomID} not found or not yours`});
    }

    const {
        name,
        capacity,
        area,
        smokingAllowed,
        bathroomPrivate
    } = req.body;

    await prisma.room.update({
        where: {id: roomID},
        data: {
            ...(name && {name}),
            ...(capacity && {capacity}),
            ...(area && {area}),
            ...(smokingAllowed && {smokingAllowed}),
            ...(bathroomPrivate && bathroomPrivate),
            ...(area && {area}),
            ...(area && {area})
        }
    })

    res.json({message: `Successfully updated room with id ${roomID}`})
}

export const deleteRoom = async (req: Request, res: Response) => {

    const roomID = res.locals.params.id;

    const room = await prisma.room.findUnique({where: {id: roomID}, include: {property: true}});
    if (!room || room.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Room with id ${roomID} not found or not yours`});
    }

    // email users who booked

    await prisma.room.delete({
        where: {id: roomID}
    });

    res.json({message: `Successfully deleted room with id ${roomID}`});
}

export const updateRoomPricing = async (req: Request, res: Response) => {

    const roomID = res.locals.params.id;

    const room = await prisma.room.findUnique({where: {id: roomID}, include: {property: true, pricing: true}});
    if (!room || room.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Room with id ${roomID} not found or not yours`});
    }

    const price = req.body.price;
    const pricing = room.pricing;
    if (!pricing) {
        await prisma.pricing.create({
            data: {
                roomId: roomID,
                price: price
            }
        });
        return res.json({message: `Successfully changed pricing to ${price} PLN per night`});
    }

    await prisma.pricing.update({
        where: {id: pricing.id},
        data: {
            price: price
        }
    })

    res.json({message: `Successfully changed pricing for room ${roomID} to ${price} PLN per night`});
}

export const updateRoomAmenities = async (req: Request, res: Response) => {

    const roomID = res.locals.params.id;

    const room = await prisma.room.findUnique({where: {id: roomID}, include: {property: true, pricing: true}});
    if (!room || room.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Room with id ${roomID} not found or not yours`});
    }

    const amenities: number[] = req.body.amenities;
    const validAmenities = [];
    for (const amenityID of amenities) {
        const amenity = await prisma.roomAmenityType.findUnique({where: {id: amenityID}});
        if (amenity) {
            validAmenities.push(amenityID);
        }
    }

    await prisma.$transaction([
        prisma.roomAmenity.deleteMany({
            where: {
                roomId: roomID,
                amenityTypeId: {notIn: validAmenities}
            }
        }),
        prisma.roomAmenity.createMany({
            data: validAmenities.map(amenityID => ({
                roomId: roomID,
                amenityTypeId: amenityID
            })),
            skipDuplicates: true
        })
    ])

    res.json({message: `Successfully updated amenities for property ${property.name}`})

}