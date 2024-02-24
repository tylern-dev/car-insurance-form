import { HTMLInputTypeAttribute } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { FormField, Input, Label } from './styled-components';
import ErrorMessage from './ErrorMessage';

type FormInputProps = {
    name: string;
    label: string;
    type?: HTMLInputTypeAttribute;
    rules?: RegisterOptions;
    error?: string;
};

const FormInput = ({ name, label, type = 'text', rules, error, ...rest }: FormInputProps) => {
    const { register } = useFormContext();
    return (
        <FormField>
            <Label htmlFor={name}>{label}</Label>
            <Input type={type} {...register(name, rules)} id={name} {...rest} />
            {error && <ErrorMessage message={error} />}
        </FormField>
    );
};

export default FormInput;
