import { NextFunction, Request, Response } from 'express';
import { submittedApplicationSchema } from '../schemas/application-schemas';
import * as Controllers from '../controllers/application';

export async function validateApplication(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        const data = submittedApplicationSchema.parse(req.body);
        const app = await Controllers.validateApplication(id, data);
        res.json(app);
    } catch (error) {
        res.status(400).json(error);
    }
}
