import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserById } from "../../hooks/useGetUser";
import { companyRepository } from "../../repositories/companyRepository";
import { useAuthStore } from "../../stores/authStore";

const ClientAccountDangerZone = () => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.userId);
  const logout = useAuthStore((state) => state.logout);
  if (!userId) return null;
  const { data: userData, mutate } = useGetUserById(userId);

  const companyId = userData?.company?.companyId;
  const companyName = userData?.company?.name || userData?.name || "";
  const isInactive = userData?.company?.status === "inactive";

  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  if (!companyId || !companyName) return null;

  const handleDeactivate = async () => {
    setError(null);
    setSuccessMessage(null);
    setDeactivateLoading(true);

    try {
      const response = await companyRepository.deactivateAccount(companyId);
      if (response?.statusCode === 200) {
        await mutate();
        setShowDeleteForm(false);
        setDeleteConfirmation("");
        setSuccessMessage(
          "Your company account has been deactivated. Employees can no longer sign in until you reactivate.",
        );
      }
    } catch (err: any) {
      setError(err?.message || "Failed to deactivate account.");
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleReactivate = async () => {
    setError(null);
    setSuccessMessage(null);
    setDeactivateLoading(true);

    try {
      const response = await companyRepository.reactivateAccount(companyId);
      if (response?.statusCode === 200) {
        await mutate();
        setSuccessMessage("Your company account has been reactivated.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to reactivate account.");
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== companyName) return;

    setError(null);
    setDeleteLoading(true);

    try {
      const response = await companyRepository.deleteOwnAccount(
        companyId,
        deleteConfirmation,
      );
      if (response?.statusCode === 200) {
        logout();
        navigate("/login", {
          replace: true,
          state: { message: "Your company account has been deleted." },
        });
      }
    } catch (err: any) {
      if (Array.isArray(err?.data)) {
        setError(err.data.map((d: any) => d.message).join("\n"));
      } else {
        setError(err?.message || "Failed to delete account.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const deleteConfirmed = deleteConfirmation === companyName;

  return (
    <div className="card card-bordered w-full max-w-2xl bg-base-100 mt-6">
      <div className="card-body">
        <h3 className="text-xl font-bold text-error">Danger Zone</h3>
        <p className="text-sm text-gray-500">
          Irreversible and destructive actions for your company account.
        </p>

        {error && (
          <div className="alert alert-error mt-2">
            <span className="whitespace-pre-line">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mt-2">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="border border-base-300 rounded-lg p-4 mt-4 space-y-3">
          <div>
            <h4 className="font-semibold">
              {isInactive ? "Reactivate this account" : "Deactivate this account"}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              {isInactive
                ? "Restore access for your company account and all linked employees."
                : "Temporarily disable your company account. You and your employees will not be able to sign in until the account is reactivated."}
            </p>
          </div>

          {isInactive ? (
            <button
              type="button"
              className="btn btn-outline btn-warning"
              disabled={deactivateLoading}
              onClick={handleReactivate}
            >
              {deactivateLoading ? "Processing..." : "Reactivate account"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-warning"
              disabled={deactivateLoading}
              onClick={() =>
                (
                  document.getElementById(
                    "deactivate_account_modal",
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              Deactivate account
            </button>
          )}
        </div>

        <div className="border border-error/30 rounded-lg p-4 mt-4 space-y-4">
          <div>
            <h4 className="font-semibold text-error">Delete this account</h4>
            <p className="text-sm text-gray-500 mt-1">
              Once you delete your company account, there is no going back. All
              company data, employees, attendance, and leave records will be
              permanently removed. You may sign up again with the same email as a
              new account.
            </p>
          </div>

          {!showDeleteForm ? (
            <button
              type="button"
              className="btn btn-outline btn-error"
              onClick={() => {
                setDeleteConfirmation("");
                setError(null);
                setShowDeleteForm(true);
              }}
            >
              Delete this account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm">
                To confirm, type{" "}
                <span className="font-mono font-semibold bg-base-200 px-2 py-1 rounded">
                  {companyName}
                </span>{" "}
                in the box below.
              </p>

              <input
                type="text"
                className="input input-bordered w-full font-mono"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={companyName}
                autoComplete="off"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-error"
                  disabled={!deleteConfirmed || deleteLoading}
                  onClick={() =>
                    (
                      document.getElementById(
                        "delete_account_modal",
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                >
                  I understand, delete this account
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowDeleteForm(false);
                    setDeleteConfirmation("");
                    setError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <dialog id="deactivate_account_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Deactivate account?</h3>
          <p className="py-4 text-sm text-gray-600">
            You and all employees under{" "}
            <span className="font-semibold">{companyName}</span> will be signed
            out and unable to log in until the account is reactivated.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button type="submit" className="btn">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-warning"
                disabled={deactivateLoading}
                onClick={async () => {
                  (
                    document.getElementById(
                      "deactivate_account_modal",
                    ) as HTMLDialogElement
                  ).close();
                  await handleDeactivate();
                }}
              >
                {deactivateLoading ? "Deactivating..." : "Yes, deactivate"}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="delete_account_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">
            Delete account permanently?
          </h3>
          <p className="py-4 text-sm text-gray-600">
            This action <strong>cannot</strong> be undone. Your company account{" "}
            <span className="font-semibold">{companyName}</span> and all related
            data will be permanently deleted from the database.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button type="submit" className="btn">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                disabled={!deleteConfirmed || deleteLoading}
                onClick={async () => {
                  (
                    document.getElementById(
                      "delete_account_modal",
                    ) as HTMLDialogElement
                  ).close();
                  await handleDelete();
                }}
              >
                {deleteLoading ? "Deleting..." : "Delete this account"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ClientAccountDangerZone;
