import profileImg from "../../assets/profile.jpg";
import { useNavigate } from "react-router-dom";
import Layout from "../../component/layouts/layout";
import { useGetUserById } from "../../hooks/useGetUser";
import { baseUrl } from "../../enum/urls";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = jwtDecode<{
    user: { userId: string; };
  }>(token);

  const userId = decodedToken.user.userId;

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

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-md bg-base-100">
          <div className="card-body flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border mb-4">
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-xl font-semibold text-center">{name}</h2>
            <p className="text-center text-gray-500 mt-1">{email}</p>

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
