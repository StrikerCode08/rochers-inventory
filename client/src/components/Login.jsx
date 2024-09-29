import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import RocherLogo from "../assets/Logo.svg";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await loginUser(username, password);
      login(user);
      navigate(user.role === "admin" ? "/admin/home" : "/home");
    } catch (error) {
      alert(
        "Error: " +
          JSON.stringify(error.response.data.errors.map((item) => item.msg))
      );
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-10">
      <div className="w-72 h-72 overflow-hidden relative">
        <img
          src={RocherLogo}
          className="w-full h-auto object-cover"
          alt="Vite logo"
        />
      </div>
      <h2>Rochers Inventory Login</h2>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center flex-col gap-1"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Username
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-white-900 ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-white-900"
          >
            Password
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-white-900 ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <button className="mt-4 bg-blue-700" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
