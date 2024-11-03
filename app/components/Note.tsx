"use client";

import { NoteInterface } from "../my-notes/noteUtils";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import wretch from "wretch";
import { AuthActions } from "../auth/utils";


type FormData = {
    title: string;
    note: string;
}

export default function Note({ note, revalidate } : { note: NoteInterface, revalidate: any }) {
    const [lastSubmit, setLastSubmit] = useState({ title: note.title, note: note.note });

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
        },
        mode: 'onBlur',
    });

    const api_detail = wretch(note.url)
        .accept("application/json")
        .auth(`Bearer ${getToken("access")}`);


    const onSubmit = (data: FormData) => {
        if (lastSubmit.title !== data.title || lastSubmit.note !== data.note) {
            api_detail.patch({title: data.title, note: data.note}, "")
            .json()
            .catch(err => setError("root", { type: "manual", message: err.json.detail }));
            setLastSubmit({ title: data.title, note: data.note })
        }
    };

    const deleteNote = () => {
        api_detail.delete("").res(json => {
            revalidate();
        });
    };

    return (
        <>
            <div className="bg-neutral-700 px-3 py-2 rounded-md flex flex-row justify-between h-44 overflow-scroll">
                <form onBlur={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-2'>
                        <input maxLength={20} className='text-gray-300 placeholder:italic p-1 bg-neutral-700' type='text' placeholder='Title' 
                        {...register('title', { maxLength: {value: 20, message: "Title must be less than 20 characters long."} })}/>
                        {errors.title?.message}
                        <textarea className='h-28 resize-none text-gray-300 placeholder:italic p-1 bg-neutral-700' placeholder='Note' 
                        {...register('note')}/>
                        {errors.note?.message}
                    </div>
                </form>
                    <button onClick={deleteNote} className='h-fit text-sm'><i className="fa-solid fa-trash"></i></button>   
            </div>
        </>
    );
}