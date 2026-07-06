import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAttendance } from "../../hooks/useGetAttendance";
import { attendanceRepository } from "../../repositories/attendanceRepository";
import { baseUrl } from "../../enum/urls";

const PAGE_SIZE = 10;
const SINGLE_DAY_LIMIT = 1000;

const getDateKeyInTimezone = (value: Date | string, timezone: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getRowDateSource = (row: {
  checkInTime?: string;
  date?: string;
}): string | undefined => row.checkInTime || row.date;

const formatAttendanceDate = (value: string | undefined, timezone: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatAttendanceDateTime = (value: string | undefined, timezone: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export type Attendance = {
  id: string;
  employeeId: string;
  date?: string;
  employee?: {
    firstName: string;
    lastName: string;
    profilePic: string;
    company: {
      name: string;
    };
    memberType?: string;
  };
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: string;
  checkOutLocation?: string;
  createdAt: string;
  status?: "PRESENT" | "LEAVE" | "ABSENT";
  rowStatus?: "PRESENT" | "LEAVE" | "ABSENT";
  leaveType?: string;
  leaveRequestId?: string;
  leaveId?: string;
};

interface AttendanceTableProps {
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
  workStartTime?: string;
  workEndTime?: string;
  graceMinutes?: number;
  memberType?: "EMPLOYEE" | "STUDENT";
  timezone?: string;
}

const mapAttendanceRow = (row: Attendance): Attendance => {
  const rowStatus =
    row.status ||
    (row.checkInTime ? "PRESENT" : "ABSENT");

  return {
    ...row,
    rowStatus,
    leaveId: row.leaveRequestId,
  };
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  fromDate = "",
  toDate = "",
  employeeId = "",
  workStartTime = "",
  workEndTime = "",
  graceMinutes = 0,
  memberType,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Yangon",
}) => {
  const effectiveToDate = toDate || fromDate;
  const isSingleDayFilter =
    !!fromDate && effectiveToDate === fromDate;

  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;
  const apiLimit = isSingleDayFilter ? SINGLE_DAY_LIMIT : PAGE_SIZE;
  const apiOffset = isSingleDayFilter ? 0 : offset;

  const {
    data: attendances,
    total,
    mutate,
  } = useGetAttendance({
    limit: apiLimit,
    offset: apiOffset,
    fromDate: fromDate || undefined,
    toDate: effectiveToDate || undefined,
    employeeId: employeeId || undefined,
    memberType,
    timezone,
  });

  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<string[]>(
    [],
  );
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAttendanceIds([]);
  }, [page, attendances, fromDate, toDate, employeeId, workStartTime, workEndTime, graceMinutes]);

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate, employeeId, memberType]);

  const handleDelete = (attendance: Attendance) => {
    setIsBulkDelete(false);
    setSelectedAttendance(attendance);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const toggleAttendanceSelection = (attendanceId: string) => {
    setSelectedAttendanceIds((prev) =>
      prev.includes(attendanceId)
        ? prev.filter((id) => id !== attendanceId)
        : [...prev, attendanceId],
    );
  };

  const displayRows = useMemo(
    () => (attendances || []).map(mapAttendanceRow),
    [attendances],
  );

  const toggleSelectAllAttendance = () => {
    if (displayRows.length === 0) return;
    const currentPageAttendanceIds = displayRows.map(
      (attendance: Attendance) => attendance.id,
    );
    const areAllSelected = currentPageAttendanceIds.every((id: string) =>
      selectedAttendanceIds.includes(id),
    );

    setSelectedAttendanceIds((prev) => {
      if (areAllSelected) {
        return prev.filter((id) => !currentPageAttendanceIds.includes(id));
      }
      return [...new Set([...prev, ...currentPageAttendanceIds])];
    });
  };

  const handleBulkDelete = () => {
    if (selectedAttendanceIds.length === 0) return;
    setIsBulkDelete(true);
    setSelectedAttendance(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    setIsBulkDelete(false);
    setSelectedAttendance(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).close();
  };

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        if (selectedAttendanceIds.length === 0) return;
        const results = await Promise.allSettled(
          selectedAttendanceIds.map((attendanceId) =>
            attendanceRepository.deleteAttendance(attendanceId),
          ),
        );

        const failed = results.filter((result) => result.status === "rejected");
        if (failed.length > 0) {
          setDeleteError(
            `${failed.length} of ${selectedAttendanceIds.length} selected records could not be deleted.`,
          );
          return;
        }

        setSelectedAttendanceIds([]);
      } else {
        if (!selectedAttendance) return;
        const response = await attendanceRepository.deleteAttendance(
          selectedAttendance.id,
        );

        if (response?.statusCode !== 200) return;
        setSelectedAttendanceIds((prev) =>
          prev.filter((id) => id !== selectedAttendance.id),
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

  const getTotalWorking = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return "-";
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();
    const diffMs = outTime - inTime;
    if (diffMs < 0) return "-";
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const parseTime = (value: string) => {
    const [hour, minute] = value.split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    return { hour, minute };
  };

  const getAttendanceCategory = (attendance: Attendance) => {
    if (attendance.rowStatus === "LEAVE") return "leave";
    if (attendance.rowStatus === "ABSENT") return "absent";
    if (!workStartTime || !workEndTime) return "none";
    const start = parseTime(workStartTime);
    const end = parseTime(workEndTime);
    if (!start || !end) return "none";

    const referenceTime = attendance.checkInTime || attendance.checkOutTime;
    if (!referenceTime) return "none";

    const referenceDate = new Date(referenceTime);
    const shiftStart = new Date(referenceDate);
    shiftStart.setHours(start.hour, start.minute, 0, 0);

    const shiftEnd = new Date(referenceDate);
    shiftEnd.setHours(end.hour, end.minute, 0, 0);
    if (shiftEnd.getTime() <= shiftStart.getTime()) {
      shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    const graceThreshold = shiftStart.getTime() + graceMinutes * 60 * 1000;
    const isLate = attendance.checkInTime
      ? new Date(attendance.checkInTime).getTime() > graceThreshold
      : false;
    const isOvertime = attendance.checkOutTime
      ? new Date(attendance.checkOutTime).getTime() > shiftEnd.getTime()
      : false;

    if (isLate && isOvertime) return "late-overtime";
    if (isLate) return "late";
    if (isOvertime) return "overtime";
    return "none";
  };

  const getRowClassName = (attendance: Attendance) => {
    const category = getAttendanceCategory(attendance);
    const isStudentMode = memberType === "STUDENT";

    if (isStudentMode) {
      if (category === "late") return "!bg-purple-100/70 dark:!bg-purple-900/30";
      if (category === "overtime") return "!bg-cyan-100/70 dark:!bg-cyan-900/30";
      if (category === "late-overtime") return "!bg-blue-100/70 dark:!bg-blue-900/30";
      if (category === "leave") return "!bg-yellow-100/70 dark:!bg-yellow-900/30";
      if (category === "absent") return "!bg-slate-300/80 dark:!bg-slate-700/50";
      return "";
    }

    if (category === "late") return "!bg-red-100/70 dark:!bg-red-900/30";
    if (category === "overtime") return "!bg-green-100/70 dark:!bg-green-900/30";
    if (category === "late-overtime") return "!bg-sky-100/70 dark:!bg-sky-900/30";
    if (category === "leave") return "!bg-yellow-100/70 dark:!bg-yellow-900/30";
    if (category === "absent") return "!bg-slate-300/80 dark:!bg-slate-700/50";
    return "";
  };

  const totalPages = isSingleDayFilter
    ? 1
    : total
      ? Math.ceil(total / PAGE_SIZE)
      : 1;
  const rowOffset = isSingleDayFilter ? 0 : offset;
  const todayKey = getDateKeyInTimezone(new Date(), timezone);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          className="btn btn-error btn-sm"
          disabled={selectedAttendanceIds.length === 0}
          onClick={handleBulkDelete}
        >
          Delete Selected ({selectedAttendanceIds.length})
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
                  aria-label="Select all attendance rows"
                  title="Select all attendance rows"
                  checked={
                    displayRows.length > 0 &&
                    displayRows.every((attendance: Attendance) =>
                      selectedAttendanceIds.includes(attendance.id),
                    )
                  }
                  onChange={toggleSelectAllAttendance}
                />
              </th>
              <th>No</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Company Name</th>
              <th>Date</th>
              <th>Check In Time</th>
              <th>Check Out Time</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {displayRows.length > 0 ? (
              displayRows.map((attendance: Attendance, index: number) => (
                <tr key={attendance.id} className={getRowClassName(attendance)}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      aria-label="Select attendance row"
                      title="Select attendance row"
                      checked={selectedAttendanceIds.includes(attendance.id)}
                      onChange={() => toggleAttendanceSelection(attendance.id)}
                    />
                  </td>
                  <td>{rowOffset + index + 1}</td>
                  <td>
                    {attendance.employee?.profilePic ? (
                      <img
                        src={`${baseUrl.replace(/\/$/, "")}${attendance.employee?.profilePic}`}
                        alt={`${attendance.employee.firstName} ${attendance.employee.lastName}`}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  <td>
                    {attendance.employee
                      ? `${attendance.employee.firstName} ${attendance.employee.lastName}`
                      : "-"}
                  </td>
                  <td>{attendance.employee?.company.name}</td>
                  <td>
                    {formatAttendanceDate(getRowDateSource(attendance), timezone)}
                    {getDateKeyInTimezone(getRowDateSource(attendance) || "", timezone) === todayKey && (
                      <span className="ml-2 badge badge-sm badge-primary">Today</span>
                    )}
                  </td>
                  <td>
                    {attendance.checkInTime
                      ? formatAttendanceDateTime(attendance.checkInTime, timezone)
                      : attendance.rowStatus === "LEAVE"
                        ? `${attendance.leaveType || "Leave"} Leave`
                        : attendance.rowStatus === "ABSENT"
                          ? "Absent (No Check-in)"
                          : "-"}
                  </td>
                  <td>
                    {attendance.checkOutTime
                      ? formatAttendanceDateTime(attendance.checkOutTime, timezone)
                      : attendance.rowStatus === "LEAVE"
                        ? "Leave Day"
                        : attendance.rowStatus === "ABSENT"
                          ? "No Check-out"
                          : "-"}
                  </td>
                  <td>
                    {getTotalWorking(
                      attendance.checkInTime,
                      attendance.checkOutTime,
                    )}
                  </td>
                  <td>
                    {attendance.rowStatus === "LEAVE" && "Leave"}
                    {attendance.rowStatus === "ABSENT" && "Absent"}
                    {attendance.rowStatus === "PRESENT" && "Present"}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {attendance.rowStatus === "PRESENT" && attendance.checkInTime ? (
                        <>
                          <Link
                            to={`/attendance/${attendance.id}/edit`}
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
                        </>
                      ) : attendance.rowStatus === "LEAVE" && attendance.leaveId ? (
                        <Link
                          to={`/leave/${attendance.leaveId}/edit`}
                          className="btn btn-sm btn-warning"
                        >
                          View Leave
                        </Link>
                      ) : (
                        <span className="text-xs opacity-70">Auto</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isSingleDayFilter && (
        <div className="join flex justify-end my-4">
          {[...Array(totalPages)].map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <input
                key={pageNumber}
                className="join-item btn btn-square"
                type="radio"
                name="attendance-pagination"
                aria-label={String(pageNumber)}
                checked={page === pageNumber}
                onChange={() => setPage(pageNumber)}
              />
            );
          })}
        </div>
      )}

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>

          <p className="py-4">
            {isBulkDelete ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedAttendanceIds.length}</span>{" "}
                selected attendance records?
              </>
            ) : (
              "Are you sure you want to delete this attendance record?"
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
    </div>
  );
};

export default AttendanceTable;
