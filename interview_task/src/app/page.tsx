import { Header } from "./_components/header";
import { CategoryList } from "~/app/_components/CategoryList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Home() {
  return (
    <div className="">
      <Header authorization={true} />
      <main className="w-full flex min-h-screen flex-col ">
        <div className="flex border border-gray-300 mx-auto w-96 pb-10 my-5 rounded-lg  justify-center">
          <div className="">
            <h1 className="font-inter font-semibold text-2xl text-center mt-5">Please mark your interests!</h1>
            <h6 className="font-inter font-normal text-base text-center ">
              We will keep you notified.
            </h6>
            <div className="mt-5 w-80">
              <div className="mb-5">
                <label className="w-full font-inter font-normal text-base leading-tight">My saved interests!</label>
              </div>
              <CategoryList/>
              

            </div>
          </div>
        </div>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}



