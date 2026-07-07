import { useNavigate } from "react-router-dom";
import {
  useLeaveNotifications,
  type LeaveNotification,
} from "../../../hooks/useLeaveNotifications";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

const formatRange = (leave: LeaveNotification) => {
  const start = formatDate(leave.startDate);
  const end = formatDate(leave.endDate);
  return start === end ? start : `${start} – ${end}`;
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const { mode, items, count, markAllSeen } = useLeaveNotifications();

  const isApprover = mode === "PENDING";
  const heading = isApprover ? "Leave Requests" : "Leave Updates";
  const emptyText = isApprover
    ? "No pending leave requests"
    : "No leave updates yet";

  const openDropdown = () => {
    if (!isApprover) markAllSeen();
  };

  const goToLeave = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    markAllSeen();
    navigate(isApprover ? "/leave?status=PENDING" : "/leave");
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        aria-label={`Leave notifications${count ? `, ${count} new` : ""}`}
        title={isApprover ? "Pending leave requests" : "Leave request updates"}
        onClick={openDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openDropdown();
        }}
      >
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {count > 0 && (
            <span className="badge badge-error badge-sm indicator-item text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </div>
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-10 mt-3 w-80 rounded-box bg-base-100 p-0 shadow"
      >
        <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
          <span className="font-semibold">{heading}</span>
          {count > 0 && (
            <span className="badge badge-error badge-sm text-white">
              {count} new
            </span>
          )}
        </div>

        <ul className="max-h-80 overflow-y-auto">
          {items.length > 0 ? (
            items.map((leave) => (
              <li
                key={leave.id}
                className={`cursor-pointer border-b border-base-200 px-4 py-3 hover:bg-base-200 ${
                  leave.unseen ? "bg-base-200/60" : ""
                }`}
                onClick={goToLeave}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 truncate font-medium">
                    {leave.unseen && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-error" />
                    )}
                    <span className="truncate">
                      {leave.employee
                        ? `${leave.employee.firstName} ${leave.employee.lastName}`
                        : "Leave request"}
                    </span>
                  </span>
                  {isApprover ? (
                    <span className="badge badge-ghost badge-sm shrink-0">
                      {leave.leaveType}
                    </span>
                  ) : (
                    <span
                      className={`badge badge-sm shrink-0 text-white ${
                        leave.status === "APPROVED"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {leave.status === "APPROVED" ? "Approved" : "Rejected"}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-base-content/70">
                  {leave.leaveType} · {formatRange(leave)}
                </div>
                {!isApprover &&
                  leave.status === "DENIED" &&
                  leave.rejectedReason && (
                    <div className="mt-1 truncate text-xs text-error">
                      Reason: {leave.rejectedReason}
                    </div>
                  )}
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-sm text-base-content/60">
              {emptyText}
            </li>
          )}
        </ul>

        <button
          type="button"
          className="btn btn-ghost btn-sm w-full rounded-none rounded-b-box border-t border-base-300"
          onClick={goToLeave}
        >
          {isApprover ? "View all requests" : "View my leave requests"}
        </button>
      </div>
    </div>
  );
};

export default NotificationBell;
