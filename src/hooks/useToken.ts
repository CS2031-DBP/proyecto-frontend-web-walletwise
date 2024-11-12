import { useState } from "react";

function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken ? userToken.token : null;
  };

  const getRole = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken ? userToken.role : null;
  };

  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());

  const saveToken = (userToken: { token: string; role: string }) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
    setRole(userToken.role);
  };

  return {
    setToken: saveToken,
    token,
    role,
  };
}

export default useToken;