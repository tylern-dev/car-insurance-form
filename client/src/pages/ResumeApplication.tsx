import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getApplication } from '../services/application-service';
import { useEffect, useState } from 'react';
import { convertDateToString } from '../utils/date-utils';
import { applicationSchema } from '../schemas/application-schema';
import type { ApplicationInputs } from '../types';
import { getFormattedData } from './helpers';
import Button from '../components/Button';
import styled from 'styled-components';
import PersonalInformation from '../components/formFields/PersonalInformation';
import VehicleInformation from '../components/formFields/VehicleInformation';
import PeopleInformation from '../components/formFields/PeopleInformation';
import { useValidateApplication } from '../hooks/useValidateApplication';
import { useSaveApplication } from '../hooks/useSaveApplication';
import { customResolver } from '../utils/form-resolver';

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

const defaultVehicle = { make: '', model: '', year: '', vin: '' };

const ResumeApplication = () => {
    const params = useParams();

    const applicationId = params.id ?? '';

    const [isAddVehicleButtonDisabled, setAddVehicleButtonDisabled] = useState(false);

    const methods = useForm<ApplicationInputs>({
        resolver: customResolver(applicationSchema),
    });

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        getValues,
        reset,
        formState: { errors },
    } = methods;

    const { data, isLoading } = useQuery({
        queryKey: ['application', applicationId],
        queryFn: () => getApplication(applicationId),
        enabled: !!applicationId,
    });

    const { mutate: validateApplication, quote } = useValidateApplication(applicationId, setError);

    const { mutate: saveApplication } = useSaveApplication(applicationId, setError);

    const personsFieldArray = useFieldArray({
        control,
        name: 'people',
    });

    const vehiclesFieldArray = useFieldArray({
        control,
        name: 'vehicles',
        rules: {
            maxLength: 3,
        },
    });

    const submitForm = () => {
        clearErrors();
        const data = getValues();
        const formattedData = getFormattedData(data);

        validateApplication(formattedData);
    };
    const handleSave = () => {
        clearErrors();
        const data = getValues();
        const formattedData = getFormattedData(data);
        saveApplication(formattedData);
    };
    useEffect(() => {
        if (vehiclesFieldArray.fields.length === 3) {
            setAddVehicleButtonDisabled(true);
        }
    });
    useEffect(() => {
        if (data) {
            reset({
                ...data,
                dob: convertDateToString(data.dob),
                people: data.people.length && data.people,
                vehicles: data.vehicles.length ? data.vehicles : [defaultVehicle],
            });
        }
    }, [data, methods]);

    if (isLoading) return <h1>Loading...</h1>;

    if (quote) {
        return <h1>{`Congrats! Your price is $${quote}`}</h1>;
    }
    return (
        <>
            <h1>Resume your application</h1>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <PersonalInformation errors={errors} />
                    <div>
                        <div>
                            <h3>Vehicles</h3>
                            <button
                                disabled={isAddVehicleButtonDisabled}
                                type="button"
                                onClick={() =>
                                    vehiclesFieldArray.append({
                                        make: '',
                                        model: '',
                                        year: null,
                                        vin: '',
                                    })
                                }
                            >
                                Add Another Vehicle
                            </button>
                        </div>
                        <p>Limit 3</p>
                        <VehicleInformation fieldArray={vehiclesFieldArray} errors={errors} />
                    </div>
                    <div>
                        <div>
                            <h3>Additional People</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    personsFieldArray.append({
                                        firstName: '',
                                        lastName: '',
                                        dob: '',
                                        relationship: '',
                                    })
                                }
                            >
                                Add Another Person
                            </button>
                        </div>
                        <PeopleInformation fieldArray={personsFieldArray} errors={errors} />
                    </div>
                    <Button type="submit" name="Finish" />
                </form>
                <StyledButtonContainer>
                    <Button onClick={handleSave} name="Save Application" secondary />
                </StyledButtonContainer>
            </FormProvider>
        </>
    );
};

export default ResumeApplication;
