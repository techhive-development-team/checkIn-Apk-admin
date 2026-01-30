import Layout from '../../../component/layouts/layout'
import Breadcrumb from '../../../component/layouts/common/Breadcrumb'
import { FormProvider } from 'react-hook-form'
import { useUserCreateForm } from './useUserCreateForm'
import Alert from '../../../component/forms/Alert'
import InputText from '../../../component/forms/InputText'
import InputFile from '../../../component/forms/InputFile'
import { Link } from 'react-router-dom'

const UserCreate = () => {
    const { onSubmit, loading, success, message, show, ...methods } = useUserCreateForm();
    return (
        <Layout>
            <div className="card card-bordered w-full max-w-3xl bg-base-100">
                <div className="card-body">
                    <Breadcrumb
                        items={[
                            { label: "Home", path: "/" },
                            { label: "User", path: `/user` },
                            { label: "Add User" },
                        ]}
                    />
                    <h3 className="text-2xl font-bold my-4">Create User</h3>
                    <FormProvider {...methods}>

                        <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
                            {show && <Alert success={success} message={message} />}
                            <InputText label="Name" name="name" required />
                            <InputText label="Email" name="email" required type="email" />
                            <InputFile label="Image" name="logo" required />
                            <div className="pt-4 card-actions flex justify-between">
                                <Link to="/user" className="btn btn-soft">
                                    Back to User
                                </Link>
                                <button className="btn btn-primary" disabled={loading}>
                                    {loading ? "Loading..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </Layout >
    )
}

export default UserCreate