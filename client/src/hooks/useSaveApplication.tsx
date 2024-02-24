import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { ApplicationInputs } from '../types';
import { updateApplication } from '../services/application-service';
import { UseFormSetError } from 'react-hook-form';
import { APIError } from '../utils/api-error';

type ReturnShape = {
    mutate: UseMutateFunction<any, APIError, any, unknown>;
};

export const useSaveApplication = (
    applicationId: string,
    setError: UseFormSetError<ApplicationInputs>
): ReturnShape => {
    const mutation = useMutation({
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

    return { mutate: mutation.mutate };
};
