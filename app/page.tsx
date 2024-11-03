import Cookies from "js-cookie";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";

// TODO: 
//       - test front end (see nextjs doc)

// TODO: Low priority
//      - manage fonts (see nextjs docs + intro video) --> two fonts (one for navbar, one for notes)
//      - add styling options for the user --> changing color mostly, maybe layout format (grid vs list ?)


export default function Home() {

  const cookie = Cookies.get("accessToken");

  return (
    <>
      <Navbar children={null}/>
      <div className="flex flex-row justify-between mt-10 ">
        <div className="mx-auto border-2 border-neutral-500 rounded-md p-4 w-fit ">
          {!cookie && <Login/>}
        </div>
      </div>
    </>
  );
}
