import { Link } from "react-router-dom";
import { useLeaveCreateForm } from "./useLeaveCreateForm";
import Layout from "../../../component/layouts/layout";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import InputSelect from "../../../component/forms/InputSelect";
import { useGetEmployee } from "../../../hooks/useGetEmployee";
import { useAuthStore } from "../../../stores/authStore";
import { useEffect, useState } from "react";
import { useGetUserById } from "../../../hooks/useGetUser";

const LeaveCreate = () => {
  const { onSubmit, loading, success, message, show, ...methods } =
    useLeaveCreateForm();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const companyId = user?.companyId;
  const userId = user?.userId;
  const { data: userData } = useGetUserById(userId || "");
  const hideStudentForClient =
    role === "CLIENT" && userData?.company?.type === "Company";
  const showEmployeeSelect = role === "ADMIN" || role === "CLIENT";
  const showPersonTypeSelector = role === "CLIENT" && !hideStudentForClient;
  const [selectedMemberType, setSelectedMemberType] = useState<
    "EMPLOYEE" | "STUDENT"
  >("EMPLOYEE");

  useEffect(() => {
    methods.setValue("employeeId", "");
  }, [selectedMemberType, methods]);

  useEffect(() => {
    if (hideStudentForClient && selectedMemberType !== "EMPLOYEE") {
      setSelectedMemberType("EMPLOYEE");
      methods.setValue("employeeId", "");
    }
  }, [hideStudentForClient, selectedMemberType, methods]);

  const { data: employees } = useGetEmployee({
    companyId: role === "CLIENT" ? companyId : undefined,
    memberType:
      role === "CLIENT" && hideStudentForClient
        ? "EMPLOYEE"
        : showPersonTypeSelector
          ? selectedMemberType
          : "EMPLOYEE",
    limit: 1000,
    offset: 0,
  });

  const employeeOptions = (employees ?? []).map((employee: any) => ({
    label: `${employee.firstName} ${employee.lastName}`,
    value: employee.employeeId,
  }));

  const leaveOptions = [
    { label: "Annual", value: "ANNUAL" },
    { label: "Sick", value: "SICK" },
    { label: "Emergency", value: "EMERGENCY" },
    { label: "Unpaid", value: "UNPAID" },
    { label: "Paternity", value: "PATERNITY" },
  ];

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Leave Requests", path: "/leave" },
                { label: "Add Leave Request" },
              ]}
            />
            <h3 className="text-2xl font-bold my-4">Create Leave Request</h3>

            <FormProvider {...methods}>
              <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
                {show && <Alert success={success} message={message} />}
                {showPersonTypeSelector && (
                  <div className="form-control w-full">
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
                          name="leavePersonType"
                          value="EMPLOYEE"
                          checked={selectedMemberType === "EMPLOYEE"}
                          onChange={() => setSelectedMemberType("EMPLOYEE")}
                        />
                        <span className="text-sm text-base-content">Employee</span>
                      </label>
                      <label className="inline-flex items-center gap-2.5">
                        <input
                          type="radio"
                          className="radio radio-sm text-sky-600"
                          name="leavePersonType"
                          value="STUDENT"
                          checked={selectedMemberType === "STUDENT"}
                          onChange={() => setSelectedMemberType("STUDENT")}
                        />
                        <span className="text-sm text-base-content">Student</span>
                      </label>
                    </div>
                  </div>
                )}
                {showEmployeeSelect && (
                  <InputSelect
                    label={
                      showPersonTypeSelector && selectedMemberType === "STUDENT"
                        ? "Student"
                        : "Employee"
                    }
                    name="employeeId"
                    options={employeeOptions}
                    placeholder={
                      showPersonTypeSelector && selectedMemberType === "STUDENT"
                        ? "Select Student"
                        : "Select Employee"
                    }
                    required
                  />
                )}
                <InputSelect
                  label="Leave Type"
                  name="leaveType"
                  options={leaveOptions}
                  placeholder="Select Leave Type"
                  required
                />
                <InputText label="Start Date" name="startDate" type="date" required />
                <InputText label="End Date" name="endDate" type="date" required />
                <InputText label="Reason" name="reason" required />
                <InputFile label="Attachment (Optional)" name="file" />

                <div className="pt-4 card-actions flex justify-between">
                  <Link to="/leave" className="btn btn-soft">
                    Back to Leave Request
                  </Link>
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Loading..." : "Create Leave Request"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveCreate;