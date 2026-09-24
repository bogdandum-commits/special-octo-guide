import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ORIGIN } from "../../lib/api";

const reasons = ["Anunț fals", "Conținut nepotrivit", "Date personale", "Altă problemă"];

export default function Report() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    if (!reason || !id) { setError("Alege motivul sesizării."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(`${ORIGIN}/api/reports`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId: id, reason, details }) });
      if (!response.ok) { const data = await response.json() as { error?: string }; throw new Error(data.error ?? "Nu am putut trimite sesizarea."); }
      Alert.alert("Sesizare trimisă", "Agenția va verifica anunțul.", [{ text: "Închide", onPress: () => router.back() }]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Nu am putut trimite sesizarea."); }
    finally { setBusy(false); }
  }

  return <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Raportează anunțul</Text><Text style={styles.info}>Spune-ne ce trebuie verificat. Agenția primește sesizarea în panoul de administrare.</Text>{reasons.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ selected: reason === option }} style={[styles.choice, reason === option && styles.selected]} onPress={() => setReason(option)}><Text style={styles.choiceText}>{reason === option ? "● " : "○ "}{option}</Text></Pressable>)}<Text style={styles.label}>Detalii (opțional)</Text><TextInput style={styles.input} multiline maxLength={500} value={details} onChangeText={setDetails} placeholder="Ce ai observat?" placeholderTextColor="#8190a0"/>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable disabled={busy} style={[styles.button, busy && { opacity: .5 }]} onPress={send}><Text style={styles.buttonText}>{busy ? "Se trimite…" : "Trimite sesizarea"}</Text></Pressable></ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ content: { padding: 20, paddingBottom: 40 }, title: { fontFamily: "serif", fontSize: 30, color: "#142337", marginBottom: 10 }, info: { fontSize: 16, lineHeight: 23, color: "#56687b", marginBottom: 18 }, choice: { backgroundColor: "white", borderWidth: 1, borderColor: "#d9e0e7", borderRadius: 10, padding: 15, marginBottom: 9 }, selected: { borderColor: "#b88b4e" }, choiceText: { color: "#253a50", fontSize: 16 }, label: { marginTop: 16, marginBottom: 8, color: "#253a50", fontWeight: "700" }, input: { minHeight: 120, padding: 12, borderWidth: 1, borderColor: "#d9e0e7", borderRadius: 10, backgroundColor: "white", fontSize: 16, color: "#142337", textAlignVertical: "top" }, button: { backgroundColor: "#c39a5d", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 22 }, buttonText: { color: "#142337", fontSize: 16, fontWeight: "800" }, error: { color: "#a13535", marginTop: 10 } });
