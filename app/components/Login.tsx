"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { login } from "../lib/auth";
import { useRouter } from "next/navigation";



type FormData = {
    email: string;
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

    const onSubmit = (data: FormData) => {
        login(data.email, data.password)
            .then(json => {
                router.push("/");
            }).catch(err => {
                setError("root", { type: "manual", message: err.message });
            });
    };

    return (
        <div className="flex flex-col items-center gap-4 justify-center h-screen">
            <h1 className="text-6xl text-black font-bold opacity-75">Notes_</h1>
            <div className="border-2 shadow-md rounded-md p-4 w-fit ">
                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto my-4 w-fit">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <input  
                                autoComplete="off"
                                {...register("email", { required: { value: true, message: "Email required"} })}
                                className="rounded-md text-black p-1 border-[1px] border-neutral-200"
                                type="text"
                                placeholder="Email"
                                />
                            {errors.email?.message && (
                                <p className="text-red-400" onAnimationEnd={() => setError("email", {})} style={{animation: "fadeOut 3s forwards"}}>
                                    {errors.email?.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <input 
                                {...register("password", { required: { value: true, message: "Password required"} })}
                                className="rounded-md text-black p-1 border-[1px] border-neutral-200"
                                type="password"
                                placeholder="Password"
                                />
                            {errors.password?.message && (
                                <p className="text-red-400" onAnimationEnd={() => setError("password", {})} style={{animation: "fadeOut 3s forwards"}}>
                                    {errors.password?.message}
                                </p>
                            )}
                        </div>
                        {errors.root?.message && (
                            <p className="text-red-400 text-center" onAnimationEnd={() => setError("root", {})} style={{animation: "fadeOut 3s forwards"}}>
                                {errors.root?.message}
                            </p>
                        )}
                        
                        <button className="text-black border-neutral-200 border-2 active:bg-neutral-100 w-4/6 mx-auto my-4 rounded-md p-2 bg" type="submit">Log In</button>
                    </div>
                </form>
            </div>
        </div>
    );
}