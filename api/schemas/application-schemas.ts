import { z } from 'zod';

const REQUIRED_AGE = 16;
const RELATIONSHIPS = ['', 'spouse', 'sibling', 'friend', 'other'] as const;
const currentYearPlusOne = new Date().getFullYear() + 1;

const addressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.number().nullable(),
});

const yearSchema = z
    .number()
    .min(1985, { message: 'Year must be 1985 or later' })
    .max(currentYearPlusOne, { message: `Year must be ${currentYearPlusOne} or earlier` })
    .nullable();

const dobSchema = z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null))
    .refine((date) => date === null || calculateAge(date) >= REQUIRED_AGE, {
        message: 'You must be at least 16 years old',
    });

export const personSchema = z
    .object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        dob: dobSchema,
        relationship: z.enum(RELATIONSHIPS).nullable(),
    })
    .partial();

export const vehicleSchema = z
    .object({
        id: z.number().nullable(),
        make: z.string(),
        model: z.string(),
        vin: z.string(),
        year: yearSchema,
    })
    .partial();

const requriedAddressSchema = addressSchema.required({
    city: true,
    state: true,
    street: true,
    zipCode: true,
});
const requiredVehicleSchema = vehicleSchema.required({
    make: true,
    model: true,
    vin: true,
    year: true,
});
const requiredPersonSchema = personSchema.required({
    dob: true,
    firstName: true,
    lastName: true,
    relationship: true,
});

export const submittedApplicationSchema = z.object({
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    dob: dobSchema,
    address: requriedAddressSchema,
    vehicles: z
        .array(requiredVehicleSchema)
        .min(1, { message: 'Must have 1 vehicle' })
        .max(3, { message: 'Cannot have more the 3 total' }),
    people: z.array(requiredPersonSchema).optional(),
});

export const applicationSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    dob: dobSchema,
    address: addressSchema,
});

export const updateSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    dob: dobSchema.nullish(),
    address: addressSchema.nullish(),
    vehicles: z.array(vehicleSchema),
    people: z.array(personSchema).nullish(),
});

function calculateAge(dob: Date) {
    const test = new Date(dob);
    const diff = Date.now() - test.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
