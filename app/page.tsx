"use client";
import { useState } from "react";
import LoginForm from "./ui/Login";

// TODO: - Add account login --> create login page and change layout based on logging status
//       - Read on conditional rendering --> login page if logged out (state)
//       - Work on placement of Login Form
//       - Fetch data user (read data fetch docs Next.js)
//       - create note interface (after that --> CRUD operations)
//       - test front end (see nextjs doc)

// TODO: Low priority
//      - manage fonts (see nextjs docs + intro video) --> two fonts (one for navbar, one for notes)
//      - add styling options for the user --> changing color mostly, maybe layout format (grid vs list ?)


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoginForm></LoginForm>
  );
}
