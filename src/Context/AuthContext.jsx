import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

export let AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [loginData, setLoginData] = useState(() =>
    localStorage.getItem("accessToken") ? jwtDecode(localStorage.getItem("accessToken")) : null
  );
  const [userProfile, setUserProfile] = useState(() =>
    localStorage.getItem("userProfile") ? JSON.parse(localStorage.getItem("userProfile")) : null
  );

  let saveLoginData = () => {
    let encodedToken = localStorage.getItem("accessToken");
    let profile = localStorage.getItem("userProfile");

    if (encodedToken) {
      try {
        let decodedToken = jwtDecode(encodedToken);
        setLoginData(decodedToken);
      } catch (e) {
        console.error("Invalid Token", e);
      }
    }
    if (profile) {
      try {
        setUserProfile(JSON.parse(profile));
      } catch (e) {
        console.error("Failed to parse userProfile", e);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      saveLoginData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        saveLoginData,
        loginData,
        setLoginData,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
