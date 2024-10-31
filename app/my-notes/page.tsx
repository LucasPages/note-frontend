"use client";

import useSWR from "swr";
import { fetcher } from "../fetcher";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";
import Note from "../components/Note";
import { Navbar } from "../components/Navbar";
import Script from "next/script";
import Modal from "../components/Modal";
import { useState } from "react";
import wretch from "wretch";


interface Note {
    url: string;
    owner: string;
    title: string;
    note: string;
    created_at: Date;
    last_edited: Date;
}

interface User {
    username: string;
    email: string;
    id: number;
}

export default function Home() {
    const [openModal, setOpenModal] = useState(false);
    const { data: user, isLoading: userLoading, error: userError}: { data: User, isLoading: boolean, error: any} = useSWR("/auth/users/me", fetcher);
    const { data: noteData, isLoading: noteLoading, error: noteError } : { data: Array<Note>, isLoading: boolean, error: any} = useSWR("/my-notes", fetcher);

    const { logout, removeTokens } = AuthActions();

    const router = useRouter();
    

    if (userLoading) {
        return <h1>Connecting...</h1>
    }

    const handleLogout = () => {
        logout()
            .res(() => {
                removeTokens();

                router.push("/");
            })
            .catch(() => {
                removeTokens();
                router.push("/");
            });
    };
    
    return (
        <>
            <div>
                <Navbar>
                    {user && 
                    <span className="flex flex-row items-center">
                        <p className="text-2xl">{user.username} - </p>
                        <button className="text-2xl h-fit mr-3 p-3" onClick={handleLogout}>Log Out</button>
                    </span>
                    }
                </Navbar>

                <div className="my-2 mx-auto w-fit">
                        <button onClick={() => setOpenModal(true)}>
                            <i className="fa-solid fa-plus" /> Create Note
                        </button>
                </div>
                {openModal && <Modal closeModal={() => setOpenModal(false)} user={user}/>}

                {noteLoading && <h2>Notes Loading...</h2>}
                <div className="m-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {noteData && noteData.map(note => {
                        return <Note key={note.url} title={note.title} text={note.note}/>;
                    })}
                </div>
            </div>
            <Script src="https://kit.fontawesome.com/2a117bd933.js" crossOrigin="anonymous"/>
        </>
    );
}