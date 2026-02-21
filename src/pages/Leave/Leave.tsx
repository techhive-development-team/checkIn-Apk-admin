import { Link } from "react-router-dom";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import Layout from "../../component/layouts/layout";
import LeaveRequestTable from "../../component/tables/LeaveRequestTable";

const Leave = () => {
  
  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Leave" },
            ]}
          />
        </div>
      </div>

      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Leave Request List</h3>

            <Link
              to="/leave/create"
              className="btn btn-primary rounded-lg"
            >
              Create Leave Form
            </Link>
          </div>

          <LeaveRequestTable />
        </div>
      </div>
    </Layout>
  );
}

export default Leave