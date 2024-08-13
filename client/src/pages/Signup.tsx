import React, { useState } from "react";
import { GrConnect } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your sign up logic here
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
          className=" flex items-center justify-center mb-4 shadow-sm text-gray-600 hover:bg-gray-50
        w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
        >
          <FcGoogle className="text-xl m-3" />
          Continue with Google
        </button>
        <div className="text-center text-gray-500 mb-4">or</div>
        <form>
          <input
            type="text"
            placeholder="Name"
            className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50
        w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          />
          <input
            type="email"
            placeholder="Email address"
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
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange text-gray-500 rounded-lg cursor-not-allowed"
            disabled
          >
            CONTINUE
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
