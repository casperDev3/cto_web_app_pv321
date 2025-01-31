import {baseUrl} from "@/constants";

interface IApi {
    getData: (
        endpoint: string,
        authToken?: string | null
    ) => Promise<any>;
}

class Api implements IApi {
    private baseUrl: string;

    constructor() {
        this.baseUrl = baseUrl;
    }

    async getData(endpoint, authToken = null): Promise<any> {
        try {
            const res = await fetch(`${this.baseUrl}/${endpoint}/`);
            if (!res.ok) {
                throw new Error('Не вдалося завантажити пости');
            }
            const data = (await res.json()).data;
            return data
        } catch (err: any) {
            throw new Error(err.message || 'Невідома помилка');
        }
    }
}

// singleton
const api = new Api();
export default api;
