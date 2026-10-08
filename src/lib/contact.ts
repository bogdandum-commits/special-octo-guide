import * as FileSystem from "expo-file-system/legacy";
import { Share } from "react-native";
import type { Listing } from "./api";

const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

export async function exportContact(listing: Listing): Promise<boolean> {
  if (!FileSystem.cacheDirectory) throw new Error("Contactul nu poate fi pregătit momentan.");
  const uri = `${FileSystem.cacheDirectory}dumitru-contact-${listing.id}.vcf`;
  const vcard = ["BEGIN:VCARD", "VERSION:3.0", `FN:${escape(listing.name)}`, `TEL;TYPE=CELL:${escape(listing.phone)}`, "END:VCARD", ""].join("\r\n");
  await FileSystem.writeAsStringAsync(uri, vcard);
  const result = await Share.share({ url: uri }, { subject: listing.name });
  return result.action === Share.sharedAction;
}
