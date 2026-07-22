import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMySessions, cancelSession, completeSession } from "../services/sessionService";
import { Session } from "../types/session";
import Sidebar from "../components/Sidebar";
import { resolveImageUrl } from "../utils/imageUrl";

const categoryColors: Record<string, string> = {
  "Web Development": "#2563EB",
  Design: "#7C3AED",
  Music: "#DB2777",
  Languages: "#059669",
  Cooking: "#EA580C",
  Fitness: "#16A34A",
  Photography: "#0891B2",
  Business: "#4B5563",
};
const getCategoryColor = (category: string): string =>
  categoryColors[category] || "#6D5DFC";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const relativeLabel = (iso: string) => {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
};

const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
};
const endOfWeek = () => {
  const d = startOfWeek();
  d.setDate(d.getDate() + 7);
  return d;
};

const IconVideo: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="m16 10 6-4v12l-6-4" />
  </svg>
);

const MySessions: FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const data = await getMySessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const upcoming = sessions
    .filter((s) => s.status === "upcoming")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = sessions.filter((s) => s.status !== "upcoming");
  const visible = tab === "upcoming" ? upcoming : past;

  const nextUp = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();
  const sessionsThisWeek = upcoming.filter((s) => {
    const d = new Date(s.scheduledAt);
    return d >= weekStart && d < weekEnd;
  }).length;

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm("Cancel this session?");
    if (!confirmed) return;
    try {
      setActingId(id);
      await cancelSession(id);
      await fetchSessions();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel session.");
    } finally {
      setActingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      setActingId(id);
      await completeSession(id);
      await fetchSessions();
    } catch (err) {
      console.error(err);
      alert("Failed to mark session complete.");
    } finally {
      setActingId(null);
    }
  };

  const otherPersonOf = (s: Session) =>
    s.teacher._id === user?._id ? s.student : s.teacher;
  const isTeacherOf = (s: Session) => s.teacher._id === user?._id;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted">Loading your sessions...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-ink mb-1">
              My Sessions
            </h1>
            <p className="text-muted">
              Manage your upcoming learning and teaching exchanges.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/skills"
              className="border border-ink/15 text-ink text-sm font-medium px-4 py-2.5 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Explore Skills
            </Link>
            <Link
              to="/skills"
              className="bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-primary-dark transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>

        <div className="flex gap-6 border-b border-ink/10 mb-6">
          <button
            onClick={() => setTab("upcoming")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "upcoming"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "past"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Past Sessions ({past.length})
          </button>
        </div>

        {tab === "upcoming" && upcoming.length === 0 && (
          <div className="bg-white rounded-2xl border border-ink/10 p-12 text-center">
            <p className="text-sm text-muted mb-4">No upcoming sessions yet.</p>
            <Link to="/skills" className="text-primary text-sm font-medium hover:underline">
              Browse skills to book one →
            </Link>
          </div>
        )}

        {tab === "past" && past.length === 0 && (
          <div className="bg-white rounded-2xl border border-ink/10 p-12 text-center">
            <p className="text-sm text-muted">No past sessions yet.</p>
          </div>
        )}

        {tab === "upcoming" && upcoming.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/main column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Next Up featured card */}
              {nextUp && (
                <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
                  <div
                    className="h-32 relative flex items-start p-4"
                    style={{
                      background: `linear-gradient(135deg, ${getCategoryColor(
                        nextUp.skill.category
                      )}, ${getCategoryColor(nextUp.skill.category)}dd)`,
                    }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-white px-2 py-1 rounded-full">
                      Next Up
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono uppercase tracking-wide text-primary bg-primary-soft px-2 py-1 rounded-full">
                        {nextUp.skill.category}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-xl text-ink mb-1">
                      {nextUp.skill.title}
                    </h2>
                    {nextUp.notes && (
                      <p className="text-sm text-muted mb-4">{nextUp.notes}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-ink/70 mb-4">
                      <div className="flex items-center gap-2">
                        {otherPersonOf(nextUp).profileImage ? (
                          <img
                            src={resolveImageUrl(otherPersonOf(nextUp).profileImage)}
                            alt={otherPersonOf(nextUp).name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[10px] font-semibold">
                            {otherPersonOf(nextUp).name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>
                          {isTeacherOf(nextUp) ? otherPersonOf(nextUp).name : otherPersonOf(nextUp).name}
                        </span>
                      </div>
                      <span>
                        {formatDate(nextUp.scheduledAt)} · {formatTime(nextUp.scheduledAt)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/messages/${otherPersonOf(nextUp)._id}`}
                        state={{
                          name: otherPersonOf(nextUp).name,
                          profileImage: otherPersonOf(nextUp).profileImage,
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <IconVideo /> Message to Coordinate
                      </Link>
                      <button
                        onClick={() =>
                          document
                            .getElementById(`session-${nextUp._id}`)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="border border-ink/15 text-ink text-sm font-medium px-4 rounded-lg hover:bg-ink/5 transition-colors"
                      >
                        •••
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of upcoming sessions */}
              {restUpcoming.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {restUpcoming.map((session) => {
                    const otherPerson = otherPersonOf(session);
                    const isTeacher = isTeacherOf(session);

                    return (
                      <div
                        key={session._id}
                        id={`session-${session._id}`}
                        className="bg-white rounded-2xl border border-ink/10 p-4 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {otherPerson.profileImage ? (
                              <img
                                src={resolveImageUrl(otherPerson.profileImage)}
                                alt={otherPerson.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-semibold">
                                {otherPerson.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-primary bg-primary-soft px-2 py-1 rounded-full">
                            {relativeLabel(session.scheduledAt)}
                          </span>
                        </div>

                        <h3 className="font-display font-semibold text-ink">
                          {session.skill.title}
                        </h3>
                        {session.notes && (
                          <p className="text-xs text-muted line-clamp-2">
                            {session.notes}
                          </p>
                        )}

                        <p className="text-xs text-ink/70">
                          {formatDate(session.scheduledAt)} · {formatTime(session.scheduledAt)}
                        </p>

                        <div className="flex gap-2 mt-1">
                          <Link
                            to={`/messages/${otherPerson._id}`}
                            state={{ name: otherPerson.name, profileImage: otherPerson.profileImage }}
                            className="flex-1 text-center text-xs font-medium text-primary border border-primary rounded-md py-1.5 hover:bg-primary-soft transition-colors"
                          >
                            Message
                          </Link>
                          {isTeacher && (
                            <button
                              onClick={() => handleComplete(session._id)}
                              disabled={actingId === session._id}
                              className="flex-1 text-xs font-medium text-green-700 border border-green-600 rounded-md py-1.5 hover:bg-green-50 transition-colors disabled:opacity-50"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(session._id)}
                            disabled={actingId === session._id}
                            className="flex-1 text-xs font-medium text-red-600 border border-red-600 rounded-md py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {actingId === session._id ? "..." : "Cancel"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-primary rounded-2xl p-5 text-white">
                <p className="text-sm text-white/80 mb-1">This Week</p>
                <p className="font-display font-bold text-3xl">{sessionsThisWeek}</p>
                <p className="text-xs text-white/70 mt-1">
                  session{sessionsThisWeek === 1 ? "" : "s"} scheduled this week
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-ink/10 p-5">
                <h3 className="font-semibold text-sm text-ink mb-4">
                  Upcoming Schedule
                </h3>
                {upcoming.length === 0 ? (
                  <p className="text-xs text-muted">Nothing scheduled yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {upcoming.slice(0, 4).map((s) => (
                      <div key={s._id} className="flex items-start gap-3">
                        <div className="text-center bg-primary-soft rounded-lg px-2 py-1 shrink-0">
                          <p className="text-[9px] font-semibold text-primary uppercase">
                            {new Date(s.scheduledAt).toLocaleDateString(undefined, { month: "short" })}
                          </p>
                          <p className="text-sm font-bold text-primary leading-none">
                            {new Date(s.scheduledAt).getDate()}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">
                            {s.skill.title}
                          </p>
                          <p className="text-xs text-muted truncate">
                            with {otherPersonOf(s).name} · {formatTime(s.scheduledAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "past" && past.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {past.map((session) => {
              const otherPerson = otherPersonOf(session);
              return (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl border border-ink/10 p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wide text-primary bg-primary-soft px-2 py-1 rounded-full">
                      {session.skill.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        session.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-ink">
                    {session.skill.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-ink/70">
                    {otherPerson.profileImage ? (
                      <img
                        src={resolveImageUrl(otherPerson.profileImage)}
                        alt={otherPerson.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[10px] font-semibold">
                        {otherPerson.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>
                      {isTeacherOf(session) ? "Taught" : "Learned from"} {otherPerson.name}
                    </span>
                  </div>
                  <div className="text-sm text-ink/70">
                    {formatDate(session.scheduledAt)} · {formatTime(session.scheduledAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MySessions;