import { FormEvent, useState } from "react";

// TODO: Style this component

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input 
                id="username" 
                type="text" 
                value={username}
                onChange={event => setUsername(event.target.value)}
            />

            <label id="password">Password</label>
            <input 
                id="password" 
                type="password" 
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            
            <button type="submit">Log In</button>
        </form>
    );
}