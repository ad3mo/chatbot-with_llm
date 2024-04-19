import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email").toString();
    const password = formData.get("password").toString();

    try {
      toast.loading("Siginig In", { id: "login" });
      await auth?.login(email, password);
      toast.success("Signed In Successfully", { id: "login" });
    } catch (error) {
      console.log(error);
      toast.error("Sign in failed", { id: "login" });
    }
  };
  useEffect(() => {
    if (auth?.user) {
      return navigate("/chat");
    }
  });
  return (
    <div className="wrapper flex justify-center items-center h-screen">
      <div className="flex flex-col gap-2 border-2 py-8 px-5 rounded-xl h-[400px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2  py-8 px-5 "
        >
          <div className="pb-5 items-center text-center">
            <h1 className="text-3xl uppercase font-bold">Login</h1>
          </div>
          <div className="flex flex-col gap-3">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                name="email"
                className="grow"
                placeholder="email"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                name="password"
                className="grow"
                placeholder="Password"
              />
            </label>
          </div>
          <a href="/" className="link link-neutral font-light text-center mt-2">
            Forgot password ?
          </a>
          <button type="submit" className="btn btn-block btn-neutral mt-5">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
