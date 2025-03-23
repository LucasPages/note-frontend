"use server";

import { cookies } from "next/headers";

export interface NoteInterface {
    url: string;
    owner: string;
    title: string;
    note: string[];
    tag_list: string[];
    created_at: Date;
    last_edited: Date;
}


export async function createEmptyNote(revalidate: Function) {
    const data = {title: "", note: [""], tags: []};
    const cookieStore = await cookies();

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

export async function getTags() {
    const cookieStore = await cookies();
    const tags_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`, {
        credentials: "include",
        mode: "cors",
        headers: {
            "X-CSRFToken": cookieStore.get("csrftoken")?.value || "",
        }
    });

    if (tags_response.ok) {
        return tags_response.json();
    } else {
        console.log(tags_response);
    }
}