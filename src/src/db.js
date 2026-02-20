import { openDB } from "idb";

const DB_NAME = "amigo_consultorio_v1";
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
      if (!db.objectStoreNames.contains("patients")) db.createObjectStore("patients", { keyPath: "id" });
      if (!db.objectStoreNames.contains("appointments")) db.createObjectStore("appointments", { keyPath: "id" });
      if (!db.objectStoreNames.contains("soap")) db.createObjectStore("soap", { keyPath: "id" });
      if (!db.objectStoreNames.contains("cashbook")) db.createObjectStore("cashbook", { keyPath: "id" });
      if (!db.objectStoreNames.contains("notes")) db.createObjectStore("notes", { keyPath: "id" });
      if (!db.objectStoreNames.contains("dentistry")) db.createObjectStore("dentistry", { keyPath: "id" });
    },
  });
}

export async function kvGet(key, fallback = null) {
  const db = await getDB();
  const v = await db.get("kv", key);
  return v ?? fallback;
}
export async function kvSet(key, value) {
  const db = await getDB();
  await db.put("kv", value, key);
}

export function uid(prefix="id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
