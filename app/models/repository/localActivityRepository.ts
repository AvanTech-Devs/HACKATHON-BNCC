import { Activity } from "@/app/models/types/activity";

const STORAGE_KEY = "activities";

export const localActivityRepository = {
  getAll(): Activity[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    return JSON.parse(data).map((activity: Activity) => ({
      ...activity,
      createdAt: new Date(activity.createdAt),
      updatedAt: activity.updatedAt
        ? new Date(activity.updatedAt)
        : undefined,
    }));
  },

  getById(id: string): Activity | undefined {
    return this.getAll().find((a) => a.id === id);
  },

  getByUnitId(unitId: string): Activity[] {
    return this.getAll().filter((a) => a.unitId === unitId);
  },

  create(activity: Activity) {
    const activities = this.getAll();
    activities.push(activity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  },

  update(id: string, updated: Activity): Activity {
    const activities = this.getAll().map((a) =>
      a.id === id ? updated : a
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    return updated;
  },

  delete(id: string) {
    const activities = this.getAll().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  },
};
