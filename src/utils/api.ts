import { baseUrl } from "@/constants";

interface IApi {
    getData: (endpoint: string, authToken?: string | null) => Promise<any>;
    postData: (endpoint: string, body: any, authToken?: string | null) => Promise<any>;
    deleteData: (endpoint: string, id: number, authToken?: string | null) => Promise<any>;
}

class Api implements IApi {
    private baseUrl: string;

    constructor() {
        this.baseUrl = baseUrl;
    }

    private async request(endpoint: string, method: string, body?: any, authToken?: string | null): Promise<any> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

            const res = await fetch(`${this.baseUrl}/${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!res.ok) {
                const errorResponse = await res.json().catch(() => null);
                throw new Error(errorResponse?.message || `HTTP Error ${res.status}`);
            }

            return await res.json().catch(() => null);
        } catch (err: any) {
            throw new Error(err.message || "Невідома помилка");
        }
    }

    async getData(endpoint: string, authToken = null): Promise<any> {
        const response = await this.request(endpoint, "GET", undefined, authToken);
        return response?.data || response;
    }

    async postData(endpoint: string, body: any, authToken: string | null = null): Promise<any> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

            const res = await fetch(`${this.baseUrl}/${endpoint}/`, {
                method: "POST",
                headers,
                body: JSON.stringify({ data: body }),
            });

            const responseData = await res.json().catch(() => null);


            return responseData?.data || responseData;
        } catch (err: any) {
            throw new Error(err.message || "Невідома помилка");
        }
    }

    async putData(endpoint: string, body: any, authToken: string | null = null): Promise<any> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

            const res = await fetch(`${this.baseUrl}/${endpoint}/`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ data: body }),
            });

            const responseData = await res.json().catch(() => null);

            return responseData?.data || responseData;
        } catch (err: any) {
            throw new Error(err.message || "Невідома помилка");
        }
    }



    async deleteData(endpoint: string, id: number, authToken = null): Promise<any> {
        const response = await this.request(`${endpoint}/${id}/`, "DELETE", undefined, authToken);
        return response?.data || response;
    }
}

// Singleton
const api = new Api();
export default api;
