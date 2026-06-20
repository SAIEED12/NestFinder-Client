import { getTokenServer } from "../getTokenServer";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const getProperty = async (page) => {
    const currentPage = page || 1;
    const token = await getTokenServer();
    const res = await fetch(`${baseURL}/owner/properties?page=${currentPage}&limit=10`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch properties metadata: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
}