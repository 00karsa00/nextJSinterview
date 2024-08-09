import Link from "next/link";

import { Header } from "../_components/header";
import { LoginForm } from "../_components/LoginForm";
import { api } from "~/trpc/server";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Login() {
    return (
        <div className="">
            <Header authorization={true}/>
            <LoginForm />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}
