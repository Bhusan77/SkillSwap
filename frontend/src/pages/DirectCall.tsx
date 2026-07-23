import { FC, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buildDirectCallRoom } from "../utils/callRoom";
import { resolveImageUrl } from "../utils/imageUrl";
import { logCall } from "../services/messageService";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const DirectCall: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const joinedAtRef = useRef<number | null>(null);
  const loggedRef = useRef(false);

  const mode = searchParams.get("mode") === "audio" ? "audio" : "video";

  const logAndLeave = async () => {
    if (loggedRef.current || !userId) {
      navigate(`/messages/${userId}`);
      return;
    }
    loggedRef.current = true;

    const durationSeconds = joinedAtRef.current
      ? Math.round((Date.now() - joinedAtRef.current) / 1000)
      : 0;

    try {
      await logCall({ receiverId: userId, callType: mode, durationSeconds });
    } catch (err) {
      console.error("Failed to log call", err);
    }

    navigate(`/messages/${userId}`);
  };

  useEffect(() => {
    if (!user || !userId || !containerRef.current || !window.JitsiMeetExternalAPI) return;

    const roomName = buildDirectCallRoom(user._id, userId);
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
        startWithVideoMuted: mode === "audio",
      },
    });

    apiRef.current = api;

    api.addListener("videoConferenceJoined", () => {
      joinedAtRef.current = Date.now();
    });

    // Fires when the in-call hang-up button is used
    api.addListener("readyToClose", () => {
      logAndLeave();
    });

    return () => {
      api.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userId, mode]);

  if (!userId || !user) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4">
        <p className="text-white/70">Something went wrong starting this call.</p>
        <Link to="/messages" className="text-primary text-sm font-medium">
          ← Back to Messages
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
        Leave & Return to Chat
      </button>

      <div ref={containerRef} className="w-full h-screen" />
    </div>
  );
};

export default DirectCall;