import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod";
import { AnyZodObject } from "zod/v3";

export const validateIntParams = (params: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        for (const param of params) {
            const value = String(req.params[param]);
            if (isNaN(parseInt(value))) {
                return res.status(400).json({message: `Invalid param: ${param}. It must be a number`});
            }
            req.params[param] = String(parseInt(value));
        }
        next();
    } catch {
        res.status(400).json({message: "Param validation fail"});
    }
}

export const validateIntBodyFields = (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        for (const field of fields) {
            if (!(field in req.body)) continue;
            const value = req.body[field];
            if (isNaN(parseInt(value))) {
                return res.status(400).json({message: `Invalid field: ${field}. It must be a number`});
            }
            req.body[field] = parseInt(value);
        }
        next();
    } catch (err){
        res.status(400).json({message: "Field validation fail " + err});
    }
}

export const validateFloatBodyFields = (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        for (const field of fields) {
            if (!(field in req.body)) continue;
            const value = req.body[field];
            if (isNaN(parseFloat(value))) {
                return res.status(400).json({message: `Invalid field: ${field}. It must be a float`});
            }
            req.body[field] = parseFloat(value);
        }
        next();
    } catch (err){
        res.status(400).json({message: "Field validation fail " + err});
    }
}

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
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
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}