import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export default function schemaValidator(schema: ObjectSchema) { 
    return(req: Request, res: Response, next: NextFunction) => { 
        const validation = schema.validate(req.body);

        if(validation.error) { 
            throw { type: "Unprocessable Entity", message: validation.error.details[0].context?.label }
        }
        next();
    }
}