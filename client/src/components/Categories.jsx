import React from "react";
import DataTable from "./DataTable";

export default function Categories() {
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
      <DataTable tablehead={tablehead} />
    </div>
  );
}
