import {z} from "zod";

export const ImageIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    })
})