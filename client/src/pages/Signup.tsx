import React, { useState } from "react";
import { GrConnect } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import loginButton from "../components/loginButton";
import { useEffect } from "react";
import {gapi} from "gapi-script"

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignUpClick = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const clientId = "476553953625-r86dopv2fee9gtsnln507855orn3jko4.apps.googleusercontent.com";
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <GrConnect className="text-orange size-20 hover:text-black cursor-pointer" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <button
        className="flex items-center  justify-center mb-4 shadow-sm text-gray-600 hover:bg-gray-50
        w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          onClick={handleSignUpClick}
        >
            <FcGoogle className="text-xl mr-2" /> 
         {loginButton()}   
        </button>
        <div className="text-center text-gray-500 mb-4">or</div>
        <form onSubmit={handleSignUpClick}>
          <input
            type="text"
            placeholder="Name"
            required
            className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50
        w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          />
          <input
            type="email"
            placeholder="Email address"
            required
            className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50
        w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          />
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50
        w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-1 mb-3 mr-2 flex items-center text-gray-500"
            >
              {passwordVisible ? (
                <LuEyeOff className="text-xl" /> // Replace with an icon
              ) : (
                <LuEye className="text-xl" /> // Replace with an icon
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            A strong password should contain at least:
            <ul className="list-disc pl-5">
              <li>1 uppercase letter</li>
              <li>1 lowercase letter</li>
              <li>1 number</li>
              <li>1 special character (@$!%*?&)</li>
              <li>Be at least 8 characters long</li>
            </ul>
          </p>
          <button
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 rounded-md text-white py-2 px-4 mt-2 w-full bg-orange hover:bg-black disabled:cursor-not-allowed"
            type="submit"
          >
            {loading == true ? (
              <ClipLoader size={20} color="#FFFFFF" />
            ) : (
              "CONTINUE"
            )}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-orange hover:text-black hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
