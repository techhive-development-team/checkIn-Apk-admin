import { Link } from "react-router-dom";
import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import EmployeeTable from "../../component/tables/EmployeeTable";

const Employee = () => {

  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Employee" },
            ]}
          />
        </div>
      </div>

      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Employee List</h3>

            <Link
              to="/employee/create"
              className="btn btn-primary rounded-lg"
            >
              Create Employee
            </Link>
          </div>
            <EmployeeTable/>
        </div>
      </div>
    </Layout>
  );
};

export default Employee;
