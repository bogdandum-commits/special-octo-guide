import { Platform, Settings } from "react-native";
import { ORIGIN, type ListingStats } from "./api";

const visitorKey = "dumitruAudienceVisitor";
const favoritesKey = "dumitruFavoriteListings";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
let sessionVisitor: string | undefined;
let sessionFavorites: string[] = [];

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

export function favoriteListings(): string[] {
  const stored: unknown = Platform.OS === "ios" ? Settings.get(favoritesKey) : sessionFavorites;
  return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : [];
}

export function saveFavorite(id: string, saved: boolean) {
  const ids = new Set(favoriteListings());
  if (saved) ids.add(id); else ids.delete(id);
  sessionFavorites = [...ids];
  if (Platform.OS === "ios") Settings.set({ [favoritesKey]: sessionFavorites });
}

export async function recordInteraction(id: string, event: "view" | "favorite" | "contact", saved?: boolean): Promise<ListingStats> {
  const response = await fetch(`${ORIGIN}/api/listing-stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN },
    body: JSON.stringify({ id, visitor: visitorId(), event, ...(event === "favorite" ? { saved } : {}) }),
  });
  const data = await response.json() as { stats: ListingStats; error?: string };
  if (!response.ok) throw new Error(data.error ?? "Acțiunea nu a putut fi înregistrată.");
  return data.stats;
}

export const recordView = (id: string) => recordInteraction(id, "view");

export function latestStats(old: ListingStats | undefined, next: ListingStats): ListingStats {
  return { views: Math.max(old?.views ?? 0, next.views), favorites: Math.max(old?.favorites ?? 0, next.favorites), contacts: Math.max(old?.contacts ?? 0, next.contacts) };
}
