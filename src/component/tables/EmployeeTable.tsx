import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetEmployee } from "../../hooks/useGetEmployee";
import { employeeRepository } from "../../repositories/employeeRepository";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../../enum/urls";

const PAGE_SIZE = 10;

export type Employee = {
  employeeId: string;
  profilePic?: string;
  firstName: string;
  lastName: string;
  position?: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
  createdAt: string;
};

const EmployeeTable: React.FC = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token!) as { user: { companyId: string } };
  const companyId = decodedToken?.user?.companyId;

  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const {
    data: employees,
    total,
    mutate,
  } = useGetEmployee({
    companyId,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).close();
  };

  const confirmDelete = async () => {
    if (!selectedEmployee || !companyId) return;

    try {
      const response = await employeeRepository.deleteEmployee(
        companyId,
        selectedEmployee.employeeId,
      );

      if (response?.statusCode === 200) {
        await mutate();
        closeModal();
      }
    } catch (err: any) {
      if (Array.isArray(err?.data)) {
        setDeleteError(err.data.map((d: any) => d.message).join("\n"));
      } else if (err?.message) {
        setDeleteError(err.message);
      } else {
        setDeleteError("Cannot delete: something went wrong.");
      }
    }
  };

  const handleResetPassword = async (employeeId: string) => {
  if (!companyId) return;

  try {
    await employeeRepository.resetPassword(companyId, employeeId);
    alert('Password reset successfully. Check your email for the new password.');
  } catch (err: any) {
    console.error(err);
    alert('Failed to reset password');
  }
};


  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees && employees.length > 0 ? (
              employees.map((employee: Employee, index: number) => (
                <tr key={employee.employeeId}>
                  <td>{offset + index + 1}</td>

                  <td>
                    {employee.profilePic ? (
                      <img
                        src={`${baseUrl.replace(/\/$/, "")}${employee.profilePic}`}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                  </td>

                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>

                  <td>{employee.position || "-"}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || "-"}</td>

                  <td>
                    <span
                      className={`badge ${
                        employee.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td>{new Date(employee.createdAt).toLocaleString()}</td>

                  <td className="flex gap-2">
                    <Link
                      to={`/employee/${employee.employeeId}/edit`}
                      className="btn btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(employee)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleResetPassword(employee.employeeId)}
                      className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="join flex justify-end my-4">
        {[...Array(totalPages)].map((_, idx) => {
          const pageNumber = idx + 1;
          return (
            <input
              key={pageNumber}
              className="join-item btn btn-square"
              type="radio"
              name="options"
              aria-label={String(pageNumber)}
              checked={page === pageNumber}
              onChange={() => setPage(pageNumber)}
            />
          );
        })}
      </div>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>

          <p className="py-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </span>
            ?
          </p>

          {deleteError && (
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 mb-2 whitespace-pre-line">
              ⚠️ {deleteError}
            </p>
          )}

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button type="button" onClick={closeModal} className="btn">
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="btn btn-error"
              >
                Yes, Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Password Reset Modal */}
<dialog id="password_reset_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg" id="modal_title">Message</h3>
    <p className="py-4" id="modal_message">This is a message</p>
    <div className="modal-action">
      <button
        type="button"
        className="btn"
        onClick={() => (document.getElementById("password_reset_modal") as HTMLDialogElement).close()}
      >
        Close
      </button>
    </div>
  </div>
</dialog>

    </div>
  );
};

export default EmployeeTable;
