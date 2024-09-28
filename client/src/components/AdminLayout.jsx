import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <a href="/admin/users">Manage Users</a>
          </li>
          <li>
            <a href="/admin/products">Manage Products</a>
          </li>
          <li>
            <a href="/admin/categories">Manage Categories</a>
          </li>
        </ul>
      </nav>
      <Outlet /> {/* Render child routes here */}
    </div>
  );
};

export default AdminLayout;
