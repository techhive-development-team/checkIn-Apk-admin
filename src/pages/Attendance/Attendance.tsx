import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import { attendanceRepository } from "../../repositories/attendanceRepository";
import AttendanceTable from "../../component/tables/AttendanceTable";
import { useMemo, useState } from "react";
import { useGetEmployee } from "../../hooks/useGetEmployee";
import { useAuthStore } from "../../stores/authStore";
import { useGetUserById } from "../../hooks/useGetUser";

type PersonOption = {
  employeeId: string;
  fullName: string;
};

const getTodayDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Attendance = () => {
  const today = getTodayDateKey();
  const user = useAuthStore((state) => state.user);
  const companyId = user?.companyId;
  const role = user?.role;
  const userId = user?.userId;
  const canUseSearch = role === "ADMIN" || role === "CLIENT";
  const { data: userData } = useGetUserById(userId || "");
  const hideStudentForClient =
    role === "CLIENT" && userData?.company?.type === "Company";
  const showPersonTypeSelector =
    role === "ADMIN" || (role === "CLIENT" && !hideStudentForClient);
  const [searchMemberType, setSearchMemberType] = useState<
    "EMPLOYEE" | "STUDENT"
  >("EMPLOYEE");
  const isStudentSearch =
    showPersonTypeSelector && searchMemberType === "STUDENT";

  const handlePersonTypeChange = (type: "EMPLOYEE" | "STUDENT") => {
    setSearchMemberType(type);
    setEmployeeId("");
    setEmployeeSearchText("");
    setSearchEmployeeId("");
  };

  const [showSearch, setShowSearch] = useState(true);
  const { data } = useGetEmployee({
    companyId: role === "CLIENT" ? companyId : undefined,
    memberType: showPersonTypeSelector ? searchMemberType : undefined,
    limit: 1000,
    offset: 0,
  });
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeSearchText, setEmployeeSearchText] = useState("");
  const [showEmployeeSuggestions, setShowEmployeeSuggestions] = useState(false);
  const [workStartTime, setWorkStartTime] = useState("");
  const [workEndTime, setWorkEndTime] = useState("");
  const [graceMinutes, setGraceMinutes] = useState("0");

  const [searchFromDate, setSearchFromDate] = useState(today);
  const [searchToDate, setSearchToDate] = useState(today);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchWorkStartTime, setSearchWorkStartTime] = useState("");
  const [searchWorkEndTime, setSearchWorkEndTime] = useState("");
  const [searchGraceMinutes, setSearchGraceMinutes] = useState("0");

  const filteredPeople = useMemo(() => {
    const keyword = employeeSearchText.trim().toLowerCase();
    const list: PersonOption[] =
      data?.map((emp: { employeeId: string; firstName: string; lastName: string }) => ({
        employeeId: emp.employeeId,
        fullName: `${emp.firstName} ${emp.lastName}`.trim(),
      })) ?? [];

    if (!keyword) return list;
    return list.filter((person) => person.fullName.toLowerCase().includes(keyword));
  }, [data, employeeSearchText]);

  const handleSearch = () => {
    const effectiveFromDate = fromDate || toDate;
    const effectiveToDate = toDate || fromDate;
    setSearchEmployeeId(employeeId);
    setSearchFromDate(effectiveFromDate);
    setSearchToDate(effectiveToDate);
    setSearchWorkStartTime(workStartTime);
    setSearchWorkEndTime(workEndTime);
    setSearchGraceMinutes(graceMinutes);
  };

  const handleToday = () => {
    setFromDate(today);
    setToDate(today);
    setSearchEmployeeId(employeeId);
    setSearchFromDate(today);
    setSearchToDate(today);
    setSearchWorkStartTime(workStartTime);
    setSearchWorkEndTime(workEndTime);
    setSearchGraceMinutes(graceMinutes);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setEmployeeId("");
    setEmployeeSearchText("");
    setShowEmployeeSuggestions(false);
    setWorkStartTime("");
    setWorkEndTime("");
    setGraceMinutes("0");
    setSearchEmployeeId("");
    setSearchFromDate("");
    setSearchToDate("");
    setSearchWorkStartTime("");
    setSearchWorkEndTime("");
    setSearchGraceMinutes("0");
  };
  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 app-match-navbar-bg mb-6">
        <div className="card-body">

          <div className="flex items-center justify-between">
            <Breadcrumb
              items={[{ label: "Home", path: "/" }, { label: "Attendance" }]}
            />
            {canUseSearch && (
              <button
                className="btn btn-ghost btn-sm rounded-lg"
                onClick={() => setShowSearch(!showSearch)}
              >
                {showSearch ? "Hide Search" : "Show Search"}
              </button>
            )}
          </div>
          {canUseSearch && showSearch && (
            <div className="mt-4 space-y-4">
              {showPersonTypeSelector && (
                <div className="rounded-lg border border-base-300 p-4">
                  <label className="label pb-2">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Person Type
                    </span>
                  </label>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <label className="inline-flex items-center gap-2.5">
                      <input
                        type="radio"
                        className="radio radio-sm text-sky-600"
                        name="attendancePersonType"
                        value="EMPLOYEE"
                        checked={searchMemberType === "EMPLOYEE"}
                        onChange={() => handlePersonTypeChange("EMPLOYEE")}
                      />
                      <span className="text-sm text-base-content">Employee</span>
                    </label>
                    <label className="inline-flex items-center gap-2.5">
                      <input
                        type="radio"
                        className="radio radio-sm text-sky-600"
                        name="attendancePersonType"
                        value="STUDENT"
                        checked={searchMemberType === "STUDENT"}
                        onChange={() => handlePersonTypeChange("STUDENT")}
                      />
                      <span className="text-sm text-base-content">Student</span>
                    </label>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-base-300 p-4">
                  <p className="text-sm font-semibold">
                    {isStudentSearch ? "Student & Date Filter" : "Employee & Date Filter"}
                  </p>
                  {canUseSearch && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-base-content/80">
                        {isStudentSearch ? "Student" : "Employee"}
                      </p>
                      <div className="relative">
                        <input
                          type="text"
                          className="input input-bordered w-full rounded-lg"
                          placeholder={isStudentSearch ? "Type student name..." : "Type employee name..."}
                          value={employeeSearchText}
                          onFocus={() => setShowEmployeeSuggestions(true)}
                          onBlur={() => {
                            setTimeout(() => setShowEmployeeSuggestions(false), 150);
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEmployeeSearchText(value);
                            setEmployeeId("");
                          }}
                        />
                        {showEmployeeSuggestions && (
                          <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-base-300 bg-base-100 shadow-lg">
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-base-200"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setEmployeeId("");
                                setEmployeeSearchText("");
                                setShowEmployeeSuggestions(false);
                              }}
                            >
                              {isStudentSearch ? "All Students" : "All Employees"}
                            </button>
                            {filteredPeople.length > 0 ? (
                              filteredPeople.map((person) => (
                                <button
                                  key={person.employeeId}
                                  type="button"
                                  className="block w-full px-3 py-2 text-left text-sm hover:bg-base-200"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setEmployeeId(person.employeeId);
                                    setEmployeeSearchText(person.fullName);
                                    setShowEmployeeSuggestions(false);
                                  }}
                                >
                                  {person.fullName}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-base-content/70">
                                No matching {isStudentSearch ? "students" : "employees"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-1 text-xs font-medium text-base-content/80">From Date</p>
                    <input
                      type="date"
                      placeholder="From Date"
                      className="input input-bordered w-full rounded-lg"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-base-content/80">To Date</p>
                    <input
                      type="date"
                      placeholder="To Date"
                      className="input input-bordered w-full rounded-lg"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-base-300 p-4">
                  <p className="text-sm font-semibold">
                    {isStudentSearch ? "Class Hour Filter" : "Working Hour Filter"}
                  </p>
                  <div>
                    <p className="mb-1 text-xs font-medium text-base-content/80">Start Time</p>
                    <input
                      type="time"
                      className="input input-bordered w-full rounded-lg"
                      value={workStartTime}
                      onChange={(e) => setWorkStartTime(e.target.value)}
                      placeholder="Start Time"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-base-content/80">End Time</p>
                    <input
                      type="time"
                      className="input input-bordered w-full rounded-lg"
                      value={workEndTime}
                      onChange={(e) => setWorkEndTime(e.target.value)}
                      placeholder="End Time"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-base-content/80">Grace Period</p>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      className="input input-bordered w-full rounded-lg"
                      value={graceMinutes}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "0" : e.target.value;
                        const numeric = Number(value);
                        if (!Number.isNaN(numeric)) {
                          const clamped = Math.min(15, Math.max(0, numeric));
                          setGraceMinutes(String(clamped));
                        }
                      }}
                      placeholder="Grace Period (0-15 min)"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
                <button
                  className="btn btn-primary w-full md:w-auto rounded-lg"
                  onClick={handleSearch}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-outline w-full md:w-auto rounded-lg"
                  onClick={handleToday}
                >
                  Today
                </button>
                <button
                  className="btn btn-secondary w-full md:w-auto rounded-lg"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>

            </div>
          )}
          {canUseSearch && showSearch && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold">Legend:</span>
              <span className="px-2 py-1 rounded bg-base-200">On Time / Present</span>
              <span className="px-2 py-1 rounded bg-red-100 text-red-800">Late Only</span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-800">Overtime Only</span>
              <span className="px-2 py-1 rounded bg-sky-100 text-sky-800">Late + Overtime</span>
              <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Leave</span>
              <span className="px-2 py-1 rounded bg-slate-300 text-slate-800">Absent</span>
            </div>
          )}
        </div>
      </div>

      <div className="card card-bordered w-full bg-base-100 app-match-navbar-bg">
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
            workStartTime={searchWorkStartTime}
            workEndTime={searchWorkEndTime}
            graceMinutes={Number(searchGraceMinutes || "0")}
            memberType={showPersonTypeSelector ? searchMemberType : undefined}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
