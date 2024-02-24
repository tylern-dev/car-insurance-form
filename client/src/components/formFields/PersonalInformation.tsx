import { FieldErrors } from 'react-hook-form';
import FormInput from '../FormInput';
import { StyledColumn } from '../styled-components';
import { ApplicationInputs } from '../../types';

type Props = {
    errors: FieldErrors<ApplicationInputs>;
};

const PersonalInformation = ({ errors }: Props) => {
    return (
        <>
            <FormInput name="firstName" label="First Name" error={errors.firstName?.message} />
            <FormInput name="lastName" label="Last Name" error={errors.lastName?.message} />
            <FormInput name="dob" label="Date of Birth" type="date" error={errors.dob?.message} />
            <StyledColumn>
                <FormInput
                    name="address.street"
                    label="Street"
                    error={errors.address?.street?.message}
                />
                <FormInput name="address.city" label="City" error={errors.address?.city?.message} />
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
        </>
    );
};

export default PersonalInformation;
