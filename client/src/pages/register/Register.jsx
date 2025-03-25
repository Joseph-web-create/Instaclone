import Logo from "../../assets/Logo.svg";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatefullname,
} from "../../utils/formvalidation";
import { useState } from "react";
import MetaArgs from "../../componet/MetaArgs";

function Register() {
  const [revealPassword, setRevealPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const togglePassword = () => {
    setRevealPassword((prev) => !prev);
  };

  const formSubmit = (e) => {
    console.log(e);
  };

  return (
    <>
      <MetaArgs
        title="Sign Up to InstaShot"
        content="Get access to Instashot"
      />

      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[20px] px-[20px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={Logo} alt="InstaShot logo" />
          </Link>
        </div>
        <form
          className="md:max-w-[350px] mx-auto mt-5"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="mb-2">
            <label className="floating-label">
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                className="input input-lg w-full"
                id="email"
                {...register("email", {
                  validate: (value) => validateEmail(value),
                })}
              />
            </label>

            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="mb-2">
            <label className="floating-label">
              <span>FullName</span>
              <input
                type="text"
                placeholder="Fullname"
                className="input input-lg w-full"
                id="fullname"
                {...register("fullname", {
                  validate: (value) => validatefullname(value),
                })}
              />
            </label>
            {errors.fullname && (
              <span className="text-sm text-red-600">
                {errors.fullname.message}
              </span>
            )}
          </div>
          <div className="mb-2">
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

          <div className="mb-2 relative">
            <label className="floating-label">
              <span>Password</span>
              <input
                type={revealPassword ? "text" : "password"}
                placeholder="Username"
                className="input input-lg w-full"
                id="password"
                {...register("password", {
                  validate: (value) => validatePassword(value),
                })}
              />
            </label>
            <button
              className="absolute inset-y-0 right-2 cursor-pointer"
              onClick={togglePassword}
              type="button"
            >
              {revealPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}

          {/* <button
            className="mt-4 btn btn-secondary w-full bg-[#8D0D76]"
            type="submit"
          >
            Continue
          </button> */}

          <button
            className="btn w-full text-white bg-[#8D0D76] hover:bg-[#8d0d76cb]"
            type="submit"
          >
            Sign Up
          </button>

          <div className="text-center mt-[10px]">
            <p className="px-[20px]">
              By signing up, you agree to our Term, data policy
            </p>
          </div>
        </form>
      </div>
      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[20px] px-[28px] mt-5 text-center">
        <span>Already have an account? </span>
        <Link
          to="/auth/login"
          className="cursor-pointer text-[#8D0D76] font-bold"
        >
          Log in
        </Link>
      </div>
    </>
  );
}

export default Register;
