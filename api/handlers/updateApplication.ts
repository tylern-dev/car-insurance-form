import { NextFunction, Request, Response } from 'express';
import { updateSchema } from '../schemas/application-schemas';
import * as Controllers from '../controllers/application';

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        const data = updateSchema.parse(req.body);
        const app = await Controllers.updateApplication(id, data);
        res.json({ app });
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
}
