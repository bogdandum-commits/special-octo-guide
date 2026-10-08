import { Platform, Settings } from "react-native";
import { ORIGIN, type ListingStats } from "./api";

const visitorKey = "dumitruAudienceVisitor";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
let sessionVisitor: string | undefined;

function visitorId() {
  const stored: unknown = Platform.OS === "ios" ? Settings.get(visitorKey) : sessionVisitor;
  if (typeof stored === "string" && uuid.test(stored)) return stored;
  // This pseudonymous counter key is not an authentication credential.
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
    const random = Math.floor(Math.random() * 16);
    return (char === "x" ? random : (random & 3) | 8).toString(16);
  });
  if (Platform.OS === "ios") Settings.set({ [visitorKey]: id });
  sessionVisitor = id;
  return id;
}

export async function recordView(id: string): Promise<ListingStats> {
  const response = await fetch(`${ORIGIN}/api/listing-stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN },
    body: JSON.stringify({ id, visitor: visitorId(), event: "view" }),
  });
  const data = await response.json() as { stats: ListingStats; error?: string };
  if (!response.ok) throw new Error(data.error ?? "Vizualizarea nu a putut fi înregistrată.");
  return data.stats;
}
