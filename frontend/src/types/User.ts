export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  profileImage: string;
  skillsOffered: string[];
  skillsWanted: string[];
  createdAt: string;
  updatedAt: string;
}

// Response shape from POST /api/auth/register and POST /api/auth/login
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  location?: string;
}