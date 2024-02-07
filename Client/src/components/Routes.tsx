import { AuthContext } from "@/context/AuthContext";
import Login from "@/pages/login/Login";
import Profile from "@/pages/profile/Profile";
import Register from "@/pages/register/Register";
import { useContext } from "react";
import { Navigate, Outlet, Route, Routes as Router } from "react-router-dom";

const ProtectedRoute = () => {
  const { authenticated } = useContext(AuthContext);
  if (!authenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};
const Routes = () => {
  return (
    <Router>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Profile />} />
      </Route>
    </Router>
  );
};

export default Routes;
