import appsDataRaw from "./apps.json";

export const apps = appsDataRaw.apps;
export const appsData = apps;

export interface AppItem {
  id: string;
  name: string;
  desc: string;
  connected: boolean;
  category: "Productivity" | "Communication" | "Development" | "Finance" | "Design";
}
