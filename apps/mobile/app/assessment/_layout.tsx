import { Stack } from "expo-router";

export default function AssessmentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A0E27" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cognitive" />
      <Stack.Screen name="vark" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
