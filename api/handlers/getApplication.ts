import { NextFunction, Request, Response } from 'express';
import * as Controllers from '../controllers/application';

export async function getApplication(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        const app = await Controllers.getApplication(id);
        if (!app) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(app);
    } catch (error) {
        console.error('Error fetching application', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
