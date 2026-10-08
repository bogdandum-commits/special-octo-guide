import { StyleSheet, Text, View } from "react-native";
import type { ListingStats } from "../lib/api";

const labels: [keyof ListingStats, string][] = [["views", "Vizualizări"], ["favorites", "Adăugări la favorite"], ["contacts", "Contacte exportate"]];
export default function ListingStatistics({ stats }: { stats?: ListingStats }) {
  return <View style={styles.row} accessibilityLabel="Statisticile anunțului">{labels.map(([key, label]) => <View key={key} style={styles.item}><Text style={styles.value}>{typeof stats?.[key] === "number" ? stats[key].toLocaleString("ro-RO") : "—"}</Text><Text style={styles.label}>{label}</Text></View>)}</View>;
}
const styles = StyleSheet.create({ row: { flexDirection: "row", gap: 10, marginTop: 17, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#e3e8ec" }, item: { flex: 1 }, value: { fontSize: 20, fontWeight: "800", color: "#17283c" }, label: { fontSize: 12, lineHeight: 17, color: "#68788a", marginTop: 4 } });
