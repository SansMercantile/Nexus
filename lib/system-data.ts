import { SYSTEMS, SystemData } from './constants';

export const systemsData: SystemData[] = SYSTEMS;

export function getSystemBySlug(slug: string): SystemData | undefined {
  return SYSTEMS.find((system) => system.id === slug);
}

export function getSystemById(id: string): SystemData | undefined {
  return SYSTEMS.find((system) => system.id === id);
}

export function getAllSystems(): SystemData[] {
  return SYSTEMS;
}
