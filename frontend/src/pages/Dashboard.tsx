import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSkills } from "../services/skillService";
import Sidebar from "../components/Sidebar";
import { Skill } from "../types/Skill";

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

const Dashboard: FC = () => {
  const { user } = useAuth();
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [suggested, setSuggested] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getSkills();
        setMySkills(all.filter((s) => s.owner._id === user?._id));
        setSuggested(
          all.filter((s) => s.owner._id !== user?._id).slice(0, 4)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Real profile completion — based on fields actually filled in
  const completionFields = [
    !!user?.bio,
    !!user?.location,
    !!user?.profileImage,
    (user?.skillsOffered?.length ?? 0) > 0,
    (user?.skillsWanted?.length ?? 0) > 0,
  ];
  const completion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  const primaryListing = mySkills[0];

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-ink">
              Namaste, {user?.name}!
            </h1>
            <p className="text-muted mt-1">
              Ready to trade some knowledge today?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left + center column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-ink/10 p-6">
                <div className="w-9 h-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center mb-4">
                  📅
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">
                  {mySkills.length} Skill{mySkills.length === 1 ? "" : "s"} Listed
                </h3>
                <p className="text-sm text-muted mb-3">
                  Skills you're currently offering to teach
                </p>
                <Link
                  to="/my-skills"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View My Skills →
                </Link>
              </div>

             <div className="bg-white rounded-2xl border border-ink/10 p-6">
                <div className="w-9 h-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center mb-4">
                  💬
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">
                  Messages
                </h3>
                <p className="text-sm text-muted mb-3">
                  Chat isn't built yet — coming in a later phase
                </p>
                <Link
                  to="/messages"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View Messages →
                </Link>
              </div>
            </div>

            {/* Your Teaching */}
            <div className="bg-white rounded-2xl border border-ink/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">
                    Your Teaching
                  </h3>
                  <p className="text-sm text-muted">
                    {primaryListing
                      ? `Listing: ${primaryListing.title}`
                      : "You haven't listed a skill yet"}
                  </p>
                </div>
                <Link
                  to="/my-skills"
                  className="border border-primary text-primary text-sm font-medium px-4 py-2 rounded-full hover:bg-primary-soft transition-colors"
                >
                  Manage Listings
                </Link>
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-ink/70">Profile Completion</span>
                <span className="font-semibold text-ink">{completion}%</span>
              </div>
              <div className="w-full h-2 bg-primary-soft rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-display font-bold text-xl text-primary">
                    {mySkills.length}
                  </p>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Skills Listed
                  </p>
                </div>
                <div>
                  <p className="font-display font-bold text-xl text-primary">
                    {new Set(mySkills.map((s) => s.category)).size}
                  </p>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Categories
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested for you */}
            <div>
              <h2 className="font-display font-semibold text-xl text-ink mb-4">
                Suggested for you
              </h2>
              {loading ? (
                <p className="text-sm text-muted">Loading suggestions...</p>
              ) : suggested.length === 0 ? (
                <p className="text-sm text-muted">
                  No other skills available yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {suggested.map((skill) => (
                    <Link
                      key={skill._id}
                      to={`/skills`}
                      className="rounded-xl overflow-hidden border border-ink/10 hover:shadow-md transition-shadow bg-white"
                    >
                      <div
                        className="h-24 flex items-end p-3"
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
                      <div className="p-3">
                        <p className="text-sm font-medium text-ink truncate">
                          {skill.title}
                        </p>
                        <p className="text-xs text-muted truncate">
                          By {skill.owner.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — Recent Chats (placeholder) */}
          <div className="bg-white rounded-2xl border border-ink/10 p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">
                Recent Chats
              </h3>
            </div>
            <div className="text-center py-10">
              <p className="text-sm text-muted mb-1">No chats yet</p>
              <p className="text-xs text-muted/70">
                Messaging is coming in a later phase
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;