import {z} from "zod";

export const BedCreateSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        type: z.number().int(),
        count: z.number().optional()
    })
})

export const BedDeleteSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    })
})

export const BedUpdateSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        type: z.number().int().optional(),
        count: z.number().int().optional()
    })
})