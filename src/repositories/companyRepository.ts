import { API_URLS } from "../enum/urls";
import { client } from "./client";

const getAll = async (params?: { limit?: number; offset?: number }) => {
  const query = new URLSearchParams(params as any).toString();

  const response = await client.exec(
    `${API_URLS.COMPANY}?${query}`,
    {
      method: "get",
    }
  );

  return response;
};

const createCompany = async (data: any) => {
  const response = await client.exec(
    API_URLS.COMPANY,
    {
      method: "post",
      body: JSON.stringify(data),
    }
  );

  return response;
};

const getCompanyById = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}`,
    {
      method: "get",
    }
  );

  return response;
};

const updateCompany = async (id: string, data: any) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

  return response;
};

const deleteCompany = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}`,
    {
      method: "delete",
    }
  );

  return response;
};

const downgradePlan = async (
  id: string,
  data: { plan: string; subScribeStatus?: string; removeEmployeeIds: string[] },
) => {
  const response = await client.exec(`${API_URLS.COMPANY}/${id}/downgrade`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

const exportMembers = async (id: string, employeeIds: string[]) => {
  const blob = await client.exec(`${API_URLS.COMPANY}/${id}/members/export`, {
    method: "POST",
    body: JSON.stringify({ employeeIds }),
  });

  if (!(blob instanceof Blob)) {
    throw new Error("Response was not a file");
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "removed-members.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const resetPassword = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}/password-reset`,
    { method: "PATCH"}
  )
  return response;
}

const deactivateAccount = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}/deactivate`,
    { method: "PATCH" },
  );
  return response;
};

const reactivateAccount = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}/reactivate`,
    { method: "PATCH" },
  );
  return response;
};

const deleteOwnAccount = async (id: string, confirmationName: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}/account`,
    {
      method: "DELETE",
      body: JSON.stringify({ confirmationName }),
    },
  );
  return response;
};

const sendRecoveryEmailVerification = async (id: string) => {
  const response = await client.exec(
    `${API_URLS.COMPANY}/${id}/recovery-email/send-verification`,
    { method: "POST" },
  );
  return response;
};

const verifyRecoveryEmailToken = async (token: string) => {
  const response = await client.exec(API_URLS.RECOVERY_EMAIL_VERIFY, {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      Authorization: "",
    },
  });
  return response;
};

export const companyRepository = {
  getAll,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  downgradePlan,
  exportMembers,
  resetPassword,
  deactivateAccount,
  reactivateAccount,
  deleteOwnAccount,
  sendRecoveryEmailVerification,
  verifyRecoveryEmailToken,
};
