import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod";
import { AnyZodObject } from "zod/v3";

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })

        if (parsed.query) res.locals.query = parsed.query as any;
        if (parsed.body) res.locals.body = parsed.body;
        if (parsed.params) res.locals.params = parsed.params as any;

        return next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                status: 'fail',
                errors: err.issues.map(e => ({
                    path: e.path[1], 
                    message: e.message
                }))
            });
        }
        console.log(err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}