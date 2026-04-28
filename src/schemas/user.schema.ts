import {z} from "zod";

export const UserRegisterSchema = z.object({
    body: z.object({
        email: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.string().optional()
    })
})

export const UserLoginSchema = z.object({
    body: z.object({
        email: z.string(),
        password: z.string(),
        role: z.string().optional()
    })
})

export const UserIdSchema = z.object({
    params: z.object({
        id: z.coerce.number()
    })
})

export const UserAccountVerificationSchema = z.object({
    query: z.object({
        token: z.string()
    })
})