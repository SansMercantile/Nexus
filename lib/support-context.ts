import { getDb } from '@/lib/mongodb';

export async function getSupportContext() {
  // This function aggregates the "Publicly Shareable" knowledge of the constellation
  // without exposing IP, patents, or internal moats.
  const db = await getDb();
  
  // Fetch the high-level system descriptions and public value propositions
  // from the system-data and constants, filtering out internal technical specs.
  const systems = await db.collection('products').find({}).toArray(); 
  
  return {
    company: "Sans Mercantile",
    offering: "A constellation of 21 autonomous AI systems designed for regulated market infrastructure.",
    services: systems.map(s => ({ name: s.name, description: s.description })),
    guidelines: "Be professional, helpful, and focused on value. Never disclose internal architecture, patent numbers, or specific proprietary algorithms."
  };
}