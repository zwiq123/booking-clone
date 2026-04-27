import {z} from "zod";

export const BedCreateSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        type: z.number(),
        count: z.number().optional()
    })
})

export const BedDeleteSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    })
})

export const BedUpdateSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        type: z.number().optional(),
        count: z.number().optional()
    })
})