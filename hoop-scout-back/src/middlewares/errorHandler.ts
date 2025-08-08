import { Request, Response, NextFunction } from "express"
import { appError } from "../types/errorType";

export default function errorHandler(error: appError, req: Request, res: Response, next: NextFunction) {
    console.log(error);
    if(error.type === "Unprocessable Entity") { 
        return res.status(422).send(error.message);
    } else if(error.type === "Conflit") { 
        return res.status(409).send(error.message);
    } else if(error.type === "Unauthorized") { 
        return res.status(401).send(error.message);
    } else if(error.type === "Not Found") { 
        return res.status(404).send(error.message);
    } else if(error.type === "Bad Request") { 
        return res.status(400).send(error.message);
    }
    
    res.sendStatus(500);
}