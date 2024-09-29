import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Login from "./components/Login";
import UserHome from "./components/UserHome";
import AdminHome from "./components/AdminHome";
import Layout from "./components/Layout";

const ProtectedRoute = ({ allowedRoles, redirectPath = "/login" }) => {
  const { user } = useUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin/home" : "/home"} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/home" element={<UserHome />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin">
            <Route index element={<Navigate to="/admin/home" replace />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="users" element={<UserHome />} />
            <Route path="products" element={<UserHome />} />
            <Route path="categories" element={<UserHome />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
