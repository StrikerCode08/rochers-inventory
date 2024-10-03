import React from "react";
import DataTable from "./DataTable";
import useCategories from "../hooks/useCategories";

export default function Categories() {
  const { categories } = useCategories();

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
  ];
  return (
    <div>
      <DataTable rows={categories.categories} tablehead={tablehead} />
    </div>
  );
}
