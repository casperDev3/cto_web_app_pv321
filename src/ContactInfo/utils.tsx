const API_URL = "http://127.0.0.1:8000/api/general-info/";

export interface GeneralInfo {
    id?: number;
    site_name: string;
    email: string;
    phone: string;
    address: string;
    about?: string;
}

export async function getGeneralInfo(): Promise<GeneralInfo[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}
