import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { client } from "../repositories/client";
import Loading from "../component/layouts/common/Loading.tsx";
import { useAuthStore } from "../stores/authStore";

const Dashboard = lazy(() => import("../pages/Dashboard"));

const UserPage = lazy(() => import("../pages/User/User.tsx"));
const UserCreatePage = lazy(
  () => import("../pages/User/Create/UserCreate.tsx"),
);
const UserEditPage = lazy(() => import("../pages/User/Edit/UserEdit.tsx"));

const CompanyPage = lazy(() => import("../pages/Company/Company.tsx"));
const CompanyEdit = lazy(() => import("../pages/Company/Edit/CompanyEdit.tsx"));

const EmployeePage = lazy(() => import("../pages/Employee/Employee.tsx"));
const StudentPage = lazy(() => import("../pages/Student/Student.tsx"));
const EmployeeCreate = lazy(
  () => import("../pages/Employee/Create/EmployeeCreate.tsx"),
);
const EmployeeUpdate = lazy(
  () => import("../pages/Employee/Edit/EmployeeEdit.tsx"),
);
const StudentCreate = lazy(
  () => import("../pages/Student/Create/StudentCreate.tsx"),
);
const StudentUpdate = lazy(
  () => import("../pages/Student/Edit/StudentEdit.tsx"),
);

const AttendancePage = lazy(() => import("../pages/Attendance/Attendance.tsx"));
const AttendanceDetail = lazy(
  () => import("../pages/Attendance/Detail/AttendanceDetail.tsx"),
);
const AttendanceEdit = lazy(
  () => import("../pages/Attendance/Edit/AttendanceEdit.tsx"),
);

const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage.tsx"));
const ProfileUpdate = lazy(
  () => import("../pages/Profile/Edit/ProfileEdit.tsx"),
);
const ResetPassword = lazy(
  () => import("../pages/Profile/PasswordReset/ResetPassword.tsx"),
);

const Login = lazy(() => import("../pages/Login/Login.tsx"));
const Signup = lazy(() => import("../pages/Signup/Signup.tsx"));
const ForgotPwd = lazy(() => import("../pages/ForgetPwd/ForgotPassword.tsx"));
const PasswordReset = lazy(() => import("../pages/ForgetPwd/resetPwd/PasswordReset.tsx")) //forgetpwd
const Google = lazy(() => import("../pages/Google.tsx"));
const RecoveryEmailVerify = lazy(() => import("../pages/RecoveryEmailVerify.tsx"));
const AccessDenied = lazy(() => import("../pages/AccessDenied.tsx"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Unauthorized = lazy(() => import("../pages/Unauthorized.tsx"));

const LeaveList = lazy(() => import("../pages/Leave/Leave.tsx"));
const LeaveEdit = lazy(() => import("../pages/Leave/Edit/LeaveEdit.tsx"));
const LeaveCreate = lazy(() => import("../pages/Leave/Create/LeaveCreate.tsx"));

const ProtectedRoute: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [requiresRecoveryVerification, setRequiresRecoveryVerification] =
    useState(false);
  const [blockStudentRoutes, setBlockStudentRoutes] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return setIsAuth(false);

      try {
        const res = await client.exec("/auth/verify-token", { method: "GET" });
        
        setIsAuth(res?.success ?? false);
        setRequiresRecoveryVerification(
          !!res?.data?.requiresRecoveryEmailVerification,
        );
        setBlockStudentRoutes(
          res?.data?.role === "CLIENT" && res?.data?.company?.type === "Company",
        );
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isAuth === null) return <Loading />;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiresRecoveryVerification && location.pathname !== "/profile/edit") {
    return <Navigate to="/profile/edit" replace />;
  }

  if (blockStudentRoutes && location.pathname.startsWith("/student")) {
    return <Navigate to="/employee" replace />;
  }

  return <Outlet />;
};

interface AppRoute {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  index?: boolean;
  protected?: boolean;
}

const routes: AppRoute[] = [
  { path: "/", element: Dashboard, index: true, protected: true },

  { path: "/user", element: UserPage, protected: true },
  { path: "/user/create", element: UserCreatePage, protected: true },
  { path: "/user/:id/edit", element: UserEditPage, protected: true },

  { path: "/company", element: CompanyPage, protected: true },
  { path: "/company/:id/edit", element: CompanyEdit, protected: true },

  { path: "/employee", element: EmployeePage, protected: true },
  { path: "/employee/create", element: EmployeeCreate, protected: true },
  { path: "/employee/:id/edit", element: EmployeeUpdate, protected: true },
  { path: "/student", element: StudentPage, protected: true },
  { path: "/student/create", element: StudentCreate, protected: true },
  { path: "/student/:id/edit", element: StudentUpdate, protected: true },

  { path: "/attendance", element: AttendancePage, protected: true },
  { path: "/attendance/:id", element: AttendanceDetail, protected: true },
  { path: "/attendance/:id/edit", element: AttendanceEdit, protected: true },

  { path: "/profile", element: ProfilePage, protected: true },
  { path: "/profile/edit", element: ProfileUpdate, protected: true },
  { path: "/resetPassword", element: ResetPassword },
  { path: "/forgot-password", element: ForgotPwd },
  { path: "/reset-password", element: PasswordReset },

  { path: "/leave", element: LeaveList, protected: true },
  { path: "/leave/create", element: LeaveCreate, protected: true },
  { path: "/leave/:id/edit", element: LeaveEdit, protected: true },


  { path: "/login", element: Login },
  { path: "/signup", element: Signup },
  { path: "/google", element: Google },
  { path: "/recovery-email-verify", element: RecoveryEmailVerify },
  { path: "/401", element: AccessDenied },
  { path: "/403", element: Unauthorized },
  { path: "*", element: NotFound },
];

const generateRoutes = (routes: AppRoute[]) =>
  routes.map((route) =>
    route.protected ? (
      <Route element={<ProtectedRoute />} key={route.path}>
        <Route
          index={route.index}
          path={route.path}
          element={<route.element />}
        />
      </Route>
    ) : (
      <Route
        key={route.path}
        index={route.index}
        path={route.path}
        element={<route.element />}
      />
    ),
  );

const CiaRoutes: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(<>{generateRoutes(routes)}</>),
  );

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default CiaRoutes;
