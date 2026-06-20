'use server'

import { headers } from "next/headers";
import { auth } from "../auth";


const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const addProperty = async (property) => {
    const {token} = await auth.api.getAccessToken({
        headers: headers()
    })

    const res = await fetch(`${baseURL}/owner/properties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(property),
    })
    const data = await res.json();
    return data;
}