import { Link } from "react-router-dom";
import { useLeaveCreateForm } from "./useLeaveCreateForm";
import Layout from "../../../component/layouts/layout";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import InputSelect from "../../../component/forms/InputSelect";

const LeaveCreate = () => {
  const { onSubmit, loading, success, message, show, ...methods } =
    useLeaveCreateForm();

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
              <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
                {show && <Alert success={success} message={message} />}
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