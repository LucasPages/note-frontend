import ModalNote from "./ModalNote";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import wretch from "wretch";
import { AuthActions } from "../auth/utils";

// TODO : Idea --> instead of creating a modal to edit the notes
//                 modify the Note component to edit directly in the
//                 note div

interface NoteObject {
    url: string;
    owner: string;
    title: string;
    note: string;
    created_at: Date;
    last_edited: Date;
}

type FormData = {
    title: string;
    note: string;
}

export default function Note({ note, revalidate } : { note: NoteObject, revalidate: any }) {
    const [openModal, setOpenModal] = useState(false);
    const [noteState, setNote] = useState(note);

    const { getToken } = AuthActions();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: note.title,
            note: note.note
        }
    });
    const api_detail = wretch(note.url)
        .accept("application/json")
        .auth(`Bearer ${getToken("access")}`);


    const onSubmit = (data: FormData) => {
        api_detail.patch({title: data.title, note: data.note}, "")
        .json(res => {
            setNote({...note, title: res.title, note: res.note});
        }).catch(err => setError("root", { type: "manual", message: err.json.detail }));

        // closeModal();
    };

    return (
        <>
            <div /* onClick={() => setOpenModal(true)} */ className="bg-neutral-700 px-3 py-2 rounded-md flex flex-col gap-2 h-40 overflow-scroll">
                {/* <h3 className="shrink pb-2 text-xl">{noteState.title}</h3>
                <p className="h-2/3 shrink-0 text-sm">{noteState.note}</p> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-2'>
                    <input maxLength={20} className='text-gray-300 placeholder:italic p-1 bg-neutral-700' type='text' placeholder='Title' {...register('title', { maxLength: 20 })}/>
                    {errors.title && <span className='text-red-600'>Title must be less than 20 characters</span>}
                    <textarea className='h-24 resize-none text-gray-300 placeholder:italic p-1 bg-neutral-700' placeholder='Note' {...register('note')}/>
                    {errors.note && <span className='text-red-600'>Error with note</span>}
                </div>
                <div className='mt-3 flex justify-between'>
                    {/* <button type='submit' className='rounded-md bg-blue-500 active:bg-blue-400 p-2'>Edit</button> */}
                {/* <button onClick={deleteNote} className='text-white rounded-md bg-red-500 active:bg-red-400 w-fit p-2'>DELETE</button> */}    
                </div>
            </form>
            </div>
            {/* {openModal && <ModalNote closeModal={() => setOpenModal(false)} note={noteState} setNote={setNote} revalidate={revalidate}/>} */}
        </>
    );
}