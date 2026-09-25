import tasksData from "./tasks.json";

export const tasks = tasksData.tasks;
export const tasksDataList = tasks;

export interface Task {
  id: string;
  title: string;
  status: "backlog" | "todo" | "in progress" | "done" | "canceled";
  label: "bug" | "feature" | "documentation";
  priority: "low" | "medium" | "high";
}
