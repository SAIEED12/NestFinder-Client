import { getTokenServer } from "../getTokenServer";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const getProperty = async() =>{
    const token = await getTokenServer()
    const res = await fetch(`${baseURL}/owner/properties`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json();
    console.log("getProperty response:", data);
    return data;
}