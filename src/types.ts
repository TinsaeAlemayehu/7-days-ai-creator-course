export interface UserProfile {
  uid: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streaks: number;
  lastActive: string;
  completedDays: number[];
  badges: string[];
  projects: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Project {
  id: string;
  userId: string;
  day: number;
  type: string;
  title: string;
  content: any;
  imageUrl?: string;
  createdAt: string;
}
