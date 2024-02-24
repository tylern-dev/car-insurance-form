import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type { FormValues } from '../types';
import { useEffect } from 'react';
import Button from '../components/Button';
import PersonalInformation from '../components/formFields/PersonalInformation';
import { useCreateApplication } from '../hooks/useCreateApplication';

const StartApplication = () => {
    const methods = useForm<FormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors },
    } = methods;
    const navigate = useNavigate();

    const { mutate, applicationId } = useCreateApplication(setError);

    const submitForm = (data: FormValues) => {
        const formattedData = {
            ...data,
            address: {
                ...data?.address,
                zipCode: data.address?.zipCode ? Number(data?.address?.zipCode) : null,
            },
        };

        mutate(formattedData);
    };

    useEffect(() => {
        if (applicationId) {
            navigate(`/resume/${applicationId}`);
        }
    }, [applicationId]);

    return (
        <>
            <h1 className="text-3xl font-bold underline">Start your car insurance application</h1>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <PersonalInformation errors={errors} />
                    <Button type="submit" name="Start Application" />
                </form>
            </FormProvider>
        </>
    );
};

export default StartApplication;
