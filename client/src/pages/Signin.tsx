import { GrConnect } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { signinApi } from "../api/auth.api";

export default function Signin() {
    const googleClick = () => { }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const handleSiginClick = async (e: FormEvent) => {
        e.preventDefault();
        const res = await signinApi({ email, password });
        console.log(res)
    }
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center text-black">
            <div className="bg-white rounded-md p-4 w-1/2 min-w-[280px] max-w-[600px]">
                <span className="w-full flex justify-center"><GrConnect className="text-orange size-20 hover:text-black cursor-pointer" /></span>
                <h1 className="text-center text-3xl mt-2">Sign In</h1>
                <div className="w-full mt-5 text-md text-center">
                    <button
                        onClick={googleClick}
                        className="flex justify-center items-center gap-2 w-full bg-gray-100 rounded-md py-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
                    >
                        <FcGoogle className="text-xl" /> Continue with Google
                    </button>
                </div>
                <p className="text-center my-2 text-md">or</p>
                <form onSubmit={handleSiginClick} className="flex flex-col gap-2">
                    <input
                        className="w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
                        type="email"
                        name="email"
                        value={email}
                        required
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <input
                            className="w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md pr-10"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            required
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-3"
                        >
                            {!showPassword ? <LuEyeOff className="text-xl" /> : <LuEye className="text-xl" />}
                        </button>
                    </div>
                    <button
                        className="bg-gray-900 hover:bg-gray-800 rounded-md text-white py-2 px-4 mt-2 w-full text-sm bg-orange hover:bg-black"
                        type="submit"
                    >
                        CONTINUE
                    </button>
                </form>
                <div className="mt-5 flex justify-center w-full gap-2">
                    <span>Not have an account?</span>
                    <Link to="/signup" className="text-orange hover:text-black hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    )
}
