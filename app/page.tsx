"use client";

import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import Note from "./components/Note";
import Script from "next/script";
import { NoteInterface } from "./lib/notes";
import Cookies from "js-cookie";
import { logout } from "./lib/auth";


export default function Home() {
    const { data: noteData, isLoading: noteLoading, error: noteError, mutate: revalidateNotes } = useSWR<NoteInterface[]>(`${process.env.NEXT_PUBLIC_API_URL}/notes/`, (url: string) => fetch(url, {
      credentials: "include",
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }).then(res => res.json()));
    const router = useRouter();
    
    const { mutate } = useSWRConfig();

    
    if (noteLoading) {
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
      // TODO: move this function to the auth.ts file so that the sessionid cookie can be properly removed from the cookie jar
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            }
        })
        .then(() => {
            Cookies.remove("loggedIn");
            Cookies.remove("csrftoken");
            router.push("/");
        })
        .catch(() => {
            router.push("/");
        });
        clearNotesCache();
    };

    const createEmptyNote = async (revalidate: Function) => {
      const data = {title: "", note: ""};
  
      const note_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/`, {
          method: "POST",
          body: JSON.stringify(data),
          credentials: "include",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "X-CSRFToken": Cookies.get("csrftoken") || "",
          }
      });
  
      if (note_response.ok) {
          revalidate();
      } else {
          console.log(note_response);
      }
    }

    return (
        <>
            <div>
                <div className="text-gray-800 font-bold shadow-lg active:shadow-md p-2 rounded-md my-2 mx-auto w-fit absolute top-0 left-4">
                    <button onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket" /> Logout
                    </button>
                </div>
                <div className="text-gray-800 font-bold shadow-lg active:shadow-md p-2 rounded-md my-2 mx-auto w-fit">
                        <button onClick={() => {
                            createEmptyNote(revalidateNotes);
                        }}>
                            <i className="fa-solid fa-plus " /> Create Note
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