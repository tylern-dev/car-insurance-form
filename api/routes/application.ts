import { Router } from 'express';

import { validateApplication } from '../handlers/validateApplication';
import { updateApplication } from '../handlers/updateApplication';
import { getApplication } from '../handlers/getApplication';
import { createApplication } from '../handlers/createApplication';

const routes = Router();

routes.post('/', createApplication);
routes.get('/:id', getApplication);
routes.put('/:id', updateApplication);
routes.post('/:id/submit', validateApplication);

export default routes;
