import { useState, useEffect } from "react";
import api from "../api";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Added currentPage state
  const [searchKeyword, setSearchKeyword] = useState("");

  // Function to fetch products
  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await api.get(
        `/products/?page=${page}&search=${search}`
      );
      setProducts(response); // Assuming the response structure includes `products`
      setCurrentPage(page); // Update currentPage state
    } catch (err) {
      setError(err);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new product
  const createProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await api.post("/products/", productData);
      setProducts((prev) => [...prev, response]);
    } catch (err) {
      setError(err);
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const response = await api.put(`/products/${id}`, productData);
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? response : product))
      );
    } catch (err) {
      setError(err);
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a product
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(currentPage, searchKeyword);
    } catch (err) {
      setError(err);
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts(currentPage, searchKeyword);
  }, [currentPage, searchKeyword]); // Fetch products when currentPage changes

  return {
    products,
    loading,
    error,
    currentPage, // Expose currentPage
    setCurrentPage, // Expose setCurrentPage to allow changing page
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts, // Optionally expose fetchProducts if you need to call it directly
    setSearchKeyword,
  };
};

export default useProducts;
