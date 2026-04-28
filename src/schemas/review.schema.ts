import {z} from "zod";

export const ReviewCreateSchema = z.object({
    body: z.object({
        bookingId: z.number().int(),
        content: z.string().optional(),
        rating: z.number().min(0).max(10)
    })
})

export const ReviewDeleteSchema = z.object({
    params: z.object({
        id: z.number().int()
    })
})