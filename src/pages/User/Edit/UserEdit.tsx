import { FormProvider } from 'react-hook-form';
import Breadcrumb from '../../../component/layouts/common/Breadcrumb';
import Layout from '../../../component/layouts/layout'
import { useUserEditForm } from './useUserEditForm';
import Alert from '../../../component/forms/Alert';
import RadioInput from '../../../component/forms/RadioInput';
import InputFile from '../../../component/forms/InputFile';
import InputText from '../../../component/forms/InputText';
import { Link } from 'react-router-dom';

const UserEdit = () => {
  const { onSubmit, loading, success, message, show, logoPreview, ...methods } =
    useUserEditForm();
  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "User", path: "/user" },
                { label: "Edit User" },
              ]}
            />

            <h3 className="text-2xl font-bold my-4">Edit User</h3>

            <FormProvider {...methods}>
              <form
                className="space-y-4"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {show && <Alert success={success} message={message} />}
                <InputText label="Name" name="name" required />
                <InputText label="Email" name="email" type="email" required />
                <InputFile
                  label="Profile"
                  name="logo"
                  defaultImage={logoPreview}
                />
                <RadioInput
                  label="Status"
                  name="status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />
                <div className="pt-4 card-actions flex justify-between">
                  <Link to="/user" className="btn btn-soft">
                    Back to User
                  </Link>
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Loading..." : "Edit User"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UserEdit