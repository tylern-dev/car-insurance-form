import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type { FormValues } from '../types';
import FormInput from '../components/FormInput';
import { useMutation } from '@tanstack/react-query';
import { createApplication } from '../services/application-service';
import useLocalStorage from '../hooks/useLocalStorage';
import { useEffect } from 'react';
import { getApplicationId } from './helpers';
import Button from '../components/Button';
import { StyledColumn } from '../components/styled-components';
import { APIError } from '../utils/api-error';

const StartApplication = () => {
    const methods = useForm<FormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors },
    } = methods;
    const navigate = useNavigate();

    const [value, setValue] = useLocalStorage('applicationId', '');

    const mutation = useMutation({
        mutationFn: (data: any) => createApplication(data),
        onSuccess: (data) => {
            const url = new URL(data.resume);
            const applicationId = getApplicationId(url.pathname);

            if (applicationId) {
                setValue(applicationId);
            }
            navigate(url.pathname);
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

    const submitForm = (data: FormValues) => {
        const formattedData = {
            ...data,
            address: {
                ...data?.address,
                zipCode: data.address?.zipCode ? Number(data?.address?.zipCode) : null,
            },
        };

        mutation.mutate(formattedData);
    };

    useEffect(() => {
        if (value) {
            const applicationId = value;
            navigate(`/resume/${applicationId}`);
        }
    }, [value]);

    return (
        <>
            <h1 className="text-3xl font-bold underline">Start your car insurance application</h1>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <FormInput name="firstName" label="First Name" />
                    <FormInput name="lastName" label="Last Name" />

                    <FormInput
                        name="dob"
                        label="Date of Birth"
                        type="date"
                        error={errors.dob?.message}
                    />
                    <StyledColumn>
                        <FormInput name="address.street" label="Street" />
                        <FormInput name="address.city" label="City" />
                        <FormInput name="address.state" label="State" />
                        <FormInput name="address.zipCode" label="Zip Code" />
                    </StyledColumn>
                    <Button type="submit" name="Start Application" />
                </form>
            </FormProvider>
        </>
    );
};

export default StartApplication;
