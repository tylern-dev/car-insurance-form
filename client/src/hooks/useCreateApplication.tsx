import { useNavigate } from 'react-router';
import useLocalStorage from './useLocalStorage';
import { createApplication } from '../services/application-service';
import { getApplicationId } from '../pages/helpers';
import { APIError } from '../utils/api-error';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { UseFormSetError } from 'react-hook-form';
import { FormValues } from '../types';

type ReturnShape = {
    mutate: UseMutateFunction<any, APIError, any, unknown>;
    applicationId: string;
};
export const useCreateApplication = (setError: UseFormSetError<FormValues>): ReturnShape => {
    const navigate = useNavigate();
    const [applicationId, setApplicationId] = useLocalStorage('applicationId', '');

    const mutation = useMutation({
        mutationFn: (data: any) => createApplication(data),
        onSuccess: (data) => {
            const url = new URL(data.resume);
            const id = getApplicationId(url.pathname);
            if (id) {
                setApplicationId(id);
                navigate(url.pathname);
            }
        },
        onError: (error: APIError) => {
            error.data.forEach(({ path, message }: { path: string[]; message: string }) => {
                const fieldName: any = path.join('.');
                setError(fieldName, { type: 'manual', message });
            });
        },
    });

    return { mutate: mutation.mutate, applicationId };
};
