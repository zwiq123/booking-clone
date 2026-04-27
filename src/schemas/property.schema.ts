import {z} from "zod";
import { AnyZodObject } from "zod/v3";

export const PropertyGetUserSchema = z.object({
    query: z.object({
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),

        minReviewRating: z.coerce.number().optional(),
        minCapacity: z.coerce.number().int().optional(),

        ratings: z.preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (val === undefined || val === "") return [];
            if (typeof val === "string") return val.split(",");
            return [];
        }, z.array(z.coerce.number().int().min(1).max(5))).optional(),
        typeIds: z.preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (val === undefined || val === "") return [];
            if (typeof val === "string") return val.split(",");
            return [];
        }, z.array(z.coerce.number().int().min(1).max(16))).optional(),
        pAmenityIds: z.preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (val === undefined || val === "") return [];
            if (typeof val === "string") return val.split(",");
            return [];
        }, z.array(z.coerce.number().int().min(1).max(20))).optional(),
        rAmenityIds: z.preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (val === undefined || val === "") return [];
            if (typeof val === "string") return val.split(",");
            return [];
        }, z.array(z.coerce.number().int().min(1).max(31))).optional(),
        languageIds: z.preprocess((val) => {
            if (Array.isArray(val)) return val;
            if (val === undefined || val === "") return [];
            if (typeof val === "string") return val.split(",");
            return [];
        }, z.array(z.coerce.number().int().min(1).max(3))).optional(),
        
        latitude: z.coerce.number().min(-90).max(90).optional(),
        longitude: z.coerce.number().min(-180).max(180).optional(),
        radius: z.coerce.number().positive().optional(),

        limit: z.coerce.number().int().min(1).max(150).default(40),
        sort: z.enum(["price", "id", "rating", "createdAt", "reviews"]).default("id"),
        order: z.enum(["asc", "desc"]).default("desc"),
        page: z.coerce.number().int().catch(1)
    })
})

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
        latitude: z.coerce.number().min(-90).max(90).optional(),
        longitude: z.coerce.number().min(-180).max(180).optional(),
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
            latitude: z.coerce.number().min(-90).max(90),
            longitude: z.coerce.number().min(-180).max(180),
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
