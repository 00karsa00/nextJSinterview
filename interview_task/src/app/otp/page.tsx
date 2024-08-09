import Link from "next/link";

import { Header } from "../_components/header";
import { api } from "~/trpc/server";
import { Otpbox } from "../_components/optBox";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export default async function Otp() {
//   const hello = await api.user.login({ text: "from tRPC" });
    return (

        <div className="">
            <Header authorization={false} />
            <Otpbox />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>

    );
}
