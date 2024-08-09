import Link from "next/link";

import { Header } from "../_components/header";
import { SignupForm } from "../_components/SignupForm"
import { api } from "~/trpc/server";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default async function Signup() {
  const hello = await api.post.hello({ text: "from tRPC" });

    return (

        <div className="">
            <Header authorization={false}/>
            <SignupForm />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>

    );
}
