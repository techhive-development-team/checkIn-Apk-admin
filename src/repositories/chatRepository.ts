import { API_URLS } from "../enum/urls";
import { client } from "./client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const getBrowserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Yangon";

const sendMessage = async (message: string, history: ChatMessage[] = []) => {
  const response = await client.exec(API_URLS.CHAT, {
    method: "post",
    body: JSON.stringify({
      message,
      history,
      timezone: getBrowserTimezone(),
    }),
  });
  return response as {
    data: { reply: string; model: string };
    message: string;
    success: boolean;
  };
};

export const chatRepository = { sendMessage };
