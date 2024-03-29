import { FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { ApplicationInputs } from '../../types';
import { StyledColumn, StyledSection } from '../styled-components';
import FormInput from '../FormInput';
import Dropdown from '../Dropdown';
import styled from 'styled-components';

type Props = {
    fieldArray: UseFieldArrayReturn<ApplicationInputs, 'people'>;
    errors: FieldErrors<ApplicationInputs>;
};
const dropDownOptions = [
    {
        name: '',
        value: '',
    },
    {
        name: 'Spouse',
        value: 'spouse',
    },
    {
        name: 'Sibling',
        value: 'sibling',
    },
    {
        name: 'Friend',
        value: 'friend',
    },
    {
        name: 'Other',
        value: 'other',
    },
];
const PeopleInformation = ({ fieldArray, errors }: Props) => {
    return fieldArray.fields.map((item, index) => (
        <StyledSection key={index}>
            <StyledColumn>
                <FormInput
                    name={`people.${index}.firstName`}
                    label="First Name"
                    error={errors.people?.[index]?.firstName?.message}
                />
                <FormInput
                    name={`people.${index}.lastName`}
                    label="Last Name"
                    error={errors.people?.[index]?.lastName?.message}
                />

                <FormInput
                    name={`people.${index}.dob`}
                    label="Date of Birth"
                    type="date"
                    error={errors.people?.[index]?.dob?.message}
                />
                <Dropdown
                    name={`people.${index}.relationship`}
                    label="Relationship"
                    options={dropDownOptions}
                    error={errors.people?.[index]?.relationship?.message}
                />
            </StyledColumn>
        </StyledSection>
    ));
};

export default PeopleInformation;
