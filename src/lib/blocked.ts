import { Platform, Settings } from "react-native";

const key = "dumitruBlockedPublishers";
let blockedInMemory: string[] = [];

export function blockedPhones(): string[] {
  if (Platform.OS === "ios") {
    const stored: unknown = Settings.get(key);
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : [];
  }
  return blockedInMemory;
}

export function blockPhone(phone: string) {
  const next = [...new Set([...blockedPhones(), phone])];
  if (Platform.OS === "ios") Settings.set({ [key]: next });
  else blockedInMemory = next;
}
