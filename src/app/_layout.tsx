import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return <><StatusBar style="dark"/><Stack screenOptions={{ headerStyle: { backgroundColor: "#f5f6f7" }, headerTintColor: "#142337", headerTitleStyle: { fontWeight: "700" }, contentStyle: { backgroundColor: "#f5f6f7" } }}><Stack.Screen name="index" options={{ title: "Dumitru Imobiliare" }}/><Stack.Screen name="listing/[id]" options={{ title: "Detalii proprietate" }}/><Stack.Screen name="publish" options={{ title: "Publică anunț" }}/><Stack.Screen name="report/[id]" options={{ title: "Raportează anunțul" }}/></Stack></>;
}
