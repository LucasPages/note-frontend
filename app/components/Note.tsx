"use client";

import { NoteInterface } from "../lib/notes";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import TagModal from "./TagModal";
import { TagFormData } from "./TagModal";
import Tag from "./Tag";

type FormData = {
    title: string;
    note: string[];
}

export default function Note({ note, revalidate } : { note: NoteInterface, revalidate: any }) {
    const noteRef = useRef<HTMLDivElement>(null);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [lastSubmit, setLastSubmit] = useState({ 
        title: note.title, 
        note: note.note, 
        tags: note.tag_list 
    });
    const [noteState, setNoteState] = useState({ 
        title: note.title, 
        note: note.note, 
        tags: note.tag_list 
    });
    const [tagModal, setTagModal] = useState(false);
    console.log(note)
    const {
        register,
        handleSubmit,
        setError,
        watch,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: note.title,
            note: note.note.length > 0 ? note.note : [""]
        },
        mode: "onBlur",
    });

    const noteFields = watch('note');
    useEffect(() => {
        setNoteState({
            ...noteState,
            note: noteFields || [''],
        });
    }, [noteFields]);

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "note"
      });
    
    useEffect(() => {
        if (fields.length === 0) {
            append('');
        }
    }, [fields.length, append]);
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteState({
            ...noteState,
            title: e.target.value
        });
    };

    const onSubmit = (data: FormData) => {
        if (lastSubmit.title !== data.title || JSON.stringify(lastSubmit.note) !== JSON.stringify(data.note)) {
            fetch(`${note.url}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({
                    title: data.title, 
                    note: data.note.filter(field => field.trim() !== '')
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
            setLastSubmit({ 
                title: data.title, 
                note: data.note, 
                tags: note.tag_list 
            })
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


    const fetchTags = async () => {
        const tags_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`, {
            credentials: "include",
            mode: "cors",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            }
        });

        if (tags_response.ok) {
            const tags = await tags_response.json();
            setAllTags(tags.map((tag: any) => tag.name));
        } else {
            console.log(tags_response);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);


    const handleTagSubmit = async (data: TagFormData) => {
        const tag_response = await fetch(`${note.url}`, {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({
                tags: [...note.tag_list, data.selectedTag]
            }),
            mode: "cors",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken") || "",
                "Content-Type": "application/json",
            }
        });

        if (tag_response.ok) {
            revalidate();
            fetchTags();
        } else {
            console.log(tag_response);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            append('');
            setTimeout(() => {
                const inputs = noteRef.current?.querySelectorAll('input[placeholder="item"]');
                inputs?.[index + 1]?.focus();
            }, 50);
        } else if (e.key === 'Backspace') {
            if (noteState.note[index] === '' && noteState.note.length > 1) {
                e.preventDefault();
                remove(index);
                setTimeout(() => {
                    const inputs = noteRef.current?.querySelectorAll('input[placeholder="item"]');
                    inputs?.[index - 1]?.focus();
                }, 0);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newNote = [...noteState.note];
        newNote[index] = e.target.value;
        setNoteState({
            ...noteState,
            note: newNote
        });
    };

    return (
        <div ref={noteRef} className="shadow-md px-3 py-2 rounded-md min-h-44 h-fit relative flex flex-col justify-between">
            <div className="flex flex-row justify-between">
                <form onBlur={handleSubmit(onSubmit)} className="w-full">
                    <div className='flex flex-col gap-2'>
                        <input maxLength={20} className='text-black rounded-md p-1 w-[95%] focus:outline-none font-bold' type='text' placeholder='Title' 
                        {...register('title', {
                             maxLength: {value: 20, message: "Title must be less than 20 characters long."} 
                            })}
                            onChange={handleTitleChange}
                        />

                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="flex flex-row gap-2">
                                    <input className='focus:outline-none resize-none text-black placeholder:italic p-1' placeholder={noteState.note.length > 1 ? "item" : "Write something..."} 
                                    {...register(`note.${index}`)} onKeyDown={(e) => handleKeyDown(e, index)}/>
                                    {fields.length > 1 && <button onClick={() => remove(index)} className='text-[10px] text-gray-500'><i className="fa-solid fa-xmark"></i></button>}
                                </div>
                            )
                        })}

                    </div>
                </form>
                <button onClick={deleteNote} className='absolute top-1 right-1 h-fit text-sm'><i className="fa-solid fa-trash"></i></button>   
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 overflow-x-scroll scrollbar-hide">
                    {note.tag_list && note.tag_list.map((tag) => {
                            return <Tag key={tag} tag={tag} note={note} revalidate={revalidate}/>
                        }
                    )}
                </div>
                <div className="flex flex-row gap-2">
                    <button onClick={() => {
                        setTagModal(true);
                    }} className="text-xs text-gray-500 px-2 py-[1px]"><i className="fa-solid fa-plus"></i></button>
                </div>
            </div>
            {tagModal && <TagModal existingTags={allTags} onSubmit={handleTagSubmit} onClose={() => setTagModal(false)} />}
        </div>
    );
}