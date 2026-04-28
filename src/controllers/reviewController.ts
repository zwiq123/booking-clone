import { Request, Response } from "express";
import {prisma} from "./../services/prismaInit"

export const createReview = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const {
        bookingId,
        content,
        rating
    } = res.locals.body;

    const booking = await prisma.booking.findUnique({
        where: {id: bookingId, userId: userId, statusId: 4},
        include: {room: true}
    });

    if (!booking) {
        return res.status(400).json({message: `Cannot leave review for booking ${bookingId}`});
    }

    const existingReview = await prisma.review.findFirst({
        where: {bookingId: bookingId}
    });

    if (existingReview) {
        return res.status(400).json({message: `Review already left for booking ${bookingId}`});
    }

    const property = await prisma.property.findUnique({
        where: {id: booking.room.propertyId},
        select: {reviews: true, avgReviews: true}
    })

    if (!property) {
        return res.status(404).json({message: `Property associated with booking ${bookingId} not found`})
    }

    const reviewCount = property?.reviews.length;
    const reviewsSum = (property?.avgReviews ?? 0) * reviewCount;
    const avgReviews = (reviewsSum + rating) / (reviewCount + 1);

    await prisma.property.update({
        where: {id: booking.room.propertyId},
        data: {
            avgReviews: avgReviews
        }
    })

    await prisma.review.create({
        data: {
            rating,
            content,
            userId,
            bookingId,
            propertyId: booking.room.propertyId
        }
    })

    res.json({message: "Review left successfully"});
}

export const deleteReview = async (req: Request, res: Response) => {
    const reviewId = res.locals.params.id;
    const userId = (req as any).user.id;

    const review = await prisma.review.findUnique({where: {id: reviewId}});

    if (!review || review.userId != userId) {
        return res.status(404).json({messsage: `Review with id ${reviewId} not found or not yours`});
    }

    const property = await prisma.property.findUnique({
        where: {id: review.propertyId},
        select: {reviews: true, avgReviews: true}
    })

    if (!property) {
        return res.status(404).json({message: `Property associated with review ${reviewId} not found`})
    }

    const reviewCount = property?.reviews.length;

    await prisma.review.delete({where: {id: reviewId}});

    if (reviewCount == 1) {
        await prisma.property.update({where: {id: review.propertyId}, data: {avgReviews: null}});
        return res.json({message: "Successfully deleted review"});
    }

    const reviewsSum = (property?.avgReviews ?? 0) * reviewCount;
    const avgReviews = (reviewsSum - review.rating) / (reviewCount - 1);

    await prisma.property.update({where: {id: review.propertyId}, data: {avgReviews: avgReviews}});
    res.json({message: "Successfully deleted review"});
}
