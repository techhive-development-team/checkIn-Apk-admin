import { useMemo, useState } from "react";
import { getPlan } from "../../../config/plans";
import type { CompanyMember } from "./useCompanyEditForm";

interface Props {
  open: boolean;
  targetPlanKey: string;
  cap: number;
  members: CompanyMember[];
  loading: boolean;
  onDownload: (removeEmployeeIds: string[]) => Promise<void> | void;
  onDownloadAttendance: (removeEmployeeIds: string[]) => Promise<void> | void;
  onConfirm: (removeEmployeeIds: string[]) => Promise<void> | void;
  onClose: () => void;
}

const sortByOldest = (members: CompanyMember[]) =>
  [...members].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return ta - tb;
  });

const DowngradeMembersModal = ({
  open,
  targetPlanKey,
  cap,
  members,
  loading,
  onDownload,
  onDownloadAttendance,
  onConfirm,
  onClose,
}: Props) => {
  const ordered = useMemo(() => sortByOldest(members), [members]);
  // Default to keeping the oldest members that fit the new cap.
  const [keepIds, setKeepIds] = useState<Set<string>>(
    () => new Set(ordered.slice(0, cap).map((m) => m.employeeId)),
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadingAttendance, setDownloadingAttendance] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [hasDownloadedAttendance, setHasDownloadedAttendance] = useState(false);

  if (!open) return null;

  const plan = getPlan(targetPlanKey);
  const removeIds = ordered
    .filter((m) => !keepIds.has(m.employeeId))
    .map((m) => m.employeeId);
  const keepCount = keepIds.size;
  const overCap = keepCount > cap;

  const toggleKeep = (employeeId: string) => {
    setKeepIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
    setHasDownloaded(false);
    setHasDownloadedAttendance(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await onDownload(removeIds);
      setHasDownloaded(true);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAttendance = async () => {
    setDownloadingAttendance(true);
    try {
      await onDownloadAttendance(removeIds);
      setHasDownloadedAttendance(true);
    } finally {
      setDownloadingAttendance(false);
    }
  };

  const canConfirm =
    !overCap &&
    removeIds.length > 0 &&
    hasDownloaded &&
    hasDownloadedAttendance &&
    !loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-base-100 shadow-xl">
        <div className="border-b border-base-300 p-5">
          <h3 className="text-lg font-bold">Downgrade to {plan.name}</h3>
          <p className="mt-1 text-sm text-base-content/70">
            The {plan.name} plan allows up to{" "}
            <span className="font-semibold">{cap}</span> members, but this
            company currently has{" "}
            <span className="font-semibold">{members.length}</span>.             Choose who
            to keep. Download the removed members' profile and attendance data
            first — they will be deactivated (kept on file so they can be
            restored if you upgrade again).
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span
              className={overCap ? "font-semibold text-error" : "font-semibold"}
            >
              Keeping {keepCount} / {cap}
            </span>
            <span className="text-base-content/70">
              Removing {removeIds.length}
            </span>
          </div>
          {overCap && (
            <p className="mb-3 text-sm text-error">
              You can keep at most {cap} members. Unselect{" "}
              {keepCount - cap} more.
            </p>
          )}
          <ul className="divide-y divide-base-200">
            {ordered.map((m) => {
              const keep = keepIds.has(m.employeeId);
              return (
                <li
                  key={m.employeeId}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {m.firstName} {m.lastName}
                      <span className="ml-2 badge badge-ghost badge-sm">
                        {m.memberType || "EMPLOYEE"}
                      </span>
                    </p>
                    <p className="text-xs text-base-content/60">{m.email}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <span className={keep ? "text-success" : "text-error"}>
                      {keep ? "Keep" : "Remove"}
                    </span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-success"
                      checked={keep}
                      onChange={() => toggleKeep(m.employeeId)}
                    />
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-base-300 p-5">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleDownload}
              disabled={removeIds.length === 0 || downloading || loading}
            >
              {downloading
                ? "Preparing..."
                : hasDownloaded
                  ? "Members downloaded ✓"
                  : "Download members (.xlsx)"}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleDownloadAttendance}
              disabled={
                removeIds.length === 0 || downloadingAttendance || loading
              }
            >
              {downloadingAttendance
                ? "Preparing..."
                : hasDownloadedAttendance
                  ? "Attendance downloaded ✓"
                  : "Download attendance (.xlsx)"}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onConfirm(removeIds)}
              disabled={!canConfirm}
            >
              {loading
                ? "Applying..."
                : `Remove ${removeIds.length} & downgrade`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DowngradeMembersModal;
