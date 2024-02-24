import { useState } from 'react';
import { APIError } from '../utils/api-error';
import { LOCAL_STORAGE_VALUE } from '../consts';
import { ApplicationInputs } from '../types';
import { submitApplication } from '../services/application-service';
import { UseFormSetError } from 'react-hook-form';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';

type ReturnShape = {
    mutate: UseMutateFunction<any, APIError, any, unknown>;
    quote: string;
};
export const useValidateApplication = (
    applicationId: string,
    setError: UseFormSetError<ApplicationInputs>
): ReturnShape => {
    const [quote, setQuote] = useState('');

    const mutation = useMutation({
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

    return { mutate: mutation.mutate, quote };
};
