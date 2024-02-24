import { APIError } from '../utils/api-error';

const RESOURCE = '/applications/';

async function fetchApi(endpoint: string, options?: RequestInit) {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
        const errorData = await response.json();

        throw new APIError('An error occured', errorData.issues);

        // throw Error(data);
    }

    return response.json();
}

const headers = {
    'Content-Type': 'application/json',
};

export async function getApplication(id: string) {
    return fetchApi(`${RESOURCE}${id}`);
}

export async function createApplication<T>(body: T) {
    return fetchApi(RESOURCE, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
}

export async function updateApplication<T>(id: string, body: T) {
    return fetchApi(`${RESOURCE}${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
    });
}

export async function submitApplication<T>(id: string, body: T) {
    return fetchApi(`${RESOURCE}${id}/submit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
}
