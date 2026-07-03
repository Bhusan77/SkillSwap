import { FC, useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSkillById, updateSkill } from "../services/skillService";
import { useAuth } from "../context/AuthContext";
import { SkillLevel } from "../types/Skill";

const EditSkill: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<SkillLevel>("Beginner");

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      if (!id) {
        setError("No skill ID provided.");
        setPageLoading(false);
        return;
      }

      try {
        const skill = await getSkillById(id);

        // Ownership check on the frontend too — even though the backend
        // enforces this on PUT, we don't want to show someone else's skill
        // in an editable form and let them submit only to get a 403.
        if (skill.owner._id !== user?._id) {
          setError("You are not authorized to edit this skill.");
          setPageLoading(false);
          return;
        }

        setTitle(skill.title);
        setDescription(skill.description);
        setCategory(skill.category);
        setLevel(skill.level);
      } catch (err) {
        console.error(err);
        setError("Failed to load skill.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchSkill();
  }, [id, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSaving(true);

    try {
      await updateSkill(id, { title, description, category, level });
      navigate("/skills");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update skill. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading skill...</p>
      </div>
    );
  }

  if (error && !title) {
    // Only block the whole page if we never managed to load the skill at all
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Skill</h1>
        <p className="text-sm text-gray-500 mb-6">
          Update your skill listing
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as SkillLevel)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2 rounded-md transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSkill;