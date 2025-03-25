import { Outlet } from "react-router";
import home from "../assets/home.png";

function AuthLayout() {
  return (
    <section className="max-w-[850px] mx-auto flex mt-10 justify-center min-h-screen">
      <div className="hidden lg:block mx-auto lg:w-[350px] h-[500px]">
        <img src={home} alt="AuthImage" className=" rounded-md h-full w-full" />
      </div>
      <div className="md:w-[50%]">
        <Outlet />
      </div>
    </section>
  );
}

export default AuthLayout;
