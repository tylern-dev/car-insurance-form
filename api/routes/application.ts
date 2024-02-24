import { Router } from 'express';

import * as Controllers from '../controllers/application';
import {
    applicationSchema,
    submittedApplicationSchema,
    updateSchema,
} from '../schemas/application-schemas';

const routes = Router();

const ROUTE = process.env.REDIRECT_ROUTE || 'http://localhost:5173/resume/';

routes.post('/', async (req, res) => {
    try {
        const data = applicationSchema.parse(req.body);
        const app = await Controllers.createApplication(data);

        res.json({ resume: `${ROUTE}${app.id}` });
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
});

routes.get('/:id', async (req, res) => {
    try {
        const app = await Controllers.getApplication(req.params.id);
        if (!app) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(app);
    } catch (error) {
        console.error('Error fetching application', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

routes.put('/:id', async (req, res) => {
    try {
        const data = updateSchema.parse(req.body);
        const app = await Controllers.updateApplication(req.params.id, data);
        res.json({ app });
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
});

routes.post('/:id/submit', async (req, res) => {
    try {
        const data = submittedApplicationSchema.parse(req.body);
        const app = await Controllers.validateApplication(req.params.id, data);
        res.json(app);
    } catch (error) {
        res.status(400).json(error);
    }
});

export default routes;
