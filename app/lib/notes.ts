"use server";

import { cookies } from "next/headers";

export interface NoteInterface {
    id: string;
    owner: string;
    title: string;
    note: string;
    created_at: Date;
    last_edited: Date;
}


export async function createEmptyNote(revalidate: Function) {
    const data = {title: "", note: ""};

    const cookieStore = await cookies();
    console.log(cookieStore.getAll());

    const note_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": cookieStore.get("csrftoken")?.value || "",
        }
    });

    if (note_response.ok) {
        revalidate();
    } else {
        console.log(note_response);
    }
}