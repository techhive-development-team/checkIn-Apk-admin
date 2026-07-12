import { useEffect, useMemo, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import pikoAnimation from "../../assets/animation video .mp4";
import pikoLogo from "../../assets/PiKo_logo.png";
import { useAuthStore } from "../../stores/authStore";
import {
  chatRepository,
  type ChatMessage,
} from "../../repositories/chatRepository";

const STARTER_PROMPTS = [
  "Who was late yesterday?",
  "Who worked overtime today?",
  "Who is on leave today?",
  "Monthly attendance summary",
];

const CHAT_HISTORY_PREFIX = "pika-chat-history";
const MAX_SAVED_MESSAGES = 40;

const welcomeMessage = (userName?: string): ChatMessage => ({
  role: "assistant",
  content: userName
    ? `PiKa Piki!!! Hi ${userName} — I'm here to help you. What would you like to know?`
    : "PiKa Piki!!! I'm here to help you. What would you like to know?",
});

const isChatHistory = (value: unknown): value is ChatMessage[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      "role" in item &&
      (item.role === "user" || item.role === "assistant") &&
      "content" in item &&
      typeof item.content === "string",
  );

const PiKaIcon = ({ className = "" }: { className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = 160;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    let frameId = 0;
    const isBackgroundPixel = (data: Uint8ClampedArray, index: number) => {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      return alpha === 0 || (red >= 242 && green >= 242 && blue >= 242);
    };

    const removeEdgeWhite = (image: ImageData) => {
      const { data, width, height } = image;
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      const push = (x: number, y: number) => {
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        const pixel = y * width + x;
        if (visited[pixel]) return;
        const index = pixel * 4;
        if (!isBackgroundPixel(data, index)) return;
        visited[pixel] = 1;
        queue.push(pixel);
      };

      for (let x = 0; x < width; x += 1) {
        push(x, 0);
        push(x, height - 1);
      }
      for (let y = 0; y < height; y += 1) {
        push(0, y);
        push(width - 1, y);
      }

      for (let i = 0; i < queue.length; i += 1) {
        const pixel = queue[i];
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        data[pixel * 4 + 3] = 0;
        push(x - 1, y);
        push(x + 1, y);
        push(x, y - 1);
        push(x, y + 1);
      }
    };

    const draw = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(video, 0, 0, size, size);
        const image = ctx.getImageData(0, 0, size, size);
        removeEdgeWhite(image);
        ctx.putImageData(image, 0, 0);
      }
      frameId = requestAnimationFrame(draw);
    };

    void video.play().catch(() => undefined);
    draw();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        src={pikoAnimation}
        poster={pikoLogo}
        className="pointer-events-none absolute h-px w-px opacity-0"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
    </>
  );
};

const ChatWidget = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userName = useAuthStore((s) => s.user?.name);
  const userId = useAuthStore((s) => s.user?.userId);
  const userEmail = useAuthStore((s) => s.user?.email);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    welcomeMessage(userName),
  ]);

  const storageKey = useMemo(() => {
    const accountKey = userId || userEmail;
    return accountKey ? `${CHAT_HISTORY_PREFIX}:${accountKey}` : null;
  }, [userEmail, userId]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyLoadedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    historyLoadedRef.current = false;
    if (!isAuthenticated || !storageKey) return;

    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setMessages([welcomeMessage(userName)]);
      historyLoadedRef.current = true;
      return;
    }

    try {
      const saved = JSON.parse(raw);
      setMessages(
        isChatHistory(saved) && saved.length > 0
          ? saved.slice(-MAX_SAVED_MESSAGES)
          : [welcomeMessage(userName)],
      );
    } catch {
      setMessages([welcomeMessage(userName)]);
    }
    historyLoadedRef.current = true;
  }, [isAuthenticated, storageKey, userName]);

  useEffect(() => {
    if (!isAuthenticated || !storageKey || !historyLoadedRef.current) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify(messages.slice(-MAX_SAVED_MESSAGES)),
    );
  }, [isAuthenticated, messages, storageKey]);

  if (!isAuthenticated) return null;

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const history = messages.filter((m) => m.role === "user" || m.role === "assistant");
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await chatRepository.sendMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (err) {
      let message = "PiKa AI is unavailable right now. Is the backend running?";
      if (err && typeof err === "object") {
        if ("message" in err && typeof (err as { message: unknown }).message === "string") {
          message = (err as { message: string }).message;
        } else if (
          "data" in err &&
          Array.isArray((err as { data: unknown }).data) &&
          (err as { data: { message?: string }[] }).data[0]?.message
        ) {
          message = (err as { data: { message: string }[] }).data[0].message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100/60 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-base-300 bg-primary/90 px-4 py-3 text-primary-content">
            <div className="flex items-center gap-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/90">
                <PiKaIcon className="h-[120%] w-[120%] object-contain" />
              </span>
              <div>
                <p className="text-sm font-semibold">PiKa AI</p>
                <p className="text-xs opacity-80">I'm your friendly male attendance assistant</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle text-primary-content"
              onClick={() => setOpen(false)}
              aria-label="Close PiKa AI chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "rounded-br-md bg-primary text-primary-content"
                      : "rounded-bl-md bg-base-200 text-base-content"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-base-200 px-3 py-2">
                  <span className="loading loading-dots loading-sm" />
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error py-2 text-xs">
                <span>{error}</span>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="badge badge-outline badge-sm cursor-pointer hover:badge-primary"
                    onClick={() => send(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            className="border-t border-base-300 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={2}
                className="textarea textarea-bordered min-h-0 flex-1 resize-none text-sm"
                placeholder="Ask PiKa AI anything about your team..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm btn-square"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {!open && (
        <button
          type="button"
          className="btn btn-primary btn-circle h-16 w-16 overflow-hidden bg-transparent p-0 opacity-100 shadow-lg transition-opacity hover:opacity-100"
          onClick={() => setOpen(true)}
          aria-label="Open PiKa AI"
        >
          <PiKaIcon className="h-[120%] w-[120%] rounded-full object-contain" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
