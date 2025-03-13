"use server";

import { cookies } from "next/headers";


async function getCsrfToken() {
    const csrfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: "GET",
        mode: "cors",
    });

    const csrfToken = csrfResponse.headers.get("Set-Cookie")?.split(";")[0].split("=")[1] || "";
    
    
    if (!csrfToken) {
        throw new Error("Failed to get CSRF token");
    }

    const cookieStore = await cookies();
    cookieStore.set("csrftoken", csrfToken);
    return csrfToken;
}


export async function login(email: string, password: string) {
    await getCsrfToken();

    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("csrftoken");

    setTimeout(async () => {
    }, 100);

    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken?.value || "",
        }
    });

    if (!loginResponse.ok) {
        throw new Error("Incorrect email or password");
    } else {
        setTimeout(async () => {
        }, 100);

        cookieStore.set({
            name: "sessionid",
            value: loginResponse.headers.get("Set-Cookie")?.split(";")[4].split("=")[2] || "",
            httpOnly: true,
            path: "/",
        });
        if (cookieStore.get("sessionid")) {
            cookieStore.set("loggedIn", "true");
        }
    }
    return await loginResponse.json();
}


export async function logout() {
    const cookieStore = await cookies();
    setTimeout(async () => {
    }, 100);
    
    const logoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
            "X-CSRFToken": cookieStore.get("csrftoken")?.value || "",
        }
    });
    
    if (!logoutResponse.ok) {
        throw new Error("Failed to logout");
    }

    return await logoutResponse.json();
}
