import React from 'react';
import { useForm } from 'react-hook-form';
import wretch from "wretch";
import { AuthActions } from '../auth/utils';
import { url } from 'inspector';

// TODO : - add animation when opening Modal
//        - remove Create Note button when editing note
//        - making it look less like a form :
//              --> 1) change background color input fields
//              --> 2) submit when user exits modal window, remove edit button


type FormData = {
    title: string;
    note: string;
}

function Modal({ closeModal, note, setNote, revalidate }) {
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

    const { getToken } = AuthActions();

    const api_detail = wretch(note.url)
        .accept("application/json")
        .auth(`Bearer ${getToken("access")}`);

    const deleteNote = () => {
        api_detail.delete("").res(json => {
            revalidate();
        });
        closeModal();
    }

    const onSubmit = (data: FormData) => {
        api_detail.patch({title: data.title, note: data.note}, "")
        .json(res => {
            setNote({...note, title: res.title, note: res.note});
        }).catch(err => setError("root", { type: "manual", message: err.json.detail }));

        closeModal();
    };

  return (
    <div className='absolute w-screen h-screen bg-neutral-800'>
        <div className='flex flex-col gap-3 w-2/3 my-5 mx-auto bg-neutral-700 p-3 rounded-md'>
            <div className='flex flex-row justify-end'>
                <button onClick={closeModal} className=''><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-2'>
                    <input className='rounded-sm p-1 text-black' type='text' placeholder='Title' {...register('title', { maxLength: 20 })}/>
                    {errors.title && <span className='text-red-600'>Title must be less than 20 characters</span>}
                    <textarea className='rounded-sm p-1 text-black' placeholder='Note' {...register('note')}/>
                    {errors.note && <span className='text-red-600'>Error with note</span>}
                </div>
                <div className='mt-3 flex justify-between'>
                    <button type='submit' className='rounded-md bg-blue-500 active:bg-blue-400 p-2'>Edit</button>
                    <button onClick={deleteNote} className='text-white rounded-md bg-red-500 active:bg-red-400 w-fit p-2'>DELETE</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default Modal;