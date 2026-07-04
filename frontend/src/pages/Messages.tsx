import { FC, useState, useEffect, useRef, FormEvent } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  getConversations,
  getConversation,
  sendMessage,
} from "../services/messageService";
import { ConversationSummary, Message } from "../types/Message";

const IconSearch: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconSend: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
  </svg>
);
const IconMailLarge: FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 6 10 7 10-7" />
  </svg>
);

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Messages: FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const navState = location.state as
    | { name?: string; profileImage?: string }
    | undefined;

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversation list, and poll it every 5s so unread counts / new chats stay fresh
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setConversationsLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch active thread, and poll it every 3s while a conversation is open
  useEffect(() => {
    if (!userId) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const fetchThread = async () => {
      try {
        const data = await getConversation(userId);
        if (!cancelled) setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    };

    setMessagesLoading(true);
    fetchThread();
    const interval = setInterval(fetchThread, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !draft.trim()) return;

    setSending(true);
    try {
      const res = await sendMessage({ receiverId: userId, content: draft.trim() });
      setMessages((prev) => [...prev, res.data]);
      setDraft("");
      // Refresh conversation list so the new/updated chat shows up immediately
      const updated = await getConversations();
      setConversations(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Figure out the active chat partner's name/photo — from nav state (new chat),
  // conversation list (existing chat), or the loaded messages themselves.
  const activeFromList = conversations.find((c) => c.user._id === userId);
  const activeFromMessages = messages[0]
    ? messages[0].sender._id === userId
      ? messages[0].sender
      : messages[0].receiver
    : null;

  const activeName =
    navState?.name || activeFromList?.user.name || activeFromMessages?.name || "Chat";
  const activeImage =
    navState?.profileImage ||
    activeFromList?.user.profileImage ||
    activeFromMessages?.profileImage;

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      {/* Conversation list column */}
      <div className="w-80 border-r border-ink/10 bg-white flex flex-col">
        <div className="p-6 pb-4">
          <h1 className="font-display font-bold text-2xl text-ink mb-4">
            Messages
          </h1>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <IconSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-ink/[0.04] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <p className="text-sm text-muted text-center mt-8">Loading...</p>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-4">
                <IconMailLarge />
              </div>
              <p className="text-sm font-medium text-ink mb-1">
                No conversations yet
              </p>
              <p className="text-xs text-muted">
                Message someone from a skill listing to start chatting.
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <Link
                key={c.user._id}
                to={`/messages/${c.user._id}`}
                state={{ name: c.user.name, profileImage: c.user.profileImage }}
                className={`flex items-center gap-3 px-6 py-4 border-b border-ink/5 hover:bg-ink/[0.02] transition-colors ${
                  userId === c.user._id ? "bg-primary-soft" : ""
                }`}
              >
                {c.user.profileImage ? (
                  <img
                    src={c.user.profileImage}
                    alt={c.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold text-sm">
                    {c.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink truncate">
                      {c.user.name}
                    </span>
                    <span className="text-xs text-muted whitespace-nowrap ml-2">
                      {formatTime(c.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate">
                    {c.lastMessage.senderIsMe ? "You: " : ""}
                    {c.lastMessage.content}
                  </p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                    {c.unreadCount}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Chat panel */}
      {!userId ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-bg text-center p-8">
          <div className="w-20 h-20 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-6">
            <IconMailLarge />
          </div>
          <h2 className="font-display font-semibold text-xl text-ink mb-2">
            Select a conversation
          </h2>
          <p className="text-muted max-w-sm mb-8">
            Choose a chat from the list, or message someone from a skill
            listing to start a new conversation.
          </p>
          <Link
            to="/skills"
            className="bg-primary text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            Browse Skills
          </Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-bg">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-ink/10 bg-white">
            {activeImage ? (
              <img
                src={activeImage}
                alt={activeName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold text-sm">
                {activeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-ink">{activeName}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
            {messagesLoading ? (
              <p className="text-sm text-muted text-center">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted">
                  No messages yet — say hello to start the conversation.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender._id === currentUser?._id;
                return (
                  <div
                    key={msg._id}
                    className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                      isMine
                        ? "bg-primary text-white self-end rounded-br-sm"
                        : "bg-white border border-ink/10 text-ink self-start rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={`text-[10px] block mt-1 ${
                        isMine ? "text-white/70" : "text-muted"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 px-6 py-4 border-t border-ink/10 bg-white"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-ink/[0.04] border border-transparent rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              <IconSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;