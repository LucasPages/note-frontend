"use client";
import Cookies from "js-cookie";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";

// TODO: 
//       - create note interface (after that --> CRUD operations)
//       - test front end (see nextjs doc)

// TODO: Low priority
//      - manage fonts (see nextjs docs + intro video) --> two fonts (one for navbar, one for notes)
//      - add styling options for the user --> changing color mostly, maybe layout format (grid vs list ?)


export default function Home() {

  return (
    <>
      <Navbar children={null}/>
      {!Cookies.get("accessToken") && <Login/>}
    </>
  );
}
