import React from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "./../../components/Layouts/Layout";
import { useAuth } from "../../context/auth";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    // <Layout>
    <Layout
  title={"Admin Dashboard | Aranya"}
  description={"Manage products, categories, orders from the Aranya Admin Dashboard. Control your eco-friendly business."}
  keywords={"admin dashboard, manage aranya products, eco-friendly business, biodegradable admin panel"}
  author={"Krishna Kumar"}
>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3> Admin Name : {auth?.user?.name}</h3>
              <h3> Admin Email : {auth?.user?.email}</h3>
              <h3> Admin Contact : {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;