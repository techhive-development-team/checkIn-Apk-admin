import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaveRequestRepository } from "../../repositories/leaveRepository";
import { useGetLeave } from "../../hooks/useGetLeave";
import { jwtDecode } from "jwt-decode";

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
  rejectedReason?: string | null;
  file?: string;
  status?: "PENDING" | "APPROVED" | "DENIED";
  createdAt: string;
};

type LeaveRequestTableProps = {
  fromDate?: string;
  toDate?: string;
  status?: "PENDING" | "APPROVED" | "DENIED";
  employeeId?: string;
  memberType?: "EMPLOYEE" | "STUDENT";
};

const LeaveRequestTable: React.FC<LeaveRequestTableProps> = ({
  fromDate,
  toDate,
  status,
  employeeId,
  memberType,
}) => {
  const token = localStorage.getItem("token");
  const decodedToken = token
    ? jwtDecode<{ user: { role: string } }>(token)
    : null;
  const role = decodedToken?.user?.role;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data: leaveRequests, total, mutate } = useGetLeave({
    limit: PAGE_SIZE,
    offset,
    fromDate,
    toDate,
    status,
    employeeId,
    memberType,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<LeaveRequest | null>(null);
  const [rejectMessage, setRejectMessage] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [viewRejectMessage, setViewRejectMessage] = useState<string>("");

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate, status, employeeId, memberType]);

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

  const updateLeaveStatus = async (
    leave: LeaveRequest,
    status: "APPROVED" | "DENIED",
    rejectedReason?: string,
  ) => {
    if (leave.status === status) return;
    try {
      setUpdatingStatusId(leave.id);
      await leaveRequestRepository.updateLeave(leave.id, {
        status,
        ...(status === "DENIED" ? { rejectedReason } : {}),
      });
      await mutate();
    } catch (err) {
      throw err;
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openRejectModal = (leave: LeaveRequest) => {
    setRejectTarget(leave);
    setRejectMessage(leave.rejectedReason ?? "");
    setRejectError(null);
    (document.getElementById("reject_modal") as HTMLDialogElement).showModal();
  };

  const closeRejectModal = () => {
    setRejectTarget(null);
    setRejectMessage("");
    setRejectError(null);
    (document.getElementById("reject_modal") as HTMLDialogElement).close();
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const message = rejectMessage.trim();
    if (!message) {
      setRejectError("Reject reason is required.");
      return;
    }
    try {
      await updateLeaveStatus(rejectTarget, "DENIED", message);
      closeRejectModal();
    } catch (err: any) {
      setRejectError(err?.message || "Cannot reject leave request.");
    }
  };

  const openViewRejectMessageModal = (message?: string | null) => {
    setViewRejectMessage(message || "");
    (document.getElementById("view_reject_message_modal") as HTMLDialogElement).showModal();
  };

  const closeViewRejectMessageModal = () => {
    setViewRejectMessage("");
    (document.getElementById("view_reject_message_modal") as HTMLDialogElement).close();
  };

  const getStatusBadgeClass = (status?: string) => {
    if (status === "APPROVED") return "app-status-badge";
    if (status === "DENIED") return "app-status-badge-inactive";
    return "badge-ghost";
  };

  const getTotalDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

    const from = start <= end ? start : end;
    const to = start <= end ? end : start;
    const diffMs = to.getTime() - from.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Days</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests && leaveRequests.length > 0 ? (
              leaveRequests.map((leave: LeaveRequest, index: number) => {
                const totalDays = getTotalDays(leave.startDate, leave.endDate);
                return (
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
                  <td>
                    {totalDays} {totalDays === 1 ? "Day" : "Days"}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(leave.status)}`}>
                      {leave.status || "PENDING"}
                    </span>
                  </td>
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
                    {leave.status === "DENIED" && leave.rejectedReason && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => openViewRejectMessageModal(leave.rejectedReason)}
                      >
                        Message
                      </button>
                    )}
                    {role === "CLIENT" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          disabled={
                            updatingStatusId === leave.id ||
                            leave.status === "APPROVED"
                          }
                          onClick={() => updateLeaveStatus(leave, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning"
                          disabled={
                            updatingStatusId === leave.id || leave.status === "DENIED"
                          }
                          onClick={() => openRejectModal(leave)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )})
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

      <dialog id="reject_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Reject Leave Request</h3>
          <p className="py-2 text-sm text-base-content/80">
            Add a short reason for rejection.
          </p>
          <textarea
            className="textarea textarea-bordered w-full min-h-28"
            placeholder="Type reject reason..."
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
          />
          {rejectError && (
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 mt-2 whitespace-pre-line">
              ⚠️ {rejectError}
            </p>
          )}
          <div className="modal-action">
            <button type="button" onClick={closeRejectModal} className="btn">
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmReject}
              className="btn btn-warning"
              disabled={updatingStatusId === rejectTarget?.id}
            >
              Submit Reject
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="view_reject_message_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rejected Message</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm text-base-content">
            {viewRejectMessage || "-"}
          </p>
          <div className="modal-action">
            <button type="button" onClick={closeViewRejectMessageModal} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default LeaveRequestTable;