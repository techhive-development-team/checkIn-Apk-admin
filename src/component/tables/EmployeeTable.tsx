import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetEmployee } from "../../hooks/useGetEmployee";
import { employeeRepository } from "../../repositories/employeeRepository";
import { baseUrl } from "../../enum/urls";
import { useAuthStore } from "../../stores/authStore";

const PAGE_SIZE = 10;
type MemberType = "EMPLOYEE" | "STUDENT";

export type Employee = {
  employeeId: string;
  memberType?: "EMPLOYEE" | "STUDENT";
  profilePic?: string;
  firstName: string;
  lastName: string;
  studentClass?: string;
  classTime?: string;
  classTimeFrom?: string;
  classTimeTo?: string;
  duration?: string;
  durationFrom?: string;
  durationTo?: string;
  classDays?: string[];
  position?: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
  createdAt: string;
  company: {
    name: string
  }
};

interface EmployeeTableProps {
  memberType?: MemberType;
  editBasePath?: "/employee" | "/student";
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  memberType,
  editBasePath = "/employee",
}) => {
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
    memberType,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedEmployeeIds([]);
  }, [page, employees]);

  const handleDelete = (employee: Employee) => {
    setIsBulkDelete(false);
    setSelectedEmployee(employee);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  };

  const toggleSelectAllEmployees = () => {
    if (!employees || employees.length === 0) return;
    const currentPageEmployeeIds = employees.map(
      (employee: Employee) => employee.employeeId,
    );
    const areAllSelected = currentPageEmployeeIds.every((id: string) =>
      selectedEmployeeIds.includes(id),
    );

    setSelectedEmployeeIds((prev) => {
      if (areAllSelected) {
        return prev.filter((id) => !currentPageEmployeeIds.includes(id));
      }
      return [...new Set([...prev, ...currentPageEmployeeIds])];
    });
  };

  const handleBulkDelete = () => {
    if (selectedEmployeeIds.length === 0) return;
    setIsBulkDelete(true);
    setSelectedEmployee(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    setIsBulkDelete(false);
    setSelectedEmployee(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).close();
  };

  const confirmDelete = async () => {
    if (!companyId) return;

    try {
      if (isBulkDelete) {
        if (selectedEmployeeIds.length === 0) return;
        const results = await Promise.allSettled(
          selectedEmployeeIds.map((employeeId) =>
            employeeRepository.deleteEmployee(companyId, employeeId),
          ),
        );

        const failed = results.filter((result) => result.status === "rejected");
        if (failed.length > 0) {
          setDeleteError(
            `${failed.length} of ${selectedEmployeeIds.length} selected employees could not be deleted.`,
          );
          return;
        }

        setSelectedEmployeeIds([]);
      } else {
        if (!selectedEmployee) return;
        const response = await employeeRepository.deleteEmployee(
          companyId,
          selectedEmployee.employeeId,
        );

        if (response?.statusCode !== 200) return;
        setSelectedEmployeeIds((prev) =>
          prev.filter((id) => id !== selectedEmployee.employeeId),
        );
      }

      await mutate();
      closeModal();
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
      const response = await employeeRepository.resetPassword(
        companyId,
        employeeId,
      );

      const modal = document.getElementById(
        "password_reset_modal",
      ) as HTMLDialogElement;
      const title = document.getElementById(
        "modal_title",
      ) as HTMLHeadingElement;
      const message = document.getElementById(
        "modal_message",
      ) as HTMLParagraphElement;

      if (response?.success) {
        title.textContent = "✅ Success";
        message.textContent = response.message || "Password reset successfully";
      } else {
        title.textContent = "⚠️ Failed";
        message.textContent = response?.message || "Something went wrong";
      }

      modal.showModal();
    } catch (err: any) {
      const modal = document.getElementById(
        "password_reset_modal",
      ) as HTMLDialogElement;
      const title = document.getElementById(
        "modal_title",
      ) as HTMLHeadingElement;
      const message = document.getElementById(
        "modal_message",
      ) as HTMLParagraphElement;

      title.textContent = "⚠️ Failed";
      message.textContent = err?.message || "Something went wrong";
      modal.showModal();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          className="btn btn-error btn-sm"
          disabled={selectedEmployeeIds.length === 0}
          onClick={handleBulkDelete}
        >
          Delete Selected ({selectedEmployeeIds.length})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={
                    !!employees &&
                    employees.length > 0 &&
                    employees.every((employee: Employee) =>
                      selectedEmployeeIds.includes(employee.employeeId),
                    )
                  }
                  onChange={toggleSelectAllEmployees}
                />
              </th>
              <th>No</th>
              <th>Photo</th>
              <th>Name</th>
              {memberType === "STUDENT" && <th>Class</th>}
              {memberType === "STUDENT" && <th>Days</th>}
              {memberType === "STUDENT" && <th>Class Start Time</th>}
              {memberType === "STUDENT" && <th>Class End Time</th>}
              {memberType === "STUDENT" && <th>Start Date</th>}
              {memberType === "STUDENT" && <th>End Date</th>}
              <th>Company Name</th>
              {memberType !== "STUDENT" && <th>Position</th>}
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
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedEmployeeIds.includes(employee.employeeId)}
                      onChange={() => toggleEmployeeSelection(employee.employeeId)}
                    />
                  </td>
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
                  {memberType === "STUDENT" && <td>{employee.studentClass || "-"}</td>}
                  {memberType === "STUDENT" && (
                    <td>
                      {employee.classDays && employee.classDays.length > 0
                        ? employee.classDays.join(", ")
                        : "-"}
                    </td>
                  )}
                  {memberType === "STUDENT" && (
                    <td>{employee.classTimeFrom || employee.classTime || "-"}</td>
                  )}
                  {memberType === "STUDENT" && (
                    <td>{employee.classTimeTo || "-"}</td>
                  )}
                  {memberType === "STUDENT" && <td>{employee.durationFrom || "-"}</td>}
                  {memberType === "STUDENT" && <td>{employee.durationTo || "-"}</td>}
                  <td>{employee.company.name}</td>
                  {memberType !== "STUDENT" && <td>{employee.position || "-"}</td>}
                  <td>{employee.email}</td>
                  <td>{employee.phone || "-"}</td>

                  <td>
                    <span
                      className={`badge ${employee.status?.toLowerCase() === "inactive"
                        ? "app-status-badge-inactive"
                        : "app-status-badge"
                        }`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td>{new Date(employee.createdAt).toLocaleString()}</td>

                  <td className="flex gap-2">
                    <Link
                      to={`${editBasePath}/${employee.employeeId}/edit`}
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
                <td colSpan={memberType === "STUDENT" ? 16 : 11} className="text-center py-4">
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
            {isBulkDelete ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedEmployeeIds.length}</span>{" "}
                selected employees?
              </>
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                </span>
                ?
              </>
            )}
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

      <dialog id="password_reset_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg" id="modal_title">
            Message
          </h3>
          <p className="py-4" id="modal_message">
            This is a message
          </p>
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() =>
                (
                  document.getElementById(
                    "password_reset_modal",
                  ) as HTMLDialogElement
                ).close()
              }
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
