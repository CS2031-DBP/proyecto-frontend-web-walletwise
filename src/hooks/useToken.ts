import { useState, useEffect } from "react";

function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken?.token || null;
  };

  const getRole = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken?.role || null;
  };

  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());

  const saveToken = (userToken: { token: string; role: string }) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
    setRole(userToken.role);
    // Disparar evento de actualización del token
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const syncToken = () => {
      setToken(getToken());
      setRole(getRole());
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  return {
    setToken: saveToken,
    token,
    role,
  };
}

export default useToken;
