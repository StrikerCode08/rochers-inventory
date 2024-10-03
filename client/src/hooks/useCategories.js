import { useState, useEffect } from "react";
import api from "../api";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // For pagination limit

  // Function to fetch categories with pagination
  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/categories?page=${page}&limit=${limit}`);
      setCategories(response.data.categories); // Adjust based on your API response structure
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError(err);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new category
  const createCategory = async (categoryData) => {
    setLoading(true);
    try {
      const response = await api.post("/categories/", categoryData);
      setCategories((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err);
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a category
  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      setCategories((prev) =>
        prev.map((category) => (category._id === id ? response.data : category))
      );
    } catch (err) {
      setError(err);
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a category
  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories(currentPage); // Refetch categories after deletion
    } catch (err) {
      setError(err);
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount and when currentPage changes
  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]); // Fetch categories when currentPage changes

  return {
    categories,
    loading,
    error,
    currentPage,
    setCurrentPage, // Expose setCurrentPage to allow changing page
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories, // Optionally expose fetchCategories if you need to call it directly
  };
};

export default useCategories;
