import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSkillById } from "../services/skillService";
import { createSession } from "../services/sessionService";
import Sidebar from "../components/Sidebar";
import { resolveImageUrl } from "../utils/imageUrl";
import { Skill } from "../types/Skill";

const TIME_SLOTS = [
  "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00",
];

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

const IconChevronLeft: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCalendar: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconTopic: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const monthName = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isPastDay = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const BookSession: FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      if (!skillId) return;
      try {
        const data = await getSkillById(skillId);
        setSkill(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this skill listing.");
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [skillId]);

  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0
  ).getDate();
  const firstWeekday = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
    1
  ).getDay();

  const changeMonth = (delta: number) => {
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() + delta);
    setViewMonth(next);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!skill || !selectedDay || !selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDay);
    scheduledAt.setHours(hours, minutes, 0, 0);

    setBooking(true);
    setBookingError(null);

    try {
      await createSession({
        skillId: skill._id,
        scheduledAt: scheduledAt.toISOString(),
        notes,
      });
      navigate("/my-sessions");
    } catch (err: any) {
      setBookingError(
        err?.response?.data?.message || "Failed to book session. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted">Loading...</p>
        </main>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error || "Skill not found."}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted mb-1">
              <Link to="/my-sessions" className="hover:text-primary">My Sessions</Link>
              {" › "}Book a Session
            </p>
            <h1 className="font-display font-bold text-2xl text-ink">
              Book a Session with {skill.owner.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white border border-ink/10 rounded-full pl-2 pr-4 py-1.5">
            {skill.owner.profileImage ? (
              <img
                src={resolveImageUrl(skill.owner.profileImage)}
                alt={skill.owner.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-semibold">
                {skill.owner.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-ink">{skill.owner.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar + time slots */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-ink/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-ink">
                {monthName(viewMonth)}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink/5 transition-colors"
                >
                  <IconChevronLeft />
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink/5 transition-colors"
                >
                  <IconChevronRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted mb-2">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = new Date(
                  viewMonth.getFullYear(),
                  viewMonth.getMonth(),
                  i + 1
                );
                const disabled = isPastDay(day);
                const selected = selectedDay && isSameDay(day, selectedDay);

                return (
                  <button
                    key={i}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedTime(null);
                    }}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      disabled
                        ? "text-ink/20 cursor-not-allowed"
                        : selected
                        ? "bg-primary text-white"
                        : "text-ink hover:bg-primary-soft"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {selectedDay && (
              <div className="mt-6">
                <p className="text-sm font-medium text-ink mb-3">
                  Choose a time for{" "}
                  {selectedDay.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                        selectedTime === time
                          ? "bg-primary text-white border-primary"
                          : "border-ink/15 text-ink hover:border-primary"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3">
                  These are suggested times — confirm the exact time works via Message
                  before your session.
                </p>
              </div>
            )}
          </div>

          {/* Booking summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
              <div
                className="h-20 flex items-end p-3"
                style={{
                  background: `linear-gradient(135deg, ${getCategoryColor(
                    skill.category
                  )}, ${getCategoryColor(skill.category)}dd)`,
                }}
              >
                <span className="text-[10px] font-mono uppercase tracking-wide text-white bg-black/20 px-2 py-0.5 rounded-full">
                  {skill.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-ink mb-1">
                  {skill.title}
                </h3>
                <p className="text-xs text-muted">{skill.level}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-ink/10 p-5">
              <h3 className="font-semibold text-sm text-ink mb-4">
                Booking Summary
              </h3>

              <div className="flex gap-3 mb-4">
                <span className="text-primary mt-0.5">
                  <IconCalendar />
                </span>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Date &amp; Time
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {selectedDay
                      ? selectedDay.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : "Not selected"}
                    {selectedTime ? ` · ${selectedTime}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-primary mt-0.5">
                  <IconTopic />
                </span>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Topic
                  </p>
                  <p className="text-sm font-medium text-ink">{skill.title}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-ink/10 p-5">
              <label className="block text-sm font-medium text-ink mb-2">
                Anything you want to focus on?
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. I want help with..."
                className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            {bookingError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {bookingError}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!selectedDay || !selectedTime || booking}
              className="bg-primary text-white font-semibold py-3 rounded-full hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {booking ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookSession;