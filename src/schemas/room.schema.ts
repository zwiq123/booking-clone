import {z} from "zod";

export const RoomCreateSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        name: z.string(),
        count: z.number().optional(),
        capacity: z.number(),
        area: z.number().optional(),
        smokingAllowed: z.boolean(),
        bathroomPrivate: z.boolean(),
        beds: z.array(z.object({
            type: z.number(),
            count: z.number().optional()
        })),
        amenities: z.array(z.number()),
        pricing: z.object({
            price: z.number()
        }).optional()
    })
})

export const RoomUpdateDetailsSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        name: z.string().optional(),
        capacity: z.number().optional(),
        area: z.number().optional(),
        smokingAllowed: z.boolean().optional(),
        bathroomPrivate: z.boolean().optional()
    })
})

export const RoomDeleteSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    })
})

export const RoomUpdatePricing = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        price: z.number()
    })
})

export const RoomUpdateAmenities = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        amenities: z.array(z.number())
    })
})