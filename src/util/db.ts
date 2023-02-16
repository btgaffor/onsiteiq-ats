import { openDB } from "idb";
import { Candidate, OnSiteIQAtsDB } from "./types";

export const openIndexedDb = async () =>
  openDB<OnSiteIQAtsDB>("onsiteiq-ats", 1, {
    upgrade(upgradeDb, _oldVersion, _newVersion, _transaction) {
      if (!upgradeDb.objectStoreNames.contains("candidates")) {
        upgradeDb.createObjectStore("candidates", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

export async function saveNewCandidates (candidates: Candidate[]): Promise<Candidate[]> {
  const db = await openIndexedDb();
  const candidateSaves = candidates.map(async (candidate) => {
    const id = await db.add("candidates", candidate);
    return { ...candidate, id };
  });
  return Promise.all(candidateSaves);
}

export async function loadCandidates(): Promise<Candidate[]> {
  const db = await openIndexedDb();
  return db.getAll("candidates");
}

export async function saveCandidate(candidate: Candidate): Promise<void> {
  const db = await openIndexedDb();
  await db.put("candidates", candidate);
}
