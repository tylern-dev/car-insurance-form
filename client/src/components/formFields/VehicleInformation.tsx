import { FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { ApplicationInputs } from '../../types';
import { StyledColumn, StyledSection } from '../styled-components';
import FormInput from '../FormInput';

type Props = {
    fieldArray: UseFieldArrayReturn<ApplicationInputs, 'vehicles'>;
    errors: FieldErrors<ApplicationInputs>;
};
const VehicleInformation = ({ fieldArray, errors }: Props) => {
    return fieldArray.fields.map((item, index) => (
        <StyledSection key={item.id}>
            <StyledColumn>
                <FormInput
                    name={`vehicles.${index}.make`}
                    label="Make"
                    error={errors.vehicles?.[index]?.make?.message}
                />
                <FormInput
                    name={`vehicles.${index}.model`}
                    label="Model"
                    error={errors.vehicles?.[index]?.model?.message}
                />
                <FormInput
                    name={`vehicles.${index}.year`}
                    label="Year"
                    error={errors.vehicles?.[index]?.year?.message}
                />
                <FormInput
                    name={`vehicles.${index}.vin`}
                    label="VIN"
                    error={errors.vehicles?.[index]?.vin?.message}
                />
            </StyledColumn>
        </StyledSection>
    ));
};

export default VehicleInformation;
