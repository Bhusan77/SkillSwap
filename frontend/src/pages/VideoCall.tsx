import { FC, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMySessions } from "../services/sessionService";
import { logCall } from "../services/messageService";
import { Session } from "../types/session";
import { resolveImageUrl } from "../utils/imageUrl";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const VideoCall: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const joinedAtRef = useRef<number | null>(null);
  const loggedRef = useRef(false);

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

  const getOtherPersonId = () => {
    if (!session || !user) return null;
    return session.teacher._id === user._id ? session.student._id : session.teacher._id;
  };

  const logAndLeave = async () => {
    if (loggedRef.current) {
      navigate("/my-sessions");
      return;
    }
    loggedRef.current = true;

    const otherPersonId = getOtherPersonId();
    const durationSeconds = joinedAtRef.current
      ? Math.round((Date.now() - joinedAtRef.current) / 1000)
      : 0;

    if (otherPersonId) {
      try {
        await logCall({ receiverId: otherPersonId, callType: "video", durationSeconds });
      } catch (err) {
        console.error("Failed to log call", err);
      }
    }

    navigate("/my-sessions");
  };

  useEffect(() => {
    if (!session || !user || !containerRef.current || !window.JitsiMeetExternalAPI) return;

    const roomName = `skillswap-session-${session._id}`;
    const avatarUrl = user.profileImage ? resolveImageUrl(user.profileImage) : undefined;

    const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
      roomName,
      parentNode: containerRef.current,
      width: "100%",
      height: "100%",
      userInfo: {
        displayName: user.name,
        avatarURL: avatarUrl,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
      },
    });

    apiRef.current = api;

    api.addListener("videoConferenceJoined", () => {
      joinedAtRef.current = Date.now();
    });

    api.addListener("readyToClose", () => {
      logAndLeave();
    });

    return () => {
      api.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, user]);

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

  return (
    <div className="min-h-screen bg-ink relative">
      <button
        onClick={logAndLeave}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-sm font-medium border border-white/20 bg-black/40 backdrop-blur px-4 py-2 rounded-full transition-colors"
      >
        Leave & Return
      </button>

      <div ref={containerRef} className="w-full h-screen" />
    </div>
  );
};

export default VideoCall;