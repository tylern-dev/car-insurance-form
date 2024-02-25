import { z } from 'zod';

const RELATIONSHIPS = ['', 'spouse', 'sibling', 'friend', 'other'] as const;

const addressSchema = z.object({
    street: z.string().min(1, { message: 'Required' }),
    city: z.string().min(1, { message: 'Required' }),
    state: z.string().min(1, { message: 'Required' }),
    zipCode: z
        .union([z.string(), z.number(), z.null()])
        .refine(
            (val) => {
                if (typeof val === 'string') {
                    return val.length > 1;
                } else if (typeof val === 'number') {
                    return val > 1;
                }
            },
            {
                message: 'Required',
            }
        )
        .transform((val) => Number(val)),
});

const peopleSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    dob: z.string().min(1, { message: 'Required' }),
    relationship: z.enum(RELATIONSHIPS),
});

const vehicleSchema = z.object({
    make: z.string().min(1, { message: 'Required' }),
    model: z.string().min(1, { message: 'Required' }),
    year: z
        .union([z.string(), z.number(), z.null()])
        .refine(
            (val) => {
                if (typeof val === 'string') {
                    return val.length > 1;
                } else if (typeof val === 'number') {
                    return val > 1;
                }
            },
            {
                message: 'Required',
            }
        )
        .transform((val) => Number(val)),
    vin: z.string().min(1, { message: 'Required' }),
});

export const applicationSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    dob: z.string().min(1, { message: 'Required' }),
    address: addressSchema,
    people: z
        .union([z.array(peopleSchema), z.number()])
        .transform((data) => (Array.isArray(data) ? data : [])),
    vehicles: z.array(vehicleSchema),
});
