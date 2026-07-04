import { FC, useState } from "react";
import Sidebar from "../components/Sidebar";

const faqs = [
  {
    question: "How do I list a skill I can teach?",
    answer:
      "Go to My Skills from the sidebar (or Post a Skill), fill in the title, description, category, and level, then submit. Your skill becomes visible to everyone browsing Explore.",
  },
  {
    question: "How do I edit or remove a skill I've listed?",
    answer:
      "Open My Skills — every skill you've posted has Edit and Delete buttons directly on its card.",
  },
  {
    question: "Can I change my name, bio, or location later?",
    answer:
      "Yes. Go to Settings and update any field, then save. Changes reflect immediately across your profile.",
  },
  {
    question: "Is messaging or session booking available yet?",
    answer:
      "Not yet — Messages and My Sessions are being built and will connect learners and teachers directly within the app.",
  },
  {
    question: "How is my password stored?",
    answer:
      "Your password is hashed before it's ever saved, and it's never included in any data sent back to your browser.",
  },
];

const Help: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <Sidebar />

      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display font-bold text-3xl text-ink mb-1">
          Help & FAQ
        </h1>
        <p className="text-muted mb-8">
          Answers to common questions about using SkillSwap.
        </p>

        <div className="bg-white rounded-2xl border border-ink/10 divide-y divide-ink/10">
          {faqs.map((faq, i) => (
            <div key={faq.question} className="p-5">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="font-medium text-ink">{faq.question}</span>
                <span
                  className={`text-primary transition-transform ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <p className="text-sm text-muted mt-3">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-primary-soft rounded-2xl p-6 mt-6">
          <h2 className="font-display font-semibold text-lg text-ink mb-1">
            Still need help?
          </h2>
          <p className="text-sm text-muted mb-4">
            This is a student project, so there's no live support team yet —
            but feel free to reach out directly with feedback or bugs.
          </p>
          
            href="mailto:support@skillswap.example.com"
            className="text-primary text-sm font-medium hover:underline"
          
            support@skillswap.example.com
        </div>
      </main>
    </div>
  );
};

export default Help;