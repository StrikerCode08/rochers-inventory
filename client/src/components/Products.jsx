import React, { useState } from "react";
import DataTable from "./DataTable";
import useProducts from "../hooks/useProducts";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

export default function Products() {
  const {
    products,
    loading,
    error,
    currentPage, // Expose currentPage
    setCurrentPage, // Expose setCurrentPage to allow changing page
    createProduct,
    updateProduct,
    deleteProduct,
    setSearchKeyword,
    fetchProducts, // Optionally expose fetchProducts if you need to call it directly
  } = useProducts();
  const tablehead = [
    {
      id: 1,
      feild: "name",
    },
    {
      id: 2,
      feild: "category",
    },
    {
      id: 3,
      feild: "subCategory",
    },
    {
      id: 4,
      feild: "action",
    },
  ];
  return (
    <div className="table-wrapper">
      <SearchBar
        addButtonText={"Add Product"}
        setSearchkeyword={setSearchKeyword}
      />
      <DataTable
        tablehead={tablehead}
        rows={products.products}
        deleteRow={deleteProduct}
      />
      <Pagination
        totalPages={products.totalPages}
        page={currentPage}
        changePage={setCurrentPage}
        totalItems={products.totalItems}
        handlePageChange={setCurrentPage}
      />
    </div>
  );
}
