import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import { lazy, Suspense } from "react";
import { LazySpinner } from "../componet/Spinner";
import Home from "../pages/home/Home";
import ForgottenPassWord from "../pages/passwordfrget/ForgottenPassWord";
import React from "react";
import { useAuth } from "../store";
import { PrivateRoutes, PublicRoutes, VerifyRoutes } from "./ProtectedRoutes";
import SendVerifymail from "../pages/verifyAccount/SendVerifymail";
import VerifyAccount from "../pages/verifyAccount/VerifyAccount";
import ResetPassword from "../pages/passwordfrget/ResetPassword";
import PostsProvider from "../store/PostsProvider";
import Explore from "../componet/Explore";
import Comment from "../pages/comments/Comment";
import EditPost from "../pages/editPost/EditPost";
import Profile from "../pages/profile/Profile";

const AuthLayout = lazy(() => import("../layout/AuthLayout"));
const RootLayout = lazy(() => import("../layout/RootLayout"));
const VerifyAccountLayout = lazy(() => import("../layout/VerifyAccountLayout"));

function AppRoutes() {
  const { accessToken, isCheckingAuth, user } = useAuth();
  if (isCheckingAuth) {
    return <LazySpinner />;
  }

  const routes = [
    {
      path: "auth",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
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
          path: "forgot-password",
          element: <ForgottenPassWord />,
        },
        {
          path: "reset-password/:userId/:passwordToken",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <PostsProvider>
              <RootLayout />
            </PostsProvider>
          </PrivateRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
        {
          path: "post/:id",
          element: <Comment />,
        },
        {
          path: "post/edit/:id",
          element: <EditPost />,
        },
        {
          path: "profile/:username",
          element: <Profile />,
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazySpinner />}>
          <VerifyRoutes accessToken={accessToken} user={user}>
            <VerifyAccountLayout />
          </VerifyRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "verify-email",
          element: <SendVerifymail />,
        },
        {
          path: "verify-email/:userId/:verificationToken",
          element: <VerifyAccount />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default AppRoutes;
