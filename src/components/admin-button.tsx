import { useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ORIGIN } from "../lib/api";

export default function AdminButton({ onClosed }: { onClosed: () => void }) {
  const opening = useRef(false);
  const [busy, setBusy] = useState(false);

  async function openAdministration() {
    if (opening.current) return;
    opening.current = true;
    setBusy(true);
    try {
      // Keep the existing server-side administrator check and web session.
      // No passwords, session cookies or administrative tokens enter the app.
      await WebBrowser.openBrowserAsync(`${ORIGIN}/admin`, {
        dismissButtonStyle: "close",
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: "#f5f6f7",
        controlsColor: "#142337",
        enableBarCollapsing: false,
        createTask: false,
        showTitle: true,
      });
      onClosed();
    } catch {
      Alert.alert("Administrare indisponibilă", "Panoul nu s-a putut deschide. Verifică conexiunea și încearcă din nou.");
    } finally {
      opening.current = false;
      setBusy(false);
    }
  }

  if (Platform.OS === "android") return null;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Administrare anunțuri"
      accessibilityHint="Deschide panoul securizat pentru autentificare și aprobarea anunțurilor"
      accessibilityState={{ disabled: busy, busy }} disabled={busy}
      onPress={openAdministration} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{busy ? "Se deschide…" : "Administrare"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 44, justifyContent: "center", paddingHorizontal: 10 },
  pressed: { opacity: 0.6 },
  label: { color: "#74512e", fontWeight: "700", fontSize: 14 },
});
