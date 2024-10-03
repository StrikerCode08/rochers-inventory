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
import Products from "./components/Products";
import Categories from "./components/Categories";
import SubCat from "./components/SubCat";
import Purchase from "./components/Purchase";
import "./App.css";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { user } = useUser();

  if (!user) {
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
        element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="home" element={<UserHome />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCat />} />
          <Route path="purchase" element={<Purchase />} />
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
