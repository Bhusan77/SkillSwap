import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMySessions } from "../services/sessionService";
import { Session } from "../types/session";

const VideoCall: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const all = await getMySessions();
        const found = all.find((s) => s._id === sessionId);
        if (!found) {
          setError("Session not found, or you're not part of it.");
        } else if (found.status !== "upcoming") {
          setError("This session isn't upcoming, so the call isn't active.");
        } else {
          setSession(found);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-white/70">Loading call...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4">
        <p className="text-white/70">{error}</p>
        <Link to="/my-sessions" className="text-primary text-sm font-medium">
          ← Back to My Sessions
        </Link>
      </div>
    );
  }

  // Deterministic room name shared by both participants, namespaced so it
  // doesn't collide with unrelated public Jitsi rooms.
  const roomName = `skillswap-session-${session._id}`;
  const displayName = encodeURIComponent(user?.name || "Guest");
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName=%22${displayName}%22`;

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-white font-medium">{session.skill.title}</p>
          <p className="text-white/50 text-xs">Powered by Jitsi Meet — free, no account needed</p>
        </div>
        <button
          onClick={() => navigate("/my-sessions")}
          className="text-white/70 hover:text-white text-sm font-medium border border-white/20 px-4 py-2 rounded-full transition-colors"
        >
          Leave & Return
        </button>
      </div>

      <iframe
        src={jitsiUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-1 w-full border-0"
        title="Video call"
      />
    </div>
  );
};

export default VideoCall;