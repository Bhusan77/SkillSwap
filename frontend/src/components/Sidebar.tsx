import { FC, JSX, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../utils/imageUrl";

const IconGrid: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconSearch: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconMail: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 6 10 7 10-7" />
  </svg>
);
const IconCalendar: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconUser: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);
const IconSettings: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconHelp: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <IconGrid /> },
  { to: "/skills", label: "Explore", icon: <IconSearch /> },
  { to: "/messages", label: "Messages", icon: <IconMail /> },
  { to: "/my-sessions", label: "My Sessions", icon: <IconCalendar /> },
  { to: "/profile", label: "Profile", icon: <IconUser /> },
];

const Sidebar: FC = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);

  const handleComingSoon = (label: string) => {
    setNotice(`${label} isn't built yet — coming in a later phase.`);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-ink/10 flex flex-col justify-between py-6 px-4">
      <div>
        <Link to="/" className="font-display font-bold text-2xl text-primary px-2 mb-8 block">
          SkillSwap
        </Link>

        <div className="flex items-center gap-3 px-2 mb-8">
          {user?.profileImage ? (
            <img
              src={resolveImageUrl(user.profileImage)}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-ink">{user?.name}</p>
            <p className="text-xs text-muted">
              {user?.bio || "SkillSwap Member"}
            </p>
          </div>
        </div>

        {notice && (
          <div className="mb-4 text-xs text-primary bg-primary-soft rounded-md px-3 py-2 mx-2">
            {notice}
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {navItems.map((item) =>
            item.comingSoon ? (
              <button
                key={item.label}
                onClick={() => handleComingSoon(item.label)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink/60 hover:bg-ink/5 transition-colors text-left"
              >
                {item.icon}
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-primary-soft text-primary"
                    : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/skills/add"
          className="bg-primary text-white text-sm font-semibold text-center py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Post a Skill
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-primary-soft text-primary"
              : "text-ink/60 hover:bg-ink/5"
          }`}
        >
          <IconSettings /> Settings
        </Link>

        <Link
          to="/help"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/help"
              ? "bg-primary-soft text-primary"
              : "text-ink/60 hover:bg-ink/5"
          }`}
        >
          <IconHelp /> Help
        </Link>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-left"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;