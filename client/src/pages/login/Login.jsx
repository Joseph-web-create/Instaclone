import Logo from "../../assets/Logo.svg";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { validatePassword, validateUsername } from "../../utils/formvalidation";
import { useState } from "react";
import MetaArgs from "../../componet/MetaArgs";
import { loginUser } from "../../api/auth";
import handleError from "../../utils/handlleError";
import { toast } from "sonner";
import { useAuth } from "../../store";
import { DataSpinner } from "../../componet/Spinner";

function Login() {
  const [revealPassword, setRevealPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const togglePassword = () => {
    setRevealPassword((prev) => !prev);
  };

  const formSubmit = async (formData) => {
    try {
      const res = await loginUser(formData);
      console.log(res);

      if (res.status === 200) {
        toast.success(res.data.message);
        setAccessToken(res.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs
        title="Login to InstaShot"
        content="Login to your InstaShot account"
      />

      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[20px] px-[20px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={Logo} alt="InstaShot logo" />
          </Link>
        </div>
        <form
          className="md:max-w-[350px] mx-auto mt-10"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="mb-5">
            <label className="floating-label">
              <span>UserName</span>
              <input
                type="text"
                placeholder="Username"
                className="input input-lg w-full"
                id="username"
                {...register("username", {
                  validate: (value) => validateUsername(value),
                })}
              />
            </label>
            {errors.username && (
              <span className="text-sm text-red-600">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="mb-5 relative">
            <label className="floating-label">
              <span>Password</span>
              <input
                type={revealPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-lg w-full"
                id="password"
                {...register("password", {
                  validate: (value) =>
                    validatePassword(value, "Password is required"),
                })}
              />
              <button
                className="absolute inset-y-0 right-2 cursor-pointer"
                onClick={togglePassword}
                type="button"
              >
                {revealPassword ? "Hide" : "Show"}
              </button>
            </label>

            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* <button
            className="mt-4 btn btn-secondary w-full bg-[#8D0D76]"
            type="submit"
          >
            Continue
          </button> */}

          <button
            className="btn w-full text-white bg-[#8D0D76] hover:bg-[#8d0d76cb]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <DataSpinner /> : " Sign In"}
          </button>

          <div className="text-center mt-[10px]">
            <Link to={"/auth/forgot-password"}>Forgot Password?</Link>
          </div>
        </form>
      </div>
      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[15px] px-[28px] mt-5 text-center">
        <span>New user? </span>
        <Link
          to="/auth/register"
          className="cursor-pointer text-[#8D0D76] font-bold"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
}

export default Login;
