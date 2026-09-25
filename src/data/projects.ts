import projectsData from "./projects.json";

export const projects = projectsData.projects;
export const initialProjects = projects;

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in_progress" | "completed" | "on_hold";
  category: "web" | "mobile" | "design" | "marketing" | "devops";
  progress: number;
  dueDate: string;
  createdAt: string;
}
