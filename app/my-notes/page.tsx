"use client";

import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { fetcher } from "../fetcher";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";
import Note from "../components/Note";
import { Navbar } from "../components/Navbar";
import Script from "next/script";
import { NoteInterface } from "./noteUtils";
import { createEmptyNote } from "./noteUtils";


interface User {
    username: string;
    email: string;
    id: number;
}

export default function Home() {
    const { data: user, isLoading: userLoading, error: userError}: { data: User, isLoading: boolean, error: any} = useSWR("/auth/users/me", fetcher);
    const { data: noteData, isLoading: noteLoading, error: noteError, mutate: revalidateNotes } : { data: Array<NoteInterface>, isLoading: boolean, error: any, mutate: any} = useSWR("/my-notes", fetcher);
    
    const router = useRouter();
    
    const { logout, removeTokens } = AuthActions();  
    const { mutate } = useSWRConfig();

    
    if (userLoading) {
        return <h1 className="italic">Connecting...</h1>
    }

    const clearNotesCache = () => {
        mutate(
            "/my-notes",
            undefined,
            false
        );
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
        clearNotesCache();
    };
    
    return (
        <>
            <div>
                <Navbar>
                    {user && 
                    <div className="flex flex-row items-center">
                        <p className="text-2xl">{user.username} - </p>
                        <button className="text-2xl h-fit mr-3 p-3" onClick={handleLogout}>Log Out</button>
                    </div>
                    }
                </Navbar>

                <div className=" bg-neutral-700 active:bg-neutral-600 p-2 rounded-md my-2 mx-auto w-fit">
                        <button onClick={() => {
                            createEmptyNote(revalidateNotes);
                        }}>
                            <i className="fa-solid fa-plus" /> Create Note
                        </button>
                </div>

                {noteLoading && <h2>Notes Loading...</h2>}
                <div className="m-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {noteData && noteData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(note => {
                        return <Note key={note.url} note={note} revalidate={revalidateNotes}/>;
                    })}
                </div>
            </div>
            <Script src="https://kit.fontawesome.com/2a117bd933.js" crossOrigin="anonymous"/>
        </>
    );
}