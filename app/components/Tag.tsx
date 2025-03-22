import { useState } from "react";
import { NoteInterface } from "../lib/notes";
import Cookies from "js-cookie";
export default function Tag({ tag, note, revalidate }: { tag: string, note: NoteInterface, revalidate: () => void }) {
    const [isClicked, setIsClicked] = useState(false);

    const removeTag = async () => {
        let newTags = note.tag_list.filter((t) => t !== tag);
        if (newTags.length === 0) {
            newTags = ["clear"];
        }

        const response = await fetch(`${note.url}`, {
            method: "PATCH",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            },
            body: JSON.stringify({
                tags: newTags,
            }),
        });
        if (response.ok) {
            console.log(await response.json());
            revalidate();
        }
    }

    return (
        <span onClick={() => {
            if (!isClicked) {
                setIsClicked(true);
                setTimeout(() => {
                    setIsClicked(false);
                }, 1000);
            } else {
                removeTag();
            }
        }} className="text-xs text-gray-500 rounded-full border-[1px] border-gray-500 px-2 py-[1px] cursor-default">{isClicked ? <span className="font-bold">x </span> : ""}{tag}</span>
    );
}