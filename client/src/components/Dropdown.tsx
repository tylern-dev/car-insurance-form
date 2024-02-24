import { Controller, useFormContext } from 'react-hook-form';
import { FormField, Label, StyledSelect } from './styled-components';

type Option = {
    value: string;
    name: string;
};
type DropdownProps = {
    name: string;
    error?: string;
    options: Option[];
};

const Dropdown = ({ name, error, options }: DropdownProps) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <FormField>
            <Label>Relationship</Label>
            <StyledSelect {...register(name)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </StyledSelect>
            {error && <p>{error}</p>}
        </FormField>
    );
};

export default Dropdown;
