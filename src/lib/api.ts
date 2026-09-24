export const ORIGIN = "https://dumitru-imobiliare.bogdan-dum.chatgpt.site";

export type Listing = {
  id: string;
  name: string;
  area: string;
  kind: string;
  transaction: string;
  rooms: number;
  size: number | null;
  price: number;
  description: string;
  phone: string;
  photos: string[];
  featured: boolean;
  floor?: number;
  negotiable?: boolean;
  features?: string[];
};

export const originalListing: Listing = {
  id: "1",
  name: "Apartament 2 camere, decomandat",
  area: "Radu Negru · Brăila",
  kind: "apartament",
  transaction: "vanzare",
  rooms: 2,
  size: null,
  price: 47000,
  description: "Apartament cu 2 camere, confort 1, decomandat, renovat, situat la etajul 4 în zona Radu Negru. În apropiere se află Penny, Piața Radu Negru, Școala nr. 31, o grădiniță și o biserică.",
  phone: "0758408604",
  photos: [9565,9567,9566,9563,9562,9568,9564,9561,9569].map(n => `${ORIGIN}/assets/radu-negru/${n}.jpg`),
  featured: false,
  floor: 4,
  negotiable: true,
  features: ["Tâmplărie PVC cu geam termopan", "Centrală termică proprie", "Aer condiționat", "Uși interioare din lemn", "Ușă metalică la intrare", "Baie cu geam", "Compartimentare decomandată"],
};

export async function getListings(): Promise<Listing[]> {
  const response = await fetch(`${ORIGIN}/api/listings`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Anunțurile noi nu sunt disponibile momentan.");
  const data = await response.json() as { listings: Listing[] };
  return [originalListing, ...data.listings.map(p => ({ ...p, photos: p.photos.map(url => new URL(url, ORIGIN).toString()) }))];
}

export const euro = (amount: number) => `${amount.toLocaleString("ro-RO")} €`;
