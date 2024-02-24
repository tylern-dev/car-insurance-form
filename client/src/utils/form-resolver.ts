import { ZodType } from 'zod';
import { ApplicationInputs } from '../types';
import { getFormattedData } from '../pages/helpers';
import { zodResolver } from '@hookform/resolvers/zod';

export const customResolver =
    (schema: ZodType) => async (data: ApplicationInputs, context: unknown, options: any) => {
        const formattedData = getFormattedData(data);

        return zodResolver(schema)(formattedData, context, options);
    };
