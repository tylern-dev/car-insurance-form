import { z } from 'zod';
import db from '../db';
import { applicationSchema, updateSchema } from '../schemas/application-schemas';
import { Prisma, PrismaClient } from '@prisma/client';
import type { ApplicationData, Person, SubmittedData, UpdateData, Vehicle } from '../types';
import { relationshipTypes } from '../utils/constants';
import { parseDate } from '../utils/parse-date';

export async function createApplication(data: ApplicationData) {
    try {
        const app = await updateOrCreateApplication({ client: db, data });

        return app;
    } catch (error) {
        throw error;
    }
}

export async function getApplication(id: string) {
    const applicationId = Number(id);
    const app = await db.application.findUnique({
        where: { id: applicationId },
        include: {
            address: true,
            people: true,
            vehicles: true,
        },
    });
    return app;
}

export async function updateApplication(id: string, data: UpdateData) {
    const applicationId = Number(id);

    const { address, people, vehicles, firstName, lastName, dob } = data || {};

    try {
        await db.$transaction(async (client) => {
            await updateOrCreateApplication({
                client,
                data: { address, firstName, lastName, dob },
                applicationId,
            });
            await updateOrCreatePeople({ client, people, applicationId });
            await updateOrCreateVehicles({ client, vehicles, applicationId });
        });

        return await getApplication(id);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function validateApplication(id: string, data: SubmittedData) {
    try {
        const isCompleted = true;
        const updateData = {
            ...data,
            completedOn: new Date(),
        };
        await updateApplication(id, updateData);

        return { quote: 29 };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function updateOrCreatePeople({
    client,
    people,
    applicationId,
}: {
    client: Prisma.TransactionClient | PrismaClient;
    people?: UpdateData['people'];
    applicationId: number;
}) {
    if (!people || people.length === 0) return;

    for (const person of people) {
        const data = {
            firstName: person?.firstName,
            lastName: person?.lastName,
            relationship: person?.relationship,
            dob: person?.dob && parseDate(String(person.dob)),
            applicationId,
        };
        if (person.id) {
            await client.people.update({ where: { id: person.id }, data });
        } else {
            await client.people.create({ data });
        }
    }
}

async function updateOrCreateVehicles({
    client,
    vehicles,
    applicationId,
}: {
    client: Prisma.TransactionClient | PrismaClient;
    vehicles?: UpdateData['vehicles'];
    applicationId: number;
}) {
    if (!vehicles || vehicles.length === 0) return;

    for (const vehicle of vehicles) {
        const data = {
            make: vehicle?.make,
            model: vehicle?.model,
            year: vehicle?.year,
            vin: vehicle?.vin,
            applicationId,
        };
        if (vehicle.id) {
            await client.vehicle.update({ where: { id: vehicle.id }, data });
        } else {
            await client.vehicle.create({ data });
        }
    }
}

async function updateOrCreateApplication({
    client,
    data,
    applicationId,
}: {
    client: Prisma.TransactionClient | PrismaClient;
    data: ApplicationData;
    applicationId?: number;
}) {
    const applicationData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        dob: data?.dob && parseDate(String(data.dob)),
        address: {
            [applicationId ? 'update' : 'create']: {
                street: data?.address?.street,
                city: data?.address?.city,
                state: data?.address?.state,
                zipCode: data?.address?.zipCode,
            },
        },
    };
    if (!applicationId) {
        return await client.application.create({ data: applicationData });
    } else {
        return await client.application.update({
            where: { id: applicationId },
            data: applicationData,
        });
    }
}
