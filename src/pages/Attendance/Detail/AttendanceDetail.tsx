import { Link, useParams } from "react-router-dom";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import Loading from "../../../component/layouts/common/Loading";
import { useGetAttendanceById } from "../../../hooks/useGetAttendance";
import { useAuthStore } from "../../../stores/authStore";
import { baseUrl } from "../../../enum/urls";

const AttendanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const role = useAuthStore((state) => state.user?.role);
  const employeeId = useAuthStore((state) => state.user?.employeeId);
  const { data: attendanceData, isLoading } = useGetAttendanceById(id ?? "");

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  const getPhotoUrl = (path?: string) => {
    if (!path) return undefined;
    return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
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

  if (isLoading) return <Loading />;

  if (!attendanceData) {
    return (
      <Layout>
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Attendance", path: "/attendance" },
                { label: "Attendance Detail" },
              ]}
            />
            <p className="text-sm text-gray-500">Attendance data not found.</p>
            <div className="pt-2">
              <Link to="/attendance" className="btn btn-soft">
                Back to Attendance
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const isForbidden =
    role === "USER" &&
    !!employeeId &&
    attendanceData.employeeId &&
    attendanceData.employeeId !== employeeId;

  if (isForbidden) {
    return (
      <Layout>
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Attendance", path: "/attendance" },
                { label: "Attendance Detail" },
              ]}
            />
            <p className="text-sm text-red-500">
              You are not allowed to view this attendance record.
            </p>
            <div className="pt-2">
              <Link to="/attendance" className="btn btn-soft">
                Back to Attendance
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const checkInPhotoUrl = getPhotoUrl(attendanceData.checkInPhoto);
  const checkOutPhotoUrl = getPhotoUrl(attendanceData.checkOutPhoto);

  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Attendance", path: "/attendance" },
              { label: "Attendance Detail" },
            ]}
          />

          <h3 className="text-2xl font-bold my-4">Attendance Detail</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-1">Employee</p>
              <p className="font-semibold">
                {attendanceData.employee
                  ? `${attendanceData.employee.firstName} ${attendanceData.employee.lastName}`
                  : "-"}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-1">Company</p>
              <p className="font-semibold">
                {attendanceData.employee?.company?.name || "-"}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-1">Check In Time</p>
              <p className="font-semibold">
                {formatDateTime(attendanceData.checkInTime)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-1">Check Out Time</p>
              <p className="font-semibold">
                {formatDateTime(attendanceData.checkOutTime)}
              </p>
            </div>

            <div className="rounded-lg border p-4 md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Total Working Hours</p>
              <p className="font-semibold">
                {getTotalWorking(attendanceData.checkInTime, attendanceData.checkOutTime)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-2">Check In Location</p>
              <p className="font-semibold">{attendanceData.checkInLocation || "-"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-2">Check Out Location</p>
              <p className="font-semibold">{attendanceData.checkOutLocation || "-"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-2">Check In Photo</p>
              {checkInPhotoUrl ? (
                <img
                  src={checkInPhotoUrl}
                  alt="Check in"
                  className="w-full max-h-80 object-cover rounded-md border"
                />
              ) : (
                <p className="text-sm text-gray-500">No photo</p>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-2">Check Out Photo</p>
              {checkOutPhotoUrl ? (
                <img
                  src={checkOutPhotoUrl}
                  alt="Check out"
                  className="w-full max-h-80 object-cover rounded-md border"
                />
              ) : (
                <p className="text-sm text-gray-500">No photo</p>
              )}
            </div>
          </div>

          <div className="pt-6 card-actions justify-between">
            <Link to="/attendance" className="btn btn-soft">
              Back to Attendance
            </Link>
            {role !== "USER" && (
              <Link to={`/attendance/${attendanceData.id}/edit`} className="btn btn-primary">
                Edit Attendance
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceDetail;
