"use client";

import useSWR from "swr";
import { fetcher } from "../fetcher";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";
import Note from "../components/Note";
import { Navbar } from "../components/Navbar";
import Cookies from "js-cookie";

interface Note {
    url: string;
    owner: string;
    title: string;
    note: string;
    created_at: Date;
    last_edited: Date;
}

// TODO: find out how to correctly display notes, look into useSWR

export default function Home() {
    const user = useSWR("/auth/users/me", fetcher).data;
    const notes:Array<Note> = useSWR("/my-notes", fetcher).data;

    const { logout, removeTokens } = AuthActions();

    const router = useRouter();

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
        <div>
            <Navbar>
                {Cookies.get("accessToken") && <button className="text-2xl h-fit mr-3 p-3" onClick={handleLogout}>Log Out</button>}
            </Navbar>
        </div>
    );
}