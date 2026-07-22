import { FC, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getSkills } from "../services/skillService";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { resolveImageUrl } from "../utils/imageUrl";
import { Skill, SkillLevel } from "../types/Skill";

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

const levels: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];

const IconSearch: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BrowseSkills: FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Skills");
  const [activeLevels, setActiveLevels] = useState<SkillLevel[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load skills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category)));
    return ["All Skills", ...unique];
  }, [skills]);

  const toggleLevel = (level: SkillLevel) => {
    setActiveLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setActiveCategory("All Skills");
    setActiveLevels([]);
    setSearch("");
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      activeCategory === "All Skills" || skill.category === activeCategory;
    const matchesLevel =
      activeLevels.length === 0 || activeLevels.includes(skill.level);
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      skill.title.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query) ||
      skill.owner.name.toLowerCase().includes(query);
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const filtersActive =
    activeCategory !== "All Skills" || activeLevels.length > 0 || search !== "";

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-3xl text-ink">
            Explore Skills
          </h1>
          <div className="relative w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <IconSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for skills, instructors, or topics..."
              className="w-full bg-white border border-ink/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-white border border-ink/10 text-ink/70 hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <aside className="bg-white rounded-2xl border border-ink/10 p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-ink">Filters</h3>
              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3">
                Skill Level
              </p>
              <div className="flex flex-col gap-2">
                {levels.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 text-sm text-ink/80 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="rounded border-ink/30 text-primary focus:ring-primary"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <p className="text-sm text-muted">Loading skills...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : filteredSkills.length === 0 ? (
              <p className="text-sm text-muted">
                No skills match your filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => {
                  const isOwnSkill = user?._id === skill.owner._id;
                  return (
                    <div
                      key={skill._id}
                      className="bg-white rounded-2xl border border-ink/10 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div
                        className="h-28 flex items-end p-3"
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

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-semibold text-ink">
                            {skill.title}
                          </h3>
                          <span className="text-[10px] font-medium text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-sm text-muted mb-4 line-clamp-2 flex-1">
                          {skill.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-ink/10">
                          <div className="flex items-center gap-2 min-w-0">
                            {skill.owner.profileImage ? (
                              <img
                                src={resolveImageUrl(skill.owner.profileImage)}
                                alt={skill.owner.name}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                                {skill.owner.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-xs text-ink/70 truncate">
                              {isOwnSkill ? "You" : skill.owner.name}
                            </span>
                          </div>

                          {!isOwnSkill && (
                            <div className="flex gap-2 shrink-0">
                              <Link
                                to={`/book-session/${skill._id}`}
                                className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors"
                              >
                                Book
                              </Link>
                              <Link
                                to={`/messages/${skill.owner._id}`}
                                state={{
                                  name: skill.owner.name,
                                  profileImage: skill.owner.profileImage,
                                }}
                                className="text-xs font-semibold text-primary bg-primary-soft px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                              >
                                Message
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseSkills;