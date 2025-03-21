"use client";

import { NoteInterface } from "../lib/notes";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
type FormData = {
    title: string;
    note: string;
}

export default function Note({ note, revalidate } : { note: NoteInterface, revalidate: any }) {
    const [lastSubmit, setLastSubmit] = useState({ title: note.title, note: note.note });

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
        mode: 'onChange',
    });


    const onSubmit = (data: FormData) => {
        if (lastSubmit.title !== data.title || lastSubmit.note !== data.note) {
            fetch(`${note.url}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({
                    title: data.title, 
                    note: data.note
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken") || "",
                }
            })
            .then(res => res.json())
            .catch(err => setError("root", { type: "manual", message: err.message }));
            setLastSubmit({ title: data.title, note: data.note })
        }
     };

    const deleteNote = async () => {
        const delete_response = await fetch(`${note.url}`, {
            method: "DELETE",
            credentials: "include",
            mode: "cors",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            }
        });

        if (delete_response.ok) {
            revalidate();
        } else {
            console.log(delete_response);
        }
    };

    return (
        <>
            <div className="shadow-md px-3 py-2 rounded-md flex flex-row justify-between h-44">
                <form onBlur={handleSubmit(onSubmit)} className="w-full">
                    <div className='flex flex-col gap-2'>
                        <input maxLength={20} className='text-black rounded-md p-1 w-[95%]' type='text' placeholder='Title' 
                        {...register('title', { maxLength: {value: 20, message: "Title must be less than 20 characters long."} })}/>
                        {errors.title?.message}
                        <textarea className='h-28 resize-none text-black placeholder:italic p-1' placeholder='Write your note here...' 
                        {...register('note')}/>
                        {errors.note?.message}
                    </div>
                </form>
                    <button onClick={deleteNote} className='h-fit text-sm'><i className="fa-solid fa-trash"></i></button>   
            </div>
        </>
    );
}