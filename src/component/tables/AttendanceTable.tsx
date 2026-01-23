import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAttendance } from "../../hooks/useGetAttendance";
import { attendanceRepository } from "../../repositories/attendanceRepository";

const PAGE_SIZE = 10;

export type Attendance = {
  attendanceId: string;
  employeeName: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: string;
  checkOutLocation?: string;
  status: string;
  createdAt: string;
};

const AttendanceTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const {
    data: attendances,
    total,
    mutate,
  } = useGetAttendance({
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setDeleteError(null);
    (
      document.getElementById("delete_modal") as HTMLDialogElement
    ).showModal();
  };

  const closeModal = () => {
    setSelectedAttendance(null);
    setDeleteError(null);
    (
      document.getElementById("delete_modal") as HTMLDialogElement
    ).close();
  };

  const confirmDelete = async () => {
    if (!selectedAttendance) return;

    try {
      const response = await attendanceRepository.deleteAttendance(
        selectedAttendance.attendanceId
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

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Employee</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendances && attendances.length > 0 ? (
              attendances.map((attendance: Attendance, index: number) => (
                <tr key={attendance.attendanceId}>
                  <td>{offset + index + 1}</td>

                  <td>{attendance.employeeName}</td>

                  <td>
                    {attendance.checkInTime
                      ? new Date(attendance.checkInTime).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    {attendance.checkOutTime
                      ? new Date(attendance.checkOutTime).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        attendance.status === "present"
                          ? "badge-success"
                          : attendance.status === "absent"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {attendance.status}
                    </span>
                  </td>

                  <td>
                    {new Date(attendance.createdAt).toLocaleString()}
                  </td>

                  <td className="flex gap-2">
                    <Link
                      to={`/attendance/${attendance.attendanceId}/edit`}
                      className="btn btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(attendance)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No attendance records found
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
            Are you sure you want to delete this attendance record?
          </p>

          {deleteError && (
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 mb-2 whitespace-pre-line">
              ⚠️ {deleteError}
            </p>
          )}

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="btn"
              >
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

export default AttendanceTable;
