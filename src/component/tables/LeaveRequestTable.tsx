import { useState } from "react";
import { Link } from "react-router-dom";
import { leaveRequestRepository } from "../../repositories/leaveRepository";
import { useGetLeave } from "../../hooks/useGetLeave";

const PAGE_SIZE = 10;

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employee?: {
    firstName: string;
    lastName: string;
  };
  leaveType: "ANNUAL" | "SICK" | "EMERGENCY" | "UNPAID" | "PATERNITY";
  startDate: string;
  endDate: string;
  reason: string;
  file?: string;
  createdAt: string;
};

const LeaveRequestTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data: leaveRequests, total, mutate } = useGetLeave({
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    setSelectedLeave(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).close();
  };

  const confirmDelete = async () => {
    if (!selectedLeave) return;

    try {
      const response = await leaveRequestRepository.deleteLeave(selectedLeave.id);

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

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests && leaveRequests.length > 0 ? (
              leaveRequests.map((leave: LeaveRequest, index: number) => (
                <tr key={leave.id}>
                  <td>{offset + index + 1}</td>
                  <td>
                    {leave.employee
                      ? `${leave.employee.firstName} ${leave.employee.lastName}`
                      : "-"}
                  </td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>{new Date(leave.createdAt).toLocaleString()}</td>
                  <td className="flex gap-2">
                    <Link
                      to={`/leave/${leave.id}/edit`}
                      className="btn btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(leave)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No leave requests found
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
            Are you sure you want to delete this leave request?
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
    </div>
  );
};

export default LeaveRequestTable;