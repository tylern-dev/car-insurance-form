import { z } from 'zod';
import { relationshipTypes } from './utils/constants';
import {
    applicationSchema,
    personSchema,
    submittedApplicationSchema,
    updateSchema,
    vehicleSchema,
} from './schemas/application-schemas';

export type ApplicationData = z.infer<typeof applicationSchema>;
export type UpdateData = z.infer<typeof updateSchema>;
export type SubmittedData = z.infer<typeof submittedApplicationSchema>;
export type Person = z.infer<typeof personSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
