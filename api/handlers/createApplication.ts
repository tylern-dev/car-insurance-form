import { NextFunction, Request, Response } from 'express';
import { applicationSchema } from '../schemas/application-schemas';
import * as Controllers from '../controllers/application';

const ROUTE = process.env.REDIRECT_ROUTE || 'http://localhost:5173/resume/';

export async function createApplication(req: Request, res: Response, next: NextFunction) {
    try {
        const data = applicationSchema.parse(req.body);
        const app = await Controllers.createApplication(data);

        res.json({ resume: `${ROUTE}${app.id}` });
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
}
