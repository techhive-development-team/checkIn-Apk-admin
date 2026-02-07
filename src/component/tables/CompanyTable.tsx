import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCompany } from "../../hooks/useGetCompany";
import { companyRepository } from "../../repositories/companyRepository";
import { baseUrl } from "../../enum/urls";

const PAGE_SIZE = 10;

export type Company = {
  companyId: string;
  name: string;
  email: string;
  logo?: string;
  companyType?: string;
  address?: string;
  phone?: string;
  // totalEmployee?: string;
  status: string;
  subScribeStatus: string;
  createdAt: string;
};

const CompanyTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * PAGE_SIZE;

  const {
    data: companies,
    total,
    mutate,
  } = useGetCompany({
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setDeleteError(null);
    (document.getElementById("delete_modal") as HTMLDialogElement).close();
  };

  const confirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      const response = await companyRepository.deleteCompany(
        selectedCompany.companyId,
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
  const getLogoUrl = (logo?: string) => {
    if (!logo) return undefined;
    return `${baseUrl.replace(/\/$/, "")}/${logo.replace(/^\//, "")}`;
  };

  const handleResetPassword = async (companyId: string) => {
    try {
      const response = await companyRepository.resetPassword(companyId);

      const modal = document.getElementById(
        "password_reset_modal",
      ) as HTMLDialogElement;
      const title = document.getElementById(
        "modal_title",
      ) as HTMLHeadingElement;
      const message = document.getElementById(
        "modal_message",
      ) as HTMLParagraphElement;

      if (response?.success) {
        title.textContent = "✅ Success";
        message.textContent =
          response.message || "Password reset successfully. Check your email.";
      } else {
        title.textContent = "⚠️ Failed";
        message.textContent = response?.message || "Something went wrong";
      }

      modal.showModal();
    } catch (err: any) {
      const modal = document.getElementById(
        "password_reset_modal",
      ) as HTMLDialogElement;
      const title = document.getElementById(
        "modal_title",
      ) as HTMLHeadingElement;
      const message = document.getElementById(
        "modal_message",
      ) as HTMLParagraphElement;

      title.textContent = "⚠️ Failed";
      message.textContent = err?.message || "Failed to reset password";
      modal.showModal();
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Phone</th>
              {/* <th>Total Employee</th> */}
              <th>Subscription</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {companies && companies.length > 0 ? (
              companies.map((company: Company, index: number) => (
                <tr key={company.companyId}>
                  <td>{offset + index + 1}</td>

                  <td>
                    {company.logo ? (
                      <img
                        src={getLogoUrl(company.logo)}
                        alt={company.name}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                  </td>

                  <td>{company.name}</td>
                  <td>{company.email}</td>
                  <td>{company.companyType || "-"}</td>
                  <td>{company.phone || "-"}</td>
                  {/* <td>{company.totalEmployee || "-"}</td> */}

                  <td>
                    <span
                      className={`badge ${
                        company.subScribeStatus === "Active"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {company.subScribeStatus}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        company.status === "active"
                          ? "badge-primary"
                          : "badge-error"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>

                  <td>{new Date(company.createdAt).toLocaleString()}</td>

                  <td className="flex gap-2">
                    <Link
                      to={`/company/${company.companyId}/edit`}
                      className="btn btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(company)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleResetPassword(company.companyId)}
                      className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  No companies found
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
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedCompany?.name}</span>?
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
      <dialog id="password_reset_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg" id="modal_title">
            Message
          </h3>

          <p className="py-4" id="modal_message">
            This is a message
          </p>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() =>
                (
                  document.getElementById(
                    "password_reset_modal",
                  ) as HTMLDialogElement
                ).close()
              }
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CompanyTable;
