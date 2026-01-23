import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import { attendanceRepository } from "../../repositories/attendanceRepository";
import AttendanceTable from "../../component/tables/AttendanceTable";

const Attendance = () => {
  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">
          <Breadcrumb
            items={[{ label: "Home", path: "/" }, { label: "Attendance" }]}
          />
        </div>
      </div>

      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Attendance List</h3>

            <button
              onClick={attendanceRepository.exportFile}
              className="btn btn-primary rounded-lg"
            >
              Export File
            </button>
          </div>
          <AttendanceTable/>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
