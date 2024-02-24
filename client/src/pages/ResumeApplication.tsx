import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { useParams } from 'react-router';
import {
    getApplication,
    submitApplication,
    updateApplication,
} from '../services/application-service';
import { useEffect, useState } from 'react';
import { convertDateToString } from '../utils/date-utils';
import { applicationSchema } from '../schemas/application-schema';
import Dropdown from '../components/Dropdown';
import type { ApplicationInputs } from '../types';
import { APIError } from '../utils/api-error';
import { getFormattedData } from './helpers';
import { LOCAL_STORAGE_VALUE } from '../consts';
import { ZodType } from 'zod';
import Button from '../components/Button';
import styled from 'styled-components';
import { StyledColumn } from '../components/styled-components';

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

const defaultVehicle = { make: '', model: '', year: '', vin: '' };
const dropDownOptions = [
    {
        name: '',
        value: '',
    },
    {
        name: 'Spouse',
        value: 'spouse',
    },
    {
        name: 'Sibling',
        value: 'sibling',
    },
    {
        name: 'Friend',
        value: 'friend',
    },
    {
        name: 'Other',
        value: 'other',
    },
];

const customResolver =
    (schema: ZodType) => async (data: ApplicationInputs, context: unknown, options: any) => {
        const formattedData = getFormattedData(data);

        return zodResolver(schema)(formattedData, context, options);
    };

const ResumeApplication = () => {
    const params = useParams();

    const applicationId = params.id ?? '';

    const [quote, setQuote] = useState();

    const { data, isLoading } = useQuery({
        queryKey: ['application', applicationId],
        queryFn: () => getApplication(applicationId),
        enabled: !!applicationId,
    });

    const validateApplication = useMutation({
        mutationFn: (data: ApplicationInputs) => submitApplication(applicationId, data),
        onSuccess: (data) => {
            setQuote(data.quote);
            localStorage.removeItem(LOCAL_STORAGE_VALUE);
        },
        onError: (error: APIError) => {
            error.data.forEach(({ path, message }: { path: string[]; message: string }) => {
                const fieldName: any = path.join('.');
                setError(fieldName, {
                    message: message,
                });
            });
        },
    });

    const saveApplication = useMutation({
        mutationFn: (data: ApplicationInputs) => updateApplication(applicationId, data),
        onSuccess: () => alert('Application Saved'),
        onError: (error: APIError) => {
            error.data.forEach(({ path, message }: { path: string[]; message: string }) => {
                const fieldName: any = path.join('.');
                setError(fieldName, {
                    message: message,
                });
            });
        },
    });

    const methods = useForm<ApplicationInputs>({
        resolver: customResolver(applicationSchema),
    });

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        getValues,
        reset,
        formState: { errors },
    } = methods;

    console.log(errors);

    const personsFieldArray = useFieldArray({
        control,
        name: 'people',
    });

    const vehiclesFieldArray = useFieldArray({
        control,
        name: 'vehicles',
        rules: {
            maxLength: 3,
        },
    });

    const submitForm = () => {
        clearErrors();
        const data = getValues();
        const formattedData = getFormattedData(data);

        validateApplication.mutate(formattedData);
    };
    const handleSave = () => {
        clearErrors();
        const data = getValues();
        const formattedData = getFormattedData(data);
        saveApplication.mutate(formattedData);
    };

    useEffect(() => {
        if (data) {
            reset({
                ...data,
                dob: convertDateToString(data.dob),
                people: data.people.length && data.people,
                vehicles: data.vehicles.length ? data.vehicles : [defaultVehicle],
            });
        }
    }, [data, methods]);

    if (isLoading) return <h1>Loading...</h1>;

    if (quote) {
        return <h1>{`Congrats! Your price is $${quote}`}</h1>;
    }
    return (
        <>
            <h1 className="text-3xl font-bold underline">Resume your application</h1>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <FormInput
                        name="firstName"
                        label="First Name"
                        error={errors.firstName?.message}
                    />
                    <FormInput name="lastName" label="Last Name" error={errors.lastName?.message} />
                    <FormInput
                        name="dob"
                        label="Date of Birth"
                        type="date"
                        error={errors.dob?.message}
                    />
                    <StyledColumn>
                        <FormInput
                            name="address.street"
                            label="Street"
                            error={errors.address?.street?.message}
                        />
                        <FormInput
                            name="address.city"
                            label="City"
                            error={errors.address?.city?.message}
                        />
                        <FormInput
                            name="address.state"
                            label="State"
                            error={errors.address?.state?.message}
                        />
                        <FormInput
                            name="address.zipCode"
                            label="Zip Code"
                            error={errors.address?.zipCode?.message}
                        />
                    </StyledColumn>
                    <div>
                        <div>
                            <h3>Vehicles</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    vehiclesFieldArray.append({
                                        make: '',
                                        model: '',
                                        year: null,
                                        vin: '',
                                    })
                                }
                            >
                                Add Another Vehicle
                            </button>
                        </div>
                        <p>Limit 3</p>
                        {vehiclesFieldArray.fields.map((item, index) => (
                            <div key={item.id}>
                                <StyledColumn>
                                    <FormInput
                                        name={`vehicles.${index}.make`}
                                        label="Make"
                                        error={errors.vehicles?.[index]?.make?.message}
                                        rules={{ required: true }}
                                    />
                                    <FormInput
                                        name={`vehicles.${index}.model`}
                                        label="Model"
                                        error={errors.vehicles?.[index]?.model?.message}
                                    />
                                    <FormInput
                                        name={`vehicles.${index}.year`}
                                        label="Year"
                                        error={errors.vehicles?.[index]?.year?.message}
                                    />
                                    <FormInput
                                        name={`vehicles.${index}.vin`}
                                        label="VIN"
                                        error={errors.vehicles?.[index]?.vin?.message}
                                    />
                                </StyledColumn>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div>
                            <h3>Additional People</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    personsFieldArray.append({
                                        firstName: '',
                                        lastName: '',
                                        dob: '',
                                        relationship: '',
                                    })
                                }
                            >
                                Add Another Person
                            </button>
                        </div>
                        {personsFieldArray.fields.map((item, index) => (
                            <div key={index}>
                                <StyledColumn>
                                    <FormInput
                                        name={`people.${index}.firstName`}
                                        label="First Name"
                                        error={errors.people?.[index]?.firstName?.message}
                                    />
                                    <FormInput
                                        name={`people.${index}.lastName`}
                                        label="Last Name"
                                        error={errors.people?.[index]?.lastName?.message}
                                    />
                                    <FormInput
                                        name={`people.${index}.dob`}
                                        label="Date of Birth"
                                        type="date"
                                        error={errors.people?.[index]?.dob?.message}
                                    />
                                    <Dropdown
                                        name={`people.${index}.relationship`}
                                        options={dropDownOptions}
                                        error={errors.people?.[index]?.relationship?.message}
                                    />
                                </StyledColumn>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" name="Finish" />
                </form>
                <StyledButtonContainer>
                    <Button onClick={handleSave} name="Save Application" secondary />
                </StyledButtonContainer>
            </FormProvider>
        </>
    );
};

export default ResumeApplication;
