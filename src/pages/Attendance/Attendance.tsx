import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import { attendanceRepository } from "../../repositories/attendanceRepository";
import AttendanceTable from "../../component/tables/AttendanceTable";
import { useState } from "react";
import { useGetEmployee } from "../../hooks/useGetEmployee";
import { jwtDecode } from "jwt-decode";

const Attendance = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token!) as { user: { companyId: string, role: string } };
  const companyId = decodedToken?.user?.companyId;
  const role = decodedToken?.user?.role;

  const [showSearch, setShowSearch] = useState(true);
  const { data } = useGetEmployee({ companyId });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [searchEmployeeId, setSearchEmployeeId] = useState("");

  const handleSearch = () => {
    setSearchEmployeeId(employeeId);
    setSearchFromDate(fromDate);
    setSearchToDate(toDate);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setEmployeeId("");
    setSearchEmployeeId("");
    setSearchFromDate("");
    setSearchToDate("");
  };
  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">

          <div className="flex items-center justify-between">
            <Breadcrumb
              items={[{ label: "Home", path: "/" }, { label: "Attendance" }]}
            />
            <button
              className="btn btn-ghost btn-sm rounded-lg"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? "Hide Search" : "Show Search"}
            </button>
          </div>
          {showSearch && (
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              {role !== "USER" && (
                <select
                  className="select select-bordered w-full rounded-lg"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {data?.map((emp: { employeeId: string; firstName: string; lastName: string }) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="date"
                placeholder="From Date"
                className="input input-bordered w-full md:max-w-xs rounded-lg"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                placeholder="To Date"
                className="input input-bordered w-full md:max-w-xs rounded-lg"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <button
                className="btn btn-primary w-full md:w-auto rounded-lg"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="btn btn-secondary w-full md:w-auto rounded-lg"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          )}
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
          <AttendanceTable
            fromDate={searchFromDate}
            toDate={searchToDate}
            employeeId={searchEmployeeId}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
