import wretch from "wretch";
import Cookies from "js-cookie";

export interface NoteInterface {
    url: string;
    owner: string;
    title: string;
    note: string;
    created_at: Date;
    last_edited: Date;
}


export function createEmptyNote(revalidate: Function) {
    const data = {title: "", note: ""};

    const api_detail = wretch("http://localhost:8000/notes/")
                        .auth(`Bearer ${Cookies.get("accessToken")}`);

    api_detail.post(data)
        .json(res => revalidate())
        .catch(err => console.log(err));
}