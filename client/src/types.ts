import { z } from 'zod';
import { applicationSchema } from './schemas/application-schema';

type Address = {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: number;
};

export type FormValues = {
    firstName?: string;
    lastName?: string;
    dob?: string;
    address?: Address;
};

export type ApplicationInputs = z.infer<typeof applicationSchema>;
