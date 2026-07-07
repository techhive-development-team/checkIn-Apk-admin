import profileImg from "../../assets/profile.jpg";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../component/layouts/layout";
import { useGetUserById } from "../../hooks/useGetUser";
import { baseUrl } from "../../enum/urls";
import { useAuthStore } from "../../stores/authStore";
import { getPlan } from "../../config/plans";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.userId ?? "");

  const { data: user, isLoading, error } = useGetUserById(userId);
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <span>Loading...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <span>Failed to load user data</span>
        </div>
      </Layout>
    );
  }

  const name = user?.name || "User";
  const email = user?.email || "user@example.com";
  const image = user?.logo
    ? `${baseUrl.replace(/\/$/, "")}${user.logo}`
    : profileImg;

  const planKey = user?.company?.plan as string | undefined;
  const plan = getPlan(planKey);
  const isPaid = !!planKey && planKey !== "FREE";
  const hasPlan = !!user?.company;

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-md bg-base-100">
          <div className="card-body flex flex-col items-center">
            <div className="relative mb-4 h-28 w-28">
              {isPaid && (
                <div className="story-ring absolute inset-0 rounded-full" />
              )}
              <div
                className={`absolute overflow-hidden rounded-full bg-base-100 ${
                  isPaid ? "inset-[4px]" : "inset-0 border"
                }`}
              >
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center">{name}</h2>
            <p className="text-center text-gray-500 mt-1">{email}</p>

            {hasPlan && (
              <div className="mt-3 flex flex-col items-center gap-1">
                <span
                  className={`badge ${
                    isPaid ? "badge-primary" : "badge-ghost"
                  } gap-1`}
                >
                  {isPaid && <span aria-hidden="true">★</span>}
                  {plan.name} Plan
                </span>
                <Link
                  to="/pricing"
                  className="link link-hover text-xs text-base-content/60"
                >
                  {isPaid ? "Manage plan" : "Upgrade plan"}
                </Link>
              </div>
            )}

            <div className="mt-6 w-full space-y-3">
              <button
                className="btn btn-primary w-full"
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-outline btn-error w-full"
                onClick={() => navigate("/resetpassword")}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
