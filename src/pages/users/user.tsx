import React from "react";
import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";

const Users: React.FC = () => {
  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "User Management" }]} />

          <h3 className="text-2xl font-bold my-4">User Management</h3>

          <p className="text-base-content/70">
            User Table??
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
