import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  if (!auth?.isLoggedIn) {
    return <Navigate to="/" replace={true} />;
  }
  return children;
};
