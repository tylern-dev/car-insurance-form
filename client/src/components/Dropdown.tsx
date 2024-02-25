import { useFormContext } from 'react-hook-form';
import { FormField, Label, StyledSelect } from './styled-components';

type Option = {
    value: string;
    name: string;
};
type DropdownProps = {
    name: string;
    label: string;
    error?: string;
    options: Option[];
};

const Dropdown = ({ name, error, label, options }: DropdownProps) => {
    const { register } = useFormContext();

    return (
        <FormField>
            <Label>{label}</Label>
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
