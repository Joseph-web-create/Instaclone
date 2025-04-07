import { Navigate, useLocation } from "react-router";

export const PrivateRoutes = ({ children, accessToken, user }) => {
  const location = useLocation();
  if (!accessToken) {
    <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (user && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export function PublicRoutes({ children, accessToken }) {
  const location = useLocation();

  if (accessToken) {
    return <Navigate to={location.state?.from || "/"} />;
  }

  return children;
}

export const VerifyRoutes = ({ children, accessToken, user }) => {
  const location = useLocation();
  if (!accessToken) {
    <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (user && user?.isVerified) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  return children;
};
