import {z} from "zod";
import { AnyZodObject } from "zod/v3";

export const PropertyUpdateAmenitiesSchema = z.object({
    body: z.object({
        amenities: z.array(z.number())
    })
});

export const PropertyIdSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    })
});

export const PropertyUpdateDetailsSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        name: z.string().optional(),
        propertyDescription: z.string().optional(),
        ownerDescription: z.string().optional(),
        surroundingsDescription: z.string().optional(),
        rating: z.preprocess(val => {
            if (val == "" || val == null) return null;
            const parsed = Number(val);
            return isNaN(parsed) ? val : parsed;
        }, z.number().nullable()).optional(),
        statusId: z.number().optional(),
        propertyTypeId: z.number().optional()
    })
})

export const PropertyUpdateAddressSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        street: z.string().optional()
    })
})

export const PropertyUpdateStatusSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        statusId: z.number()
    })
})

export const PropertyCreateSchema = z.object({
    body: z.object({
        name: z.string(),
        address: z.object({
            latitude: z.coerce.number(),
            longitude: z.coerce.number(),
            country: z.string().optional(),
            state: z.string().optional(),
            city: z.string().optional(),
            postalCode: z.string().optional(),
            street: z.string().optional()
        }),
        rating: z.preprocess(val => {
            if (val == "" || val == null) return null;
            const parsed = Number(val);
            return isNaN(parsed) ? val : parsed;
        }, z.number().nullable()).optional(),
        type: z.coerce.number(),
        propertyDescription: z.string(),
        ownerDescription: z.string(),
        surroundingsDescription: z.string(),
        amenities: z.array(z.number()),
        spokenLanguages: z.array(z.number()),
        images: z.array(z.object({
            path: z.string(),
            isMain: z.boolean().optional()
        })),
        rooms: z.array(z.object({
            name: z.string(),
            capacity: z.number(),
            area: z.number().optional(),
            smokingAllowed: z.boolean(),
            bathroomPrivate: z.boolean(),
            amenities: z.array(z.number()),
            beds: z.array(z.object({
                type: z.number(),
                count: z.number().optional()
            })),
            pricing: z.object({
                price: z.number()
            }).optional(),
            count: z.number()
        }))
    })
})
