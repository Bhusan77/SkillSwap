import { FC } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// Small inline icon components — avoids installing react-icons just for the landing page
const IconSearch: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCalendar: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconSwap: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconShield: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IconChat: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4A8.5 8.5 0 0 1 3 15c0-4.6 3.9-8.5 8.5-8.5A8.4 8.4 0 0 1 21 11.5Z" />
  </svg>
);
const IconClock: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 16 14" />
  </svg>
);
const IconBadge: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6" />
    <path d="M9 14 7 22l5-3 5 3-2-8" />
  </svg>
);

const featuredSkills = [
  {
    title: "Python",
    description: "Learn fundamentals, from variables to functional programming.",
    level: "Beginner",
    owner: "By Aarav",
  },
  {
    title: "UI/UX Design",
    description: "Master Figma basics, color theory, and prototyping workflows.",
    level: "Intermediate",
    owner: "By Meera",
  },
  {
    title: "Photography",
    description: "Learn lighting, composition, and post-processing essentials.",
    level: "Beginner",
    owner: "By Kabir",
  },
];

const steps = [
  {
    icon: <IconSearch />,
    title: "Find a Skill",
    description: "Browse hundreds of skills taught by fellow students near you.",
  },
  {
    icon: <IconCalendar />,
    title: "Book a Session",
    description: "Choose a time that works for both of you and confirm instantly.",
  },
  {
    icon: <IconSwap />,
    title: "Swap & Grow",
    description: "Teach what you know, learn something new, and grow together.",
  },
];

const features = [
  { icon: <IconShield />, title: "Verified Profiles" },
  { icon: <IconChat />, title: "Real-time Chat" },
  { icon: <IconClock />, title: "Flexible Scheduling" },
  { icon: <IconBadge />, title: "Skill Badges" },
];

const Landing: FC = () => {
  return (
    <div className="bg-bg text-ink font-body">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display font-semibold text-3xl text-ink">
          SkillSwap
        </span>
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-ink/70">
          <Link to="/skills" className="hover:text-primary transition-colors">
            Explore
          </Link>
          <a href="#how-it-works" className="hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-ink/70 hover:text-primary transition-colors">
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-tight text-ink mb-5">
            Learn and Teach with Peers
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">
            Join SkillSwap's practice-driven community. Trade your skills,
            grow your knowledge, and swap what you know for what you want
            to learn.
          </p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/skills"
              className="border border-ink/15 text-ink px-6 py-3 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Explore Skills
            </Link>
          </div>
        </div>

        {/* Hero illustration — simple flat scene, matches the palette */}
        <div className="relative bg-primary-soft rounded-3xl p-8 flex items-center justify-center h-72 sm:h-96">
          <svg viewBox="0 0 320 220" className="w-full h-full">
            <rect x="90" y="140" width="140" height="14" rx="7" fill="#6D5DFC" opacity="0.15" />
            <circle cx="80" cy="90" r="26" fill="#6D5DFC" opacity="0.85" />
            <rect x="58" y="118" width="44" height="55" rx="14" fill="#6D5DFC" opacity="0.6" />
            <circle cx="160" cy="70" r="30" fill="#5847E0" />
            <rect x="134" y="102" width="52" height="65" rx="16" fill="#5847E0" opacity="0.75" />
            <circle cx="245" cy="95" r="24" fill="#6D5DFC" opacity="0.85" />
            <rect x="223" y="121" width="44" height="52" rx="14" fill="#6D5DFC" opacity="0.6" />
            <rect x="70" y="168" width="190" height="10" rx="5" fill="#1E1B2E" opacity="0.08" />
          </svg>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-semibold text-2xl text-ink">
            Featured Skills
          </h2>
          <Link to="/skills" className="text-primary text-sm font-medium hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredSkills.map((skill) => (
            <div
              key={skill.title}
              className="bg-white border border-ink/10 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-display font-semibold mb-4">
                {skill.title.charAt(0)}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {skill.title}
              </h3>
              <p className="text-sm text-muted mb-4">{skill.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="bg-primary-soft text-primary px-2 py-1 rounded-full font-medium">
                  {skill.level}
                </span>
                <span className="text-muted">{skill.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section id="how-it-works" className="bg-primary-soft py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink mb-14">
            Swap Skills in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-display font-semibold text-lg mb-4">
                  {i + 1}
                </div>
                <div className="text-primary mb-2">{step.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designed for students */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="grid grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-ink/10 rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                {f.icon}
              </div>
              <span className="font-medium text-sm">{f.title}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display font-semibold text-3xl text-ink mb-5">
            Designed for the Modern Student Journey
          </h2>
          <p className="text-muted mb-6">
            We've built SkillSwap for the way students actually learn —
            practical, peer-to-peer, and driven by real conversations, not
            complicated courses.
          </p>
          <ul className="space-y-3 text-sm text-ink/80">
            <li className="flex items-center gap-2">
              <span className="text-primary">✔</span> Access to peers across every discipline
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✔</span> Network with students on and off campus
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✔</span> Build your portfolio through collaboration
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-primary rounded-3xl px-8 py-16 text-center text-white">
          <h2 className="font-display font-semibold text-3xl mb-4">
            Ready to start your first swap?
          </h2>
          <p className="text-white/80 max-w-md mx-auto mb-8">
            Join thousands of students who are already learning and
            teaching skills they love — starting today.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary font-medium px-8 py-3 rounded-full hover:bg-primary-soft transition-colors inline-block"
          >
            Join SkillSwap Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;