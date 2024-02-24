import { z } from 'zod';

const RELATIONSHIPS = ['', 'spouse', 'sibling', 'friend', 'other'] as const;

const addressSchema = z.object({
    street: z.string().min(1, { message: 'Required' }),
    city: z.string().min(1, { message: 'Required' }),
    state: z.string().min(1, { message: 'Required' }),
    zipCode: z
        .number()
        .min(1, { message: 'Required' })
        .transform((val) => Number(val))
        .nullable(),
});

const peopleSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    dob: z.string().min(1, { message: 'Required' }),
    relationship: z.enum(RELATIONSHIPS).refine((value) => RELATIONSHIPS.includes(value), {
        message: 'Required',
    }),
});

const vehicleSchema = z.object({
    make: z.string().min(1, { message: 'Required' }),
    model: z.string().min(1, { message: 'Required' }),
    year: z.number().min(1, { message: 'Required' }),
    vin: z.string().min(1, { message: 'Required' }),
});

export const applicationSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    dob: z.string().min(1, { message: 'Required' }),
    address: addressSchema.nullable(),
    people: z.array(peopleSchema),
    vehicles: z.array(vehicleSchema),
});
