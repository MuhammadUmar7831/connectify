import { GoogleLogin } from "react-google-login";
import { signupApi } from "../api/auth.api";
import { setError } from "../redux/slices/error";
import { setSuccess } from "../redux/slices/success";
import { setUser } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const clientId = "476553953625-r86dopv2fee9gtsnln507855orn3jko4.apps.googleusercontent.com";

function LoginButton() {
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

  const onSuccess = async (res: any) => {
    const { email, name, imageUrl } = res.profileObj; // Extract from profileObj

    try {
      const response = await signupApi({
        email: email,
        password: generateStrongPassword(),
        name: name,
        avatar: imageUrl,
        bio: "Default Bio, You can change it"
      });

      if (response.success) {
        dispatch(setUser(response.user));
        dispatch(setSuccess(response.message));
        
        navigate("/");
      } else {
        dispatch(setError(response.message));
      }
    } catch (error) {
      dispatch(setError("An error occurred during signup."));
    }

    console.log("Login Success", res.profileObj);
  };

  const onFailure = (res: any) => {
    console.log("Login Failed", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Continue with Google
          </button>
        )}
      />
    </div>
  );
}

export default LoginButton;
