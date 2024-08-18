import react,{ useState, useEffect } from "react";
import { GrConnect } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import loginButton from "../components/loginButton";
import { gapi } from "gapi-script";
import { signupApi } from "../api/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/user";
import { setSuccess } from "../redux/slices/success";
import { setError } from "../redux/slices/error";
import { MdEdit } from "react-icons/md";
import useCloudinary from "../hooks/useCloudinary";
import sendWelcomeEmail from "../config/sendEmail.config";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPriview] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disableOnPass, setDisableOnPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNameChange = (e:any) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };
  const checkPasswordStrength = (password: any) => {
    let strength = "";
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"
    );
    const mediumRegex = new RegExp(
      "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
    );

    if (strongRegex.test(password)) {
      strength = "strong";
      setDisableOnPass(false);
    } else if (mediumRegex.test(password)) {
      strength = "medium";
      setDisableOnPass(false);
    } else {
      strength = "weak";
      setDisableOnPass(true);
    }
    setPasswordStrength(strength);
  };
  const handlePasswordChange = (e:any) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
  };

  //Cloudinary
  const { uploadImage } = useCloudinary();

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    setPriview(URL.createObjectURL(file)); // Preview image
    let userConfirmation = confirm("Are you sure you want to upload this image?");
    console.log(file) //testing
    if (userConfirmation) {
      try {
        const res = await uploadImage(file);
        if (res.success) {
          setAvatar(res.imageUrl || "Error uploading image");
          console.log(avatar); //testing
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleBioChange = (e: any) => {
    setBio(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUpClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await signupApi({ email, password, name, avatar, bio });
    //sendWelcomeEmail(email,name);
    if (res.success) {
      //await sendWelcomeEmail(email,name);
      dispatch(setUser(res.user));
      dispatch(setSuccess(res.message));
      navigate("/");
    } else {
      dispatch(setError(res.message));
    }
    setLoading(false);
  };

 

  const clientId =
    "476553953625-r86dopv2fee9gtsnln507855orn3jko4.apps.googleusercontent.com";
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
        {/* Image Selection */}
        <div className="relative rounded-full overflow-hidden mx-auto w-44 h-44 group cursor-pointer bg-gray">
          <div
            onClick={handleAvatarChange}
            className="flex justify-center items-center absolute top-0 left-0 bg-gray-200 w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-opacity-60"
          >
            <MdEdit size={40} className="cursor-pointer" />
          </div>
          <img
            src={preview || "default-avatar.jpg"}
            alt="avatar"
            className={`w-full h-full object-cover ${
              loading ? "animate-pulse" : ""
            }`}
          />
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex justify-center mb-4 items-center">
          <GrConnect className="text-orange size-8 hover:text-black cursor-pointer" />
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 mt-4 ml-2">
            Sign Up
          </h2>
        </div>

        <button
          className="flex items-center justify-center mb-4 shadow-sm text-gray-600 hover:bg-gray-50 w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
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
            value={name}
            onChange={handleNameChange}
            className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50 w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          />
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={handleEmailChange}
            className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50 w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          />
          <input
            type="text"
            placeholder="Bio"
            required
            value={bio}
            onChange={handleBioChange}
            className="mb-4 shadow-sm text-gray-600 hover:bg-gray-50 w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
          />
          <div className="relative mb-4">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="shadow-sm text-gray-600 hover:bg-gray-50 w-full focus:outline-none bg-gray-100 py-2 px-4 rounded-md"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-1 mb-3 mr-2 mt-2 flex items-center text-gray-500"
            >
              {passwordVisible ? (
                <LuEye className="text-xl" />
              ) : (
                <LuEyeOff className="text-xl" />
              )}
            </button>
          </div>
          {password && (
            <div
              className={`text-xs font-semibold mb-4 ${
                passwordStrength === "weak"
                  ? "text-red-500"
                  : passwordStrength === "medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {passwordStrength === "weak"
                ? "Weak Password"
                : passwordStrength === "medium"
                ? "Medium Password"
                : "Strong Password"}
            </div>
          )}
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
            disabled={disableOnPass || loading}
            className="bg-gray-900 hover:bg-gray-800 rounded-md text-white py-2 px-4 mt-2 w-full bg-orange hover:bg-black disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? <ClipLoader size={20} color="#FFFFFF" /> : "CONTINUE"}
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
