import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSkills, deleteSkill } from "../services/skillService";
import { useAuth } from "../context/AuthContext";
import { Skill } from "../types/Skill";

const MySkills: FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMySkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const allSkills = await getSkills();
        const mine = allSkills.filter((s) => s.owner._id === user?._id);
        setSkills(mine);
      } catch (err) {
        console.error(err);
        setError("Failed to load your skills.");
      } finally {
        setLoading(false);
      }
    };

    fetchMySkills();
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your skills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
        <Link
          to="/skills/add"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + Add Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-500">
          You haven't added any skills yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="border rounded-lg shadow-sm p-4 flex flex-col gap-3 bg-white"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {skill.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {skill.description}
              </p>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {skill.category} • {skill.level}
              </span>

              <div className="flex gap-2 pt-2 border-t">
                <Link
                  to={`/skills/edit/${skill._id}`}
                  className="flex-1 text-center text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md py-1.5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(skill._id)}
                  disabled={deletingId === skill._id}
                  className="flex-1 text-center text-sm font-medium text-red-600 hover:text-red-800 border border-red-600 rounded-md py-1.5 disabled:opacity-50"
                >
                  {deletingId === skill._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySkills;