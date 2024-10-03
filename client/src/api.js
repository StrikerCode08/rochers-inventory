import axios from "axios";
// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Include cookies in requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add any custom headers or modify the request config here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Process the response data as needed
    return response.data; // You can return only the data part of the response
  },
  async (error) => {
    // Handle errors globally
    const { response } = error;
    if (response) {
      // Handle error responses
      localStorage.removeItem("user");
      alert(JSON.stringify(response.data));
    } else {
      console.error("Network error:", error.message);
      alert("Network error. Please try again later.");
    }
    return Promise.reject(error);
  }
);

// Function to register a new user
export const registerUser = async (username, password) => {
  return await api.post("/users/register", { username, password });
};

// Function to log in a user
export const loginUser = async (username, password) => {
  return await api.post("/users/login", { username, password });
};

// Function to log out a user
export const logoutUser = async () => {
  return await api.post("/users/logout");
};
export default api;
