import { FC, useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, updateProfile } from "../services/userService";
import Sidebar from "../components/Sidebar";
import { NEPAL_CITIES } from "../constants/locations";


const Settings: FC = () => {
  const { loginUser } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [locationChoice, setLocationChoice] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [offeredInput, setOfferedInput] = useState("");
  const [wantedInput, setWantedInput] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentUser();
        setName(data.name);
        setBio(data.bio || "");
        if (data.location && NEPAL_CITIES.includes(data.location)) {
          setLocationChoice(data.location);
        } else if (data.location) {
          setLocationChoice("Other");
          setCustomLocation(data.location);
        }
        setProfileImage(data.profileImage || "");
        setSkillsOffered(data.skillsOffered || []);
        setSkillsWanted(data.skillsWanted || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your profile.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const addTag = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    clearInput: () => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    clearInput();
  };

  const removeTag = (
    tag: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    clearInput: () => void
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value, list, setList, clearInput);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const finalLocation =
      locationChoice === "Other" ? customLocation.trim() : locationChoice;

    try {
      const data = await updateProfile({
        name,
        bio,
        location: finalLocation,
        profileImage,
        skillsOffered,
        skillsWanted,
      });

      // Keep AuthContext / localStorage in sync so Sidebar, Dashboard, etc.
      // immediately reflect the updated name/avatar without a re-login.
      const token = localStorage.getItem("skillswap_token");
      if (token) {
        loginUser(token, data.user);
      }

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update profile. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted">Loading your profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display font-bold text-3xl text-ink mb-1">
          Settings
        </h1>
        <p className="text-muted mb-8">
          Update your profile information and skills.
        </p>

        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-ink/10 p-6 flex flex-col gap-5"
        >
          <div className="flex items-center gap-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xl font-semibold">
                {name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-ink mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a bit about yourself..."
              className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Location
            </label>
            <select
              value={locationChoice}
              onChange={(e) => setLocationChoice(e.target.value)}
              className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            >
              <option value="">Select your city</option>
              {NEPAL_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            {locationChoice === "Other" && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full mt-2 bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            )}
          </div>

          {/* Skills Offered */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Skills You Teach
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsOffered.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 bg-primary-soft text-primary text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag, skillsOffered, setSkillsOffered)}
                    className="hover:text-primary-dark"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={offeredInput}
              onChange={(e) => setOfferedInput(e.target.value)}
              onKeyDown={(e) =>
                handleTagKeyDown(
                  e,
                  offeredInput,
                  skillsOffered,
                  setSkillsOffered,
                  () => setOfferedInput("")
                )
              }
              onBlur={() =>
                addTag(offeredInput, skillsOffered, setSkillsOffered, () =>
                  setOfferedInput("")
                )
              }
              placeholder="Type a skill and press Enter"
              className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          {/* Skills Wanted */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Skills You Want to Learn
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsWanted.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 bg-ink/5 text-ink/80 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag, skillsWanted, setSkillsWanted)}
                    className="hover:text-ink"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={wantedInput}
              onChange={(e) => setWantedInput(e.target.value)}
              onKeyDown={(e) =>
                handleTagKeyDown(
                  e,
                  wantedInput,
                  skillsWanted,
                  setSkillsWanted,
                  () => setWantedInput("")
                )
              }
              onBlur={() =>
                addTag(wantedInput, skillsWanted, setSkillsWanted, () =>
                  setWantedInput("")
                )
              }
              placeholder="Type a skill and press Enter"
              className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors self-start px-8"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Settings;