import React from "react";
import { IoIosAddCircle } from "react-icons/io";

export default function SearchBar({
  addButtonText,
  addButtonAction,
  setSearchkeyword,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="flex items-center justify-between mx-16 mb-2 md:mx-12 max-sm:mx-4">
      <div>
        <label
          htmlFor="search"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <input
          type="text"
          id="search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          required=""
          onChange={(e) => setSearchkeyword(e.target.value)}
        />
      </div>
      {user?.role === "admin" ? (
        <div className="flex items-center max-sm:mt-4">
          <button className="lg:h-12  max-sm:h-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <div className="flex items-center gap-1">
              <IoIosAddCircle />
              <p className="max-sm:text-xs max-sm:h-4">{addButtonText}</p>
            </div>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
