// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setError } from "../redux/slices/error";
import { setSuccess } from "../redux/slices/success";
import { setUser } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../api/auth.api";

// Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const LoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateStrongPassword = () => {
    const length = 10;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  const signInWithGoogle = async () => {
    console.log("Before try block"); // Debugging statement
    
    const provider = new GoogleAuthProvider();
    
    try {
      console.log("Inside try block"); // Debugging statement
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
  
      // Use the Google user profile to create or sign in the user in your system
      const response = await signupApi({
        email: user.email ?? "",
        password: generateStrongPassword() ?? "",
        name: user.displayName ?? "",
        avatar: user.photoURL ?? "",
        bio: "Default Bio, You can change it" ?? "",
      });
  
      if (response.success) {
        dispatch(setUser(response.user));
        dispatch(setSuccess(response.message));
        navigate("/");
      } else {
        dispatch(setError(response.message));
      }
    } catch (error) {
      console.error("Error during sign-in with Google:", error);
      dispatch(setError("An error occurred during sign-in with Google."));
    }
  };
  

  return (
    <div>
      <button onClick={signInWithGoogle}>
        Continue with Google
      </button>
    </div>
  );
};

export default LoginButton;
