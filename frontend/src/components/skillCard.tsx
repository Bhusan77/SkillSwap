import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../utils/imageUrl";
import { Skill } from "../types/Skill";

interface SkillCardProps {
  skill: Skill;
}

const levelColors: Record<Skill["level"], string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

const SkillCard: FC<SkillCardProps> = ({ skill }) => {
  const { user } = useAuth();
  const isOwnSkill = user?._id === skill.owner._id;

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{skill.title}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${levelColors[skill.level]}`}
        >
          {skill.level}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3">{skill.description}</p>

      <span className="text-xs text-gray-500 uppercase tracking-wide">
        {skill.category}
      </span>

      <div className="flex items-center gap-2 pt-2 border-t">
        {skill.owner.profileImage ? (
          <img
            src={resolveImageUrl(skill.owner.profileImage)}
            alt={skill.owner.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
            {skill.owner.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm text-gray-700">{skill.owner.name}</span>
        {isOwnSkill && (
          <span className="text-xs text-gray-400 ml-auto">(You)</span>
        )}
      </div>

      {!isOwnSkill && (
        <Link
          to={`/messages/${skill.owner._id}`}
          state={{ name: skill.owner.name, profileImage: skill.owner.profileImage }}
          className="mt-2 text-center text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md py-1.5 hover:bg-blue-50 transition-colors"
        >
          Message {skill.owner.name.split(" ")[0]}
        </Link>
      )}
    </div>
  );
};

export default SkillCard;