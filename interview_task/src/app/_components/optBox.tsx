"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';


import { api } from "~/trpc/react";

export function Otpbox() {
  const router = useRouter();
  const [otp, setOtp] = useState(new Array(8).fill(""));
  const [error, setError] = useState("")
  const [email, setEmail] = useState("");
  const [emailEncrytp, setEmailEncrytp] = useState("")
  const verifyUserMutation = api.user.verifyUser.useMutation();


  const inputRefs = useRef<HTMLInputElement[]>([]);
  const handleChange = (index: number, value: string) => {
    console.log("this idfn => ", index, value)
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move to the next input field automatically
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: any) => {
    console.log("this handleKeyDown => ", index, event)

    // Move to the previous input field if Backspace is pressed and the current input is empty
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyUser = async () => {
    setError("");
    let enterOpt = otp.join("");
    console.log("enterOpt => ", enterOpt)
    if (enterOpt.length == 8) {
      let response: any = await verifyUserMutation.mutateAsync({ email, otp: enterOpt })
      toast.info(response.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("response => ",response)
      if (!response.error) {
        localStorage.setItem('accessToken', response.token);
        router.push('/')
      }
    } else {
      setError("Please enter opt")
    }
  }

  const obfuscateEmail = (email: any) => {
    // Split the email address into local part and domain part
    const [localPart, domainPart] = email.split('@');

    // Determine the length of the local part
    const localPartLength = localPart.length;


    // Calculate the number of characters to replace with asterisks
    const charactersToReplace = Math.floor((localPartLength - 3) / 2);

    // Split the local part into two parts and replace characters in the middle with asterisks
    const firstPart = localPart.slice(0, 3);
    const middlePart = '*'.repeat(5);

    // Join the obfuscated local part and domain part with an "@" symbol
    const obfuscatedLocalPart = firstPart + middlePart;

    return obfuscatedLocalPart + '@' + domainPart;
  }

  useEffect(() => {
    const localemail: any = localStorage.getItem('gmail')
    setEmail(localemail)
    setEmailEncrytp(obfuscateEmail(localemail))
    
  }, [])

  return (
    <main className="w-full flex min-h-screen flex-col ">
      <div className="flex border border-gray-300 mx-auto my-5 rounded-lg  justify-center p-5" style={{ width: '550px' }}>
        <div className="">
          <h1 className="font-inter font-semibold text-2xl text-center mt-5"> Verify your email</h1>
          <h6 className="font-inter font-normal text-base text-center mt-5 ">
            Enter the 8 digit code you have received on {emailEncrytp}
          </h6>

          <div className="mt-5">
            <span>Code</span>
            <div className="text-center mt-5">

              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    if (element) inputRefs.current[index] = element;
                  }}
                  type="text"
                  maxLength={1}
                  value={value}
                  className="border"
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '40px',
                    height: '40px',
                    marginRight: '10px',
                    textAlign: 'center',
                  }}
                />
              ))}
            </div>
            {error && <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
          </div>
          <button onClick={verifyUser} className="w-full mt-5 p-3 text-white font-semibold text-lg leading-8 rounded-md border border-gray-300 " style={{ backgroundColor: '#000000', transition: 'background-color 0.3s' }}>
            Verify
          </button>

        </div>
      </div>
    </main>

  );
}
