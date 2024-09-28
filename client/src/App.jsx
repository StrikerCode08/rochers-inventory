import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import UserHome from "./components/UserHome";
import AdminHome from "./components/AdminHome";
import AdminLayout from "./components/AdminLayout"; // Include AdminLayout if needed

const App = () => {
  const [user, setUser] = useState(null); // User state to hold user info

  return (
    <Router>
      <div className="flex justify-center items-center flex-col mt-4">
        <h1>Rochers Pos</h1>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          {user ? (
            user.role === "admin" ? (
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<AdminHome />} />
              </Route>
            ) : user.role === "user" ? (
              <Route path="home" element={<UserHome />} />
            ) : null
          ) : (
            <Route path="login" element={<Login />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
