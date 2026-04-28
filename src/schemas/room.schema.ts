import {z} from "zod";

export const RoomCreateSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        name: z.string(),
        count: z.number().int().optional(),
        capacity: z.number().int(),
        area: z.number().optional(),
        smokingAllowed: z.boolean(),
        bathroomPrivate: z.boolean(),
        beds: z.array(z.object({
            type: z.number().int(),
            count: z.number().int().optional()
        })),
        amenities: z.array(z.number().int()),
        pricing: z.object({
            price: z.number()
        }).optional()
    })
})

export const RoomUpdateDetailsSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        name: z.string().optional(),
        capacity: z.number().int().optional(),
        area: z.number().optional(),
        smokingAllowed: z.boolean().optional(),
        bathroomPrivate: z.boolean().optional()
    })
})

export const RoomIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    })
})

export const RoomUpdatePricing = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        price: z.number()
    })
})

export const RoomUpdateAmenities = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        amenities: z.array(z.number().int())
    })
})