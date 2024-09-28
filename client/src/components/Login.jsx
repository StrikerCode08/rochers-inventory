import React, { useState } from "react";
import { loginUser } from "../api";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(username, password);
      setUser(user); // Set user info and role
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Error: " + error.response.data);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h2>Login</h2>
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
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              type="text"
              placeholder="Password"
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <button className="mt-4 bg-blue-700" type="submit">
          Login
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
