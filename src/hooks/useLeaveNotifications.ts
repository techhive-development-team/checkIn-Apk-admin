import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { API_URLS } from "../enum/urls";
import { leaveRequestRepository } from "../repositories/leaveRepository";
import type { LeaveRequest } from "../component/tables/LeaveRequestTable";
import { useAuthStore } from "../stores/authStore";

const RECENT_LIMIT = 10;
const APPROVER_REFRESH_MS = 15_000;
const SUBMITTER_REFRESH_MS = 30_000;

const isNotificationKey = (key: unknown) =>
  Array.isArray(key) && key[0] === API_URLS.LEAVE && key[1] === "notifications";

export const refreshLeaveNotifications = () => mutate(isNotificationKey);

export type NotificationMode = "PENDING" | "DECISION";

export type LeaveNotification = LeaveRequest & { unseen?: boolean };

const seenStorageKey = (userId?: string) =>
  `leave-notif-seen:${userId ?? "anon"}`;

const decisionKey = (leave: LeaveRequest) => `${leave.id}:${leave.status}`;

const readSeen = (userId?: string): string[] => {
  try {
    const raw = localStorage.getItem(seenStorageKey(userId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const writeSeen = (userId: string | undefined, keys: string[]) => {
  try {
    localStorage.setItem(seenStorageKey(userId), JSON.stringify(keys));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
};

export const useLeaveNotifications = () => {
  const role = useAuthStore((state) => state.user?.role);
  const userId = useAuthStore((state) => state.user?.userId);

  const isApprover = role === "ADMIN" || role === "CLIENT";
  const mode: NotificationMode = isApprover ? "PENDING" : "DECISION";

  const { data, error, isLoading, mutate } = useSWR(
    [API_URLS.LEAVE, "notifications", mode, userId],
    () =>
      leaveRequestRepository.getAll(
        isApprover
          ? { status: "PENDING", limit: 5, offset: 0 }
          : { limit: RECENT_LIMIT, offset: 0 },
      ),
    {
      refreshInterval: isApprover ? APPROVER_REFRESH_MS : SUBMITTER_REFRESH_MS,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  const rawItems: LeaveRequest[] = data?.data?.data ?? [];

  const [seen, setSeen] = useState<string[]>(() => readSeen(userId));

  useEffect(() => {
    setSeen(readSeen(userId));
  }, [userId]);

  const decidedItems = useMemo(
    () =>
      rawItems.filter(
        (leave) => leave.status === "APPROVED" || leave.status === "DENIED",
      ),
    [rawItems],
  );

  const items: LeaveNotification[] = useMemo(() => {
    if (isApprover) return rawItems;
    return decidedItems.map((leave) => ({
      ...leave,
      unseen: !seen.includes(decisionKey(leave)),
    }));
  }, [isApprover, rawItems, decidedItems, seen]);

  const count = isApprover
    ? (data?.data?.meta?.total ?? 0)
    : items.filter((leave) => leave.unseen).length;

  const markAllSeen = useCallback(() => {
    if (isApprover) return;
    const keys = decidedItems.map(decisionKey);
    setSeen((prev) => {
      const merged = Array.from(new Set([...prev, ...keys]));
      writeSeen(userId, merged);
      return merged;
    });
  }, [isApprover, decidedItems, userId]);

  return {
    mode,
    items,
    count,
    error,
    isLoading,
    mutate,
    markAllSeen,
  };
};
