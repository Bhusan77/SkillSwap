import { FC } from "react";
import { Link } from "react-router-dom";

const Footer: FC = () => {
  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <span className="font-display font-semibold text-lg text-white">
            SkillSwap
          </span>
          <p className="text-sm mt-2 text-white/60">
            Helping students build real skills by learning and teaching
            each other, one swap at a time.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/skills" className="hover:text-primary transition-colors">
                Browse Skills
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-primary transition-colors">
                Start Swapping
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;