import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ReactNode } from "react";

export const Navbar = ({ children } : { children: ReactNode }) => {
    return (
        <nav className="flex flex-row justify-between items-center bg-neutral-800 w-screen h-16 border-b-2 border-gray-300">
          <h1 className="text-gray-100 p-6 text-4xl">Notes_</h1>
          {children}
        </nav>
    );
} 