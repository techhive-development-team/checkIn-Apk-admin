import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { companyRepository } from "../repositories/companyRepository";

const RecoveryEmailVerify = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying recovery email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (!token) {
          throw new Error("Missing verification token.");
        }

        const res = await companyRepository.verifyRecoveryEmailToken(token);
        setSuccess(true);
        setMessage(res?.message || "Recovery email verified successfully.");
      } catch (error: any) {
        setSuccess(false);
        setMessage(error?.message || "Verification link is invalid or expired.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card card-bordered w-full max-w-lg bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            {loading
              ? "Verifying..."
              : success
                ? "Recovery email verified"
                : "Verification failed"}
          </h2>
          <p className="text-sm text-base-content/80">{message}</p>
          <div className="card-actions justify-end mt-4">
            <Link className="btn btn-primary" to={success ? "/" : "/profile/edit"}>
              {success ? "Go to Dashboard" : "Back to Profile Edit"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryEmailVerify;
