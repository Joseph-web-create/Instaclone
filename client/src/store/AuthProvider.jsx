import { useEffect, useState, useCallback } from "react";
import { AuthContext } from ".";
import useLocalStorage from "../hooks/useLocalStorage";
import { authenticateUser } from "../api/auth";
import { toast } from "sonner";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useLocalStorage("instashotToken", null);
  const [user, setUser] = useState(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const handleLogout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    toast.success("You've been logout", { id: "logout" });
  }, [setAccessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const getUser = async () => {
      try {
        setIsCheckingAuth(true);

        const res = await authenticateUser(accessToken);

        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
        handleLogout();
      } finally {
        setIsCheckingAuth(false);
      }
    };
    getUser();
  }, [accessToken, handleLogout]);

  console.log(user);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        isCheckingAuth,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
