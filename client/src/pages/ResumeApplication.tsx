import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getApplication } from '../services/application-service';
import { convertDateToString } from '../utils/date-utils';
import { applicationFormSchema } from '../schemas/application-schema';
import type { ApplicationInputs } from '../types';
import { getFormattedData } from './helpers';
import Button from '../components/Button';
import PersonalInformation from '../components/formFields/PersonalInformation';
import VehicleInformation from '../components/formFields/VehicleInformation';
import PeopleInformation from '../components/formFields/PeopleInformation';
import { useValidateApplication } from '../hooks/useValidateApplication';
import { useSaveApplication } from '../hooks/useSaveApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import Loading from '../components/Loading';
import Quote from '../components/Quote';
import { StyledButtonContainer } from '../components/styled-components';

const defaultVehicle = { make: '', model: '', year: '', vin: '' };

const ResumeApplication = () => {
    const params = useParams();

    const applicationId = params.id ?? '';

    const methods = useForm<ApplicationInputs>({
        resolver: zodResolver(applicationFormSchema),
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
        const formattedData = applicationFormSchema.parse(data);
        validateApplication(formattedData);
    };
    const handleSave = () => {
        clearErrors();
        const data = getValues();
        const formattedData = getFormattedData(data);
        saveApplication(formattedData);
    };

    const isAddVehicleButtonDisabled = vehiclesFieldArray.fields.length >= 3;

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

    if (isLoading) return <Loading />;

    if (quote) {
        return <Quote quote={quote} />;
    }
    return (
        <>
            <h1>Resume your application</h1>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <PersonalInformation errors={errors} />
                    <div>
                        <div>
                            <h2>Vehicles</h2>
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
                            <h2>Additional People</h2>
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
                    <StyledButtonContainer>
                        <Button name="Finish" type="submit" />
                        <Button onClick={handleSave} name="Save Application" theme="secondary" />
                    </StyledButtonContainer>
                </form>
            </FormProvider>
        </>
    );
};

export default ResumeApplication;
