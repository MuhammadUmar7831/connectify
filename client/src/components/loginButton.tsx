import { GoogleLogin } from "react-google-login";
import { FcGoogle } from "react-icons/fc";

const clientId =
  "476553953625-r86dopv2fee9gtsnln507855orn3jko4.apps.googleusercontent.com";

const onSuccess = (res: any) => {
  console.log("Login Success", res.profileObj);

};

const onFailure = (res: any) => {
  console.log("Login Failed", res);
  return false
};
function loginButton() {
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
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

export default loginButton;
