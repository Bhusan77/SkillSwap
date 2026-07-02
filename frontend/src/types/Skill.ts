
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";


export interface SkillOwner {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: SkillLevel;
  owner: SkillOwner;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillInput {
  title: string;
  description: string;
  category: string;
  level: SkillLevel;
}


export type UpdateSkillInput = Partial<CreateSkillInput>;


export interface SkillResponse {
  message: string;
  skill: Skill;
}