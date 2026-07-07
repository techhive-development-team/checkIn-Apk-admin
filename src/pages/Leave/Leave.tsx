import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import LeaveRequestTable from "../../component/tables/LeaveRequestTable";
import { useEffect, useMemo, useState } from "react";
import { useGetEmployee } from "../../hooks/useGetEmployee";
import { useGetUserById } from "../../hooks/useGetUser";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

type PersonOption = {
  employeeId: string;
  fullName: string;
};

const toMonthRange = (month: string) => {
  if (!month) return { fromDate: "", toDate: "" };
  const [year, monthNumber] = month.split("-").map(Number);
  const monthIndex = monthNumber;
  if (!year || !monthIndex) return { fromDate: "", toDate: "" };
  if (monthIndex < 1 || monthIndex > 12) return { fromDate: "", toDate: "" };

  const start = new Date(year, monthIndex - 1, 1);
  const end = new Date(year, monthIndex, 0);
  const format = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  return {
    fromDate: format(start),
    toDate: format(end),
  };
};

const Leave = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const companyId = user?.companyId;
  const userId = user?.userId;
  const { data: userData } = useGetUserById(userId || "");
  const hideStudentForClient =
    role === "CLIENT" && userData?.company?.type === "Company";
  const canUseSearch = role === "ADMIN" || role === "CLIENT";
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchMemberType, setSearchMemberType] = useState<
    "EMPLOYEE" | "STUDENT"
  >("EMPLOYEE");

  const [showSearch, setShowSearch] = useState(true);
  const [status, setStatus] = useState<"" | "PENDING" | "APPROVED" | "DENIED">(
    "",
  );
  const [month, setMonth] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeSearchText, setEmployeeSearchText] = useState("");
  const [showEmployeeSuggestions, setShowEmployeeSuggestions] = useState(false);

  const [searchStatus, setSearchStatus] = useState<
    "" | "PENDING" | "APPROVED" | "DENIED"
  >("");
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [searchEmployeeId, setSearchEmployeeId] = useState("");

  const { data: employees } = useGetEmployee({
    companyId: role === "CLIENT" ? companyId : undefined,
    memberType: hideStudentForClient ? "EMPLOYEE" : searchMemberType,
    limit: 1000,
    offset: 0,
  });

  const filteredPeople = useMemo(() => {
    const keyword = employeeSearchText.trim().toLowerCase();
    const list: PersonOption[] =
      (employees ?? []).map((employee: any) => ({
        employeeId: employee.employeeId as string,
        fullName: `${employee.firstName} ${employee.lastName}`.trim(),
      })) ?? [];

    if (!keyword) return list;
    return list.filter((person) => person.fullName.toLowerCase().includes(keyword));
  }, [employees, employeeSearchText]);

  useEffect(() => {
    if (hideStudentForClient && searchMemberType !== "EMPLOYEE") {
      setSearchMemberType("EMPLOYEE");
      setEmployeeId("");
      setEmployeeSearchText("");
      setSearchEmployeeId("");
    }
  }, [hideStudentForClient, searchMemberType]);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (
      statusParam === "PENDING" ||
      statusParam === "APPROVED" ||
      statusParam === "DENIED"
    ) {
      setStatus(statusParam);
      setSearchStatus(statusParam);
      searchParams.delete("status");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = () => {
    const { fromDate, toDate } = toMonthRange(month);
    setSearchFromDate(fromDate);
    setSearchToDate(toDate);
    setSearchStatus(status);
    setSearchEmployeeId(employeeId);
  };

  const handleReset = () => {
    setStatus("");
    setMonth("");
    setEmployeeId("");
    setEmployeeSearchText("");
    setShowEmployeeSuggestions(false);
    setSearchStatus("");
    setSearchFromDate("");
    setSearchToDate("");
    setSearchEmployeeId("");
  };

  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Leave" },
              ]}
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
            <div className="mt-4 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">
              <div className="grid grid-cols-1 items-end gap-2 md:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_auto]">
                <div className="md:col-start-1 md:row-start-1">
                  <label className="label pb-2">
                    <span className="label-text text-xs font-semibold">Person Type</span>
                  </label>
                  <div className="flex min-h-12 flex-nowrap items-center gap-x-5 px-1">
                    <label className="inline-flex items-center gap-2.5">
                      <input
                        type="radio"
                        className="radio radio-sm text-sky-600"
                        name="leaveSearchPersonType"
                        value="EMPLOYEE"
                        checked={searchMemberType === "EMPLOYEE"}
                        onChange={() => {
                          setSearchMemberType("EMPLOYEE");
                          setEmployeeId("");
                          setEmployeeSearchText("");
                          setSearchEmployeeId("");
                        }}
                      />
                      <span className="text-sm text-base-content">Employee</span>
                    </label>
                    {!hideStudentForClient && (
                      <label className="inline-flex items-center gap-2.5">
                        <input
                          type="radio"
                          className="radio radio-sm text-sky-600"
                          name="leaveSearchPersonType"
                          value="STUDENT"
                          checked={searchMemberType === "STUDENT"}
                          onChange={() => {
                            setSearchMemberType("STUDENT");
                            setEmployeeId("");
                            setEmployeeSearchText("");
                            setSearchEmployeeId("");
                          }}
                        />
                        <span className="text-sm text-base-content">Student</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="md:col-start-2 md:row-start-1">
                  <label className="label pb-2">
                    <span className="label-text text-xs font-semibold">
                      {searchMemberType === "STUDENT" ? "Student" : "Employee"}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input input-bordered h-12 w-full rounded-lg"
                      placeholder={
                        searchMemberType === "STUDENT"
                          ? "Type student name..."
                          : "Type employee name..."
                      }
                      value={employeeSearchText}
                      onFocus={() => setShowEmployeeSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowEmployeeSuggestions(false), 150);
                      }}
                      onChange={(e) => {
                        setEmployeeSearchText(e.target.value);
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
                          {searchMemberType === "STUDENT" ? "All Students" : "All Employees"}
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
                            No matching {searchMemberType === "STUDENT" ? "students" : "employees"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-1.5 md:col-start-3 md:row-start-1 md:row-span-2 md:mt-0 md:flex md:h-full md:items-center md:justify-center md:pt-3">
                  <div className="flex w-fit flex-col items-center gap-2">
                    <button
                      className="btn btn-primary rounded-lg min-w-[100px]"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                    <button
                      className="btn btn-secondary rounded-lg min-w-[100px]"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="md:col-start-1 md:row-start-2">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full rounded-lg"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "" | "PENDING" | "APPROVED" | "DENIED",
                      )
                    }
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DENIED">Rejected</option>
                  </select>
                </div>

                <div className="md:col-start-2 md:row-start-2">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Month</span>
                  </label>
                  <input
                    type="month"
                    className="input input-bordered w-full rounded-lg"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Leave Request List</h3>
            {role == "USER" && (
              <Link
                to="/leave/create"
                className="btn btn-primary rounded-lg"
              >
                Create Leave Form
              </Link>
            )}
          </div>

          <LeaveRequestTable
            fromDate={canUseSearch ? searchFromDate : undefined}
            toDate={canUseSearch ? searchToDate : undefined}
            status={canUseSearch ? searchStatus || undefined : undefined}
            employeeId={canUseSearch ? searchEmployeeId || undefined : undefined}
            memberType={hideStudentForClient ? "EMPLOYEE" : searchMemberType}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Leave;
