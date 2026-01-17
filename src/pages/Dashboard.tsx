import React from "react";
import Layout from "../component/layouts/layout";
import Breadcrumb from "../component/layouts/common/Breadcrumb";

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full bg-base-100">
          <div className="card-body">
            <Breadcrumb items={[{ label: "Home", path: "/" }]} />

            <h3 className="text-2xl font-bold my-4">Dashboard</h3>

            

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
