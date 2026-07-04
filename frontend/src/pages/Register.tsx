import { FC, useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { NEPAL_CITIES } from "../constants/locations";


const EyeIcon: FC<{ visible: boolean }> = ({ visible }) =>
  visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const GoogleIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const FacebookIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const Register: FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locationChoice, setLocationChoice] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const finalLocation =
      locationChoice === "Other" ? customLocation.trim() : locationChoice;

    try {
      await register({ name, email, password, location: finalLocation });
      setNotice("User created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    setNotice(`${provider} sign-up is coming soon — use the form below for now.`);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -right-24 top-1/3 w-96 h-96 border border-white/10 rounded-full" />
        <div className="absolute -right-10 top-1/3 translate-y-10 w-72 h-72 border border-white/10 rounded-full" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16 w-fit">
            <span className="text-2xl">🎓</span>
            <span className="font-display font-semibold text-4xl">SkillSwap</span>
          </Link>

          <h1 className="font-display font-semibold text-3xl leading-tight mb-6">
            Exchange Skills,
            <br />
            Empower Futures.
          </h1>
          <p className="text-white/70 max-w-sm">
            "Empowering people to learn, teach, and grow together through
            meaningful skill exchange."
          </p>
        </div>

        <div className="relative z-10 mt-12">
          <svg viewBox="0 0 400 220" className="w-full">
            <rect x="20" y="20" width="360" height="180" rx="16" fill="#ffffff" opacity="0.08" />
            <circle cx="110" cy="110" r="22" fill="#ffffff" opacity="0.5" />
            <rect x="90" y="132" width="40" height="50" rx="12" fill="#ffffff" opacity="0.35" />
            <circle cx="200" cy="95" r="26" fill="#ffffff" opacity="0.6" />
            <rect x="176" y="121" width="48" height="58" rx="14" fill="#ffffff" opacity="0.4" />
            <circle cx="290" cy="110" r="22" fill="#ffffff" opacity="0.5" />
            <rect x="270" y="132" width="40" height="50" rx="12" fill="#ffffff" opacity="0.35" />
            <rect x="60" y="185" width="280" height="8" rx="4" fill="#ffffff" opacity="0.15" />
          </svg>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-ink/10 p-8">
            <h2 className="font-display font-semibold text-2xl text-ink mb-1">
              Create Your Account
            </h2>
            <p className="text-sm text-muted mb-6">
              Sign up to your SkillSwap account to continue learning.
            </p>

            {notice && (
              <div className="mb-4 text-sm text-primary bg-primary-soft rounded-md px-3 py-2">
                {notice}
              </div>
            )}
            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 mb-5">
              <button
                type="button"
                onClick={() => handleSocialClick("Google")}
                className="flex items-center justify-center gap-3 border border-ink/15 rounded-lg py-2.5 text-sm font-medium hover:bg-ink/5 transition-colors"
              >
                <GoogleIcon /> Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("Facebook")}
                className="flex items-center justify-center gap-3 border border-ink/15 rounded-lg py-2.5 text-sm font-medium hover:bg-ink/5 transition-colors"
              >
                <FacebookIcon /> Continue with Facebook
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px bg-ink/10 flex-1" />
              <span className="text-xs text-muted">OR</span>
              <div className="h-px bg-ink/10 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  placeholder="Enter your valid email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                <p className="text-xs text-muted mt-1">
                  Must be at least 8 characters long.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-ink/[0.03] border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
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

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold py-3 rounded-lg tracking-wide transition-colors"
              >
                {loading ? "SIGNING UP..." : "SIGN UP"}
              </button>
            </form>

            <p className="text-sm text-center text-ink/70 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Log In
              </Link>
            </p>
          </div>

          <p className="text-xs text-muted text-center mt-6">
            By signing up, you agree to SkillSwap's Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;