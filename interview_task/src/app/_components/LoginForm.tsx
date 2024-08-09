"use client";

import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { api } from "~/trpc/react"; 
import { toast } from 'react-toastify';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setpasswordError] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const createUserMutation = api.user.login.useMutation();
    
  
    const handleLogin = async () => {
        setEmailError('');
        setpasswordError('');
        if(password.length  && email.length) {
            try {
                let response: any =  await createUserMutation.mutateAsync({ email, password})
                console.log(response);
                toast.info(response.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.log("response.notVerified => ",response)
                if(response.notVerified) {
                    localStorage.setItem('gmail',email)
                    router.push('/otp')
                }
                if(!response.error) {
                    localStorage.setItem('accessToken',response.token);
                    router.push('/')
                }
            } catch(error) {
                console.log("error 1 => " , error);
                toast.info('Internal Error!', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        if(email.length == 0) setEmailError('Please enter the email');
        if(password.length == 0) setpasswordError('Please enter the password');
        return false
    };

    return (
        <main className="w-full flex min-h-screen flex-col ">
                <div className="flex border border-gray-300 mx-auto w-96 pb-10 my-5 rounded-lg  justify-center">
                    <div className="">
                        <h1 className="font-inter font-semibold text-2xl text-center mt-5">Login</h1>
                        <h3 className="font-inter font-medium text-xl text-center mt-5">
                            Welcome back to ECOMMERCE
                        </h3>
                        <h6 className="font-inter font-normal text-base text-center ">
                            The next gen business marketplace
                        </h6>
                        <div className="mt-5 w-80">
                            <div>
                                <label className="w-full font-inter font-normal text-base leading-tight">Email</label>
                            </div>
                            <input  type="text" placeholder="Enter" value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full h-10 p-3" />
                        </div>
                        {emailError && <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{emailError}</p>}
                        <div className="mt-5 w-80">
                            <div>
                                <label className="w-full font-inter font-normal text-base leading-tight">Password</label>
                            </div>
                            <input  type="password" placeholder="Enter"  value={password} onChange={(e) => setPassword(e.target.value)} className="border w-full h-10 p-3" />
                        </div>
                        {passwordError && <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{passwordError}</p>}
                        <button onClick={handleLogin} className="w-full mt-5 p-3 text-white font-semibold text-lg leading-8 rounded-md border border-gray-300 " style={{ backgroundColor: '#000000', transition: 'background-color 0.3s' }}>
                            Login
                        </button>
                        {error && <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

                        <div className="mt-5 w-80 flex justify-center items-center">
                            <label className="font-inter font-normal text-base leading-tight mr-2">Don’t have an Account?</label>
                            <a href="/signup">Sign up</a>
                        </div>
                    </div>
                </div>
            </main>
    );
}
