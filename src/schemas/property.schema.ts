import {z} from "zod";

export const updatePropertyAmenitiesSchema = z.object({
    body: z.object({
        amenities: z.array(z.number())
    })
})