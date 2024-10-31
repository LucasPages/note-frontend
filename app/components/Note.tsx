import wretch from "wretch";
import ModalNote from "./ModalNote";
import { useState, useEffect } from "react";

interface NoteObject {
    url: string;
    owner: string;
    title: string;
    note: string;
    created_at: Date;
    last_edited: Date;
}

export default function Note({ note, revalidate } : { note: NoteObject, revalidate: any }) {
    const [openModal, setOpenModal] = useState(false);
    const [noteState, setNote] = useState(note);

    return (
        <>
            <div onClick={() => setOpenModal(true)} className="bg-neutral-700 px-3 py-2 rounded-md flex flex-col gap-2 h-40 overflow-scroll">
                <h3 className="shrink pb-2 text-xl">{noteState.title}</h3>
                <p className="h-2/3 shrink-0 text-sm">{noteState.note}</p>
            </div>
            {openModal && <ModalNote closeModal={() => setOpenModal(false)} note={noteState} setNote={setNote} revalidate={revalidate}/>}
        </>
    );
}