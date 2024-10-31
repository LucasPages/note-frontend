import React from 'react';
import { useForm } from 'react-hook-form';
import wretch from "wretch";
import { AuthActions } from '../auth/utils';

type FormData = {
    title: string;
    note: string;
}

function Modal({ closeModal, user, revalidate }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();

    const { getToken } = AuthActions();

    const api = wretch("http://localhost:8000")
        .accept("application/json")
        .auth(`Bearer ${getToken("access")}`);

    const onSubmit = (data: FormData) => {
        api.post({owner: user.username, title: data.title, note: data.note}, "/notes/")
        .json(json => {
            revalidate();
        }).catch(err => {
            setError("root", { type: "manual", message: err.json.detail });
        });
        closeModal();
    };

  return (
    <div className='absolute w-screen h-screen bg-neutral-800'>
        <div className='flex flex-col gap-3 w-1/3 my-5 mx-auto bg-neutral-700 p-3 rounded-md'>
            <div className='flex flex-row justify-between'>
                <h2>Create Note</h2>
                <button onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-2'>
                    <input autoComplete="off" className='rounded-sm p-1 text-black' type='text' placeholder='Title' {...register('title')}/>
                    {errors.title && <span className='text-red-600'>Error with title</span>}
                    <input autoComplete="off" className='rounded-sm p-1 text-black' type='text' placeholder='Note' {...register('note')}/>
                    {errors.note && <span className='text-red-600'>Error with note</span>}
                </div>
                <input type="submit" hidden/>
            </form>
        </div>
    </div>
  );
}

export default Modal;