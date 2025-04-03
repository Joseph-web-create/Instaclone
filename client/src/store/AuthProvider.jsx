import { AuthContext } from ".";
import useLocalStorage from "../hooks/useLocalStorage";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useLocalStorage("instashotToken", null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
