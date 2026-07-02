import type { CreateSkillInput, Skill, SkillResponse, UpdateSkillInput } from "../types/Skill";
import api from "./api";


// GET /api/skills — fetch all skills
export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get<Skill[]>("/skills");
  return response.data;
};

// GET /api/skills/:id — fetch single skill by ID
export const getSkillById = async (id: string): Promise<Skill> => {
  const response = await api.get<Skill>(`/skills/${id}`);
  return response.data;
};

// POST /api/skills — create a new skill
export const createSkill = async (
  data: CreateSkillInput
): Promise<SkillResponse> => {
  const response = await api.post<SkillResponse>("/skills", data);
  return response.data;
};

// PUT /api/skills/:id — update an existing skill
export const updateSkill = async (
  id: string,
  data: UpdateSkillInput
): Promise<SkillResponse> => {
  const response = await api.put<SkillResponse>(`/skills/${id}`, data);
  return response.data;
};

// DELETE /api/skills/:id — delete a skill
export const deleteSkill = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/skills/${id}`);
  return response.data;
};