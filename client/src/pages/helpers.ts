import { ApplicationInputs } from '../types';

export function getFormattedData(data: ApplicationInputs) {
    const formattedAddress = {
        ...data.address,
        zipCode: data.address?.zipCode && Number(data.address?.zipCode),
    };
    const formattedVehicleData = data?.vehicles?.map((vehicle) => ({
        ...vehicle,
        year: vehicle?.year ? Number(vehicle?.year) : null,
    }));

    const formattedData = {
        ...data,
        address: formattedAddress,
        vehicles: formattedVehicleData,
        people: data.people?.length ? data.people : [],
    };

    return formattedData;
}

export function getApplicationId(pathname: string) {
    if (!pathname) return;
    const regex = /\/resume\/(\d+)/;

    const match = pathname.match(regex);
    if (match) {
        return match[1];
    }
}
