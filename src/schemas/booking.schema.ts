import {z} from "zod";

export const BookingCreateSchema = z.object({
    body: z.object({
        roomId: z.number().int(),
        checkIn: z.coerce.date().refine(date => date >= new Date(), {
            message: "The date cannot be in the past"
        }),
        checkOut: z.coerce.date(),
        guestCount: z.number().int().min(1)
    }).refine(data => data.checkOut > data.checkIn, {
        message: "Check out must be after check in"
    })
})

export const BookingPaymentSchema = z.object({
    body: z.object({
        bookingId: z.number().int(),
        cardHolderName: z.string().min(3),
        cardNumber: z.string().regex(/^\d{16}$/),
        cardExpiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
        cvv: z.string().regex(/^\d{3}$/)
    })
})