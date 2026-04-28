import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";
import { executionAsyncId } from "node:async_hooks";

export const createBooking = async (req: Request, res: Response) => {
    const {
        roomId,
        newCheckIn,
        newCheckOut,
        guestCount
    } = res.locals.body

    const room = await prisma.room.findUnique({where: {id: roomId}, include: {property: true, pricing: true}});

    if (!room || room.property.statusId != 1) {
        return res.status(404).json({message: `Room with id ${roomId} not found`})
    }

    if (!room.pricing) {
        return res.status(404).json({message: `Room with id ${roomId} has no pricing set`})
    }

    const existingBooking = await prisma.booking.findFirst({
        where: {
            roomId: roomId,
            OR: [
                {
                    AND: [
                        {checkIn: {lte: newCheckIn}},
                        {checkOut: {gt: newCheckIn}}
                    ]
                },
                {
                    AND: [
                        {checkIn: {lt: newCheckOut}},
                        {checkOut: {gte: newCheckOut}}
                    ]
                }
            ]
        }
    })

    if (existingBooking) {
        return res.json({message: "Room is already booked for these dates"});
    }

    const diffInMs = new Date(newCheckOut).getTime() - new Date(newCheckIn).getTime();
    const nightCount = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (nightCount <= 0) {
        return res.status(400).json({message: "Check out must be at least a day after check in"})
    }

    const booking = await prisma.booking.create({
        data: {
            statusId: 1,
            roomId,
            userId: (req as any).user.id,
            checkIn: newCheckIn,
            checkOut: newCheckOut,
            guestCount,
            totalPrice: room.pricing?.price * guestCount * nightCount
        }
    })

    res.json({
        message: `Room booked successfully. Continue to payment`,
        bookingId: booking.id,
        paymentEndpoint: "/api/bookings/pay"
    })
}

export const payForBooking = async (req: Request, res: Response) => {
    const {
        bookingId,
        cardNumber,
    } = res.locals.body

    const booking = await prisma.booking.findUnique({where: {id: bookingId}});

    if (!booking || booking.userId != (req as any).user.id) {
        return res.status(404).json({message: `Booking with id ${bookingId} not found or not yours`});
    }

    if (cardNumber === "1111111111111111") {
        return res.json({message: `Payment unsuccessful. Not enough funds on card`})
    } else if (cardNumber === "2222222222222222") {
        await prisma.booking.update({
            where: {id: bookingId},
            data: {statusId: 2}
        })
        return res.json({message: `Payment successful. Booking confirmed`});
    }

    res.json({message: "Payment unsuccessful. Invalid card info"});
}

export const getUserBookings = async (req: Request, res: Response) => {
    const bookings = await prisma.booking.findMany({
        where: {userId: (req as any).user.id}
    })

    res.json(bookings);
}

export const getHostBookings = async (req: Request, res: Response) => {
    const bookings = await prisma.booking.findMany({
        where: {room: {
            property: {
                ownerId: (req as any).user.id
            }
        }}
    })

    res.json(bookings);
}

export const updateBookings = async (req: Request, res: Response) => {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const now = new Date();

    await prisma.$transaction([
        prisma.booking.deleteMany({
            where: {statusId: 1, createdAt: {lt: threeMinutesAgo}}
        }),
        prisma.booking.updateMany({
            where: {statusId: 2, checkIn: {lte: now}, checkOut: {gt: now}},
            data: {statusId: 3}
        }),
        prisma.booking.updateMany({
            where: {statusId: 3, checkOut: {lte: now}},
            data: {statusId: 4}
        })
    ])

    res.json({message: "Updated bookings"})
}