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
import AdminLayout from "./components/AdminLayout";

const ProtectedRoute = ({ allowedRoles, redirectPath = "/" }) => {
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
            <Login />
          )
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin/home" : "/home"} />
          ) : (
            <Login />
          )
        }
      />

      <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
        <Route path="/home" element={<UserHome />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/home" replace />} />
          <Route path="home" element={<AdminHome />} />
          {/* Add other admin routes here */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="flex justify-center items-center flex-col mt-4">
          <h1>Rochers Pos</h1>
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
