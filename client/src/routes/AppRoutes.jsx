import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import { lazy, Suspense } from "react";
import { LazySpinner } from "../componet/Spinner";
import Home from "../pages/home/Home";
import ForgottenPassWord from "../pages/passwordfrget/ForgottenPassWord";

const AuthLayout = lazy(() => import("../layout/AuthLayout"));
const RootLayout = lazy(() => import("../layout/RootLayout"));

function AppRoutes() {
  const routes = [
    {
      path: "auth",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <AuthLayout />
        </Suspense>
      ),
      children: [
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgotpassword",
          element: <ForgottenPassWord />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <RootLayout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default AppRoutes;
