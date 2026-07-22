import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/userService";
import { getMySessions } from "../services/sessionService";
import Sidebar from "../components/Sidebar";
import { resolveImageUrl } from "../utils/imageUrl";
import { User } from "../types/User";

const formatMemberSince = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long" });

const Profile: FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [sessionsTaught, setSessionsTaught] = useState(0);
  const [sessionsLearned, setSessionsLearned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, sessions] = await Promise.all([
          getCurrentUser(),
          getMySessions(),
        ]);
        setProfile(profileData);

        const taught = sessions.filter(
          (s) => s.teacher._id === profileData._id && s.status === "completed"
        ).length;
        const learned = sessions.filter(
          (s) => s.student._id === profileData._id && s.status === "completed"
        ).length;
        setSessionsTaught(taught);
        setSessionsLearned(learned);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const completionFields = profile
    ? [
        !!profile.bio,
        !!profile.location,
        !!profile.profileImage,
        (profile.skillsOffered?.length ?? 0) > 0,
        (profile.skillsWanted?.length ?? 0) > 0,
      ]
    : [];
  const completion = completionFields.length
    ? Math.round(
        (completionFields.filter(Boolean).length / completionFields.length) * 100
      )
    : 0;

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8 max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-ink/10 p-6 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {profile.profileImage ? (
              <img
                src={resolveImageUrl(profile.profileImage)}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xl font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-display font-bold text-2xl text-ink">
                {profile.name}
              </h1>
              {profile.location && (
                <p className="text-sm text-muted">{profile.location}</p>
              )}
              <p className="text-xs text-muted mt-1">
                Member since {formatMemberSince(profile.createdAt)}
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            className="border border-primary text-primary text-sm font-medium px-4 py-2 rounded-full hover:bg-primary-soft transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display font-semibold text-lg text-ink mb-3">
                About Me
              </h2>
              <p className="text-sm text-ink/70">
                {profile.bio || "No bio added yet."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary rounded-2xl p-6 text-white text-center">
                <p className="font-display font-bold text-3xl">{sessionsTaught}</p>
                <p className="text-xs uppercase tracking-wide text-white/80 mt-1">
                  Sessions Taught
                </p>
              </div>
              <div className="bg-primary-soft rounded-2xl p-6 text-primary text-center">
                <p className="font-display font-bold text-3xl">{sessionsLearned}</p>
                <p className="text-xs uppercase tracking-wide mt-1">
                  Sessions Learned
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display font-semibold text-lg text-ink mb-4">
                Account Settings
              </h2>
              <Link
                to="/settings"
                className="flex items-center justify-between py-2 text-sm text-ink/80 hover:text-primary transition-colors"
              >
                Edit name, bio, location, and skills
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-ink/10 p-6">
              <h3 className="font-display font-semibold text-ink mb-3">
                I'm Teaching
              </h3>
              {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium text-primary bg-primary-soft px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  No skills added yet.{" "}
                  <Link to="/settings" className="text-primary hover:underline">
                    Add some
                  </Link>
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-ink/10 p-6">
              <h3 className="font-display font-semibold text-ink mb-3">
                I'm Learning
              </h3>
              {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium text-ink/70 bg-ink/5 px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  No skills added yet.{" "}
                  <Link to="/settings" className="text-primary hover:underline">
                    Add some
                  </Link>
                </p>
              )}
            </div>

            <div className="bg-ink rounded-2xl p-6 text-white">
              <h3 className="font-display font-semibold mb-1">
                Profile Completion
              </h3>
              <p className="text-sm text-white/70 mb-4">
                {completion === 100
                  ? "Your profile is fully set up."
                  : "Complete your profile to get better matches."}
              </p>
              <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="text-xs text-white/70 mb-3">{completion}% complete</p>
              <Link
                to="/settings"
                className="bg-white text-ink text-sm font-medium px-4 py-2 rounded-full inline-block hover:bg-white/90 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;