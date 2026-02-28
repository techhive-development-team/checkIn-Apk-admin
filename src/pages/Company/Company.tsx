import Layout from "../../component/layouts/layout";
import CompanyTable from "../../component/tables/CompanyTable";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";

const Company = () => {

  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Company" },
            ]}
          />
        </div>
      </div>

      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Company List</h3>
          </div>

          <CompanyTable />
        </div>
      </div>
    </Layout>
  );
};

export default Company;
