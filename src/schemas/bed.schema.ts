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