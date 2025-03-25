import Logo from "../../assets/Logo.svg";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { validateEmail } from "../../utils/formvalidation";
import MetaArgs from "../../componet/MetaArgs";

function ForgottenPassWord() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const formSubmit = (e) => {
    console.log(e);
  };

  return (
    <>
      <MetaArgs
        title="Forget Password to InstaShot"
        content="Password Forgotten to your InstaShot account"
      />

      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[40px] px-[28px]">
        <div className="text-center mb-4">
          <h2 className="text-2xl text-[#827D7D]">Forgot Password</h2>
        </div>

        <p className="text-[#A8A6A6]">
          When you fill in your registered email address, we'll send you an
          instruction on how to reset your Password
        </p>

        <form
          className="md:max-w-[350px] mx-auto mt-10"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="mb-6">
            <label className="floating-label">
              <span>Enter Email</span>
              <input
                type="email"
                placeholder="Enter Email"
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

          <button
            className="btn w-full text-white bg-[#8D0D76] hover:bg-[#8d0d76cb]"
            type="submit"
          >
            Reset my Password
          </button>
        </form>
      </div>
      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[10px] px-[8px] mt-5 text-center">
        <div className="mb-3">
          <span>Already have an account? </span>
          <Link
            to="/auth/login"
            className="cursor-pointer text-[#8D0D76] font-bold"
          >
            Login
          </Link>
        </div>
        <div>
          <span>New user? </span>
          <Link
            to="/auth/register"
            className="cursor-pointer text-[#8D0D76] font-bold"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}

export default ForgottenPassWord;
