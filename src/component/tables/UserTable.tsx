import { useState } from "react";
import { useGetUser } from "../../hooks/useGetUser";
import type { Company } from "./CompanyTable";
import type { Employee } from "./EmployeeTable";
import { userRepository } from "../../repositories/userRepository";
import { baseUrl } from "../../enum/urls";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

export type User = {
    userId: string;
    logo: string;
    name: string;
    email: string;
    role: string;
    status: string;
    company: Company;
    employee: Employee;
    companyId: string;
    employeeId: string;
    createdAt: string;
}

const UserTable = () => {
    const [page, setPage] = useState(1);
    const offset = (page - 1) * PAGE_SIZE;
    const {
        data: users,
        total,
        mutate,
    } = useGetUser({
        limit: PAGE_SIZE,
        offset,
    });
    const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteError(null);
        (document.getElementById("delete_modal") as HTMLDialogElement).showModal();
    };

    const closeModal = () => {
        setSelectedUser(null);
        setDeleteError(null);
        (document.getElementById("delete_modal") as HTMLDialogElement).close();
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            const response = await userRepository.deleteUser(
                selectedUser.userId,
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
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((user: User, index: number) => (
                                <tr key={user.userId}>
                                    <td>{offset + index + 1}</td>

                                    <td>
                                        {user.logo ? (
                                            <img
                                                src={getLogoUrl(user.logo)}
                                                alt={user.name}
                                                className="w-12 h-12 object-cover rounded-md border"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                                                N/A
                                            </div>
                                        )}
                                    </td>

                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role || "-"}</td>
                                    {/* <td>{company.totalEmployee || "-"}</td> */}



                                    <td>
                                        <span
                                            className={`badge ${user.status === "active"
                                                ? "badge-primary"
                                                : "badge-error"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>

                                    <td>{new Date(user.createdAt).toLocaleString()}</td>

                                    <td className="flex gap-2">
                                        <Link
                                            to={`/user/${user.userId}/edit`}
                                            className="btn btn-sm"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(user)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete
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
                        <span className="font-semibold">{selectedUser?.name}</span>?
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
    )
}

export default UserTable