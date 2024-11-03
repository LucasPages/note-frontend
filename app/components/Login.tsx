"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";


type FormData = {
    username: string;
    password: string;
};


export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>();
    const router = useRouter();

    const { login, storeToken } = AuthActions();

    const onSubmit = (data: FormData) => {
        login(data.username, data.password)
            .json(json => {
                storeToken(json.access, "access");
                storeToken(json.refresh, "refresh");
                
                router.push("/my-notes/");
            }).catch(err => {
                setError("root", { type: "manual", message: err.json.detail });
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto my-4 w-fit">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="username">Username</label>
                    <input  
                        autoComplete="off"
                        {...register("username", { required: { value: true, message: "Username required"} })}
                        className="rounded-sm text-black p-1"
                        type="text" 
                    />
                    {errors.username?.message}
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <input 
                        {...register("password", { required: { value: true, message: "Password required"} })}
                        className="rounded-sm text-black p-1"
                        type="password" 
                    />
                    {errors.password?.message }
                </div>
                
                <button className="bg-neutral-700 active:bg-neutral-600 w-4/6 mx-auto my-4 rounded-sm p-2 bg" type="submit">Log In</button>
            </div>
        </form>
    );
}