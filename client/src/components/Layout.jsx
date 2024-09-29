import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

import RocherLogo from "../assets/Logo.svg";
import { logoutUser } from "../api";

const Layout = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function from api.js
      logout(); // Clear user from context
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      alert("Logout failed:", error);
    }
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={RocherLogo} className="h-8" alt="Rocher Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Rochers
            </span>
          </Link>

          <div className="md:order-2 flex gap-1">
            <div className="flex space-x-3 md:space-x-0 rtl:space-x-reverse relative inline-flex items-center justify-center w-28 h-12 overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {user?.username}
              </span>
            </div>

            <div className="flex space-x-3 md:space-x-0 rtl:space-x-reverse">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Log out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
          {user && (
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    to="/users"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subcategories"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    SubCat
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sales"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Sales
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div className="pt-16">
        {" "}
        {/* Add padding to account for fixed navbar */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
