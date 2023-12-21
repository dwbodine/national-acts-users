import { useRouter } from "next/router";
import { useState } from "react";
import { useLogin } from "../src/hooks/useLogin";

export default function Login() {
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();
  const router = useRouter();
  const onSubmit = () => {
    if (!name || !password) {
      setLoginError("Please enter username and password");
    } else {
      login(name, password)
        .then((response) => {
          if (response) {
            if (response.user && response.user.isAuthenticated) {
              router.push("/")
            } else if (response.loginError) {
              setLoginError(response.loginError);
            } else {
              setLoginError("Unknown error during login - please contact your administrator");
            }            
          } else {
            setLoginError("Unknown error during login - please contact your administrator");
          }          
        })
        .catch((e) => {
          console.log(e);
          setLoginError("Unknown error during login - please contact your administrator");
        });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center">
      <div className="h-fit flex flex-col gap-2 justify-center">
        <p className="text-2xl font-bold">Login Form</p>
        <label>Username</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-80 h-8 px-2 border border-solid border-black rounded"
          placeholder="username"
        />
        <label className="mt-4">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-80 h-8 px-2 border border-solid border-black rounded"
          placeholder="password"
          type="password"
        />
        <button
          onClick={onSubmit}
          className="h-10 w-80 mt-8 bg-black rounded text-white"
        >
          Login
        </button>
      </div>
      <div className="h-fit flex flex-row gap-2 items-center justify-center">
        {loginError ? 
          <div className="danger">{loginError}</div> :
          ''
        }
      </div>
    </div>
  );
}