---
description: "Use when writing or editing React Native components for the Expo mobile app. Covers NativeWind styling, Expo Router patterns, mobile-specific UI patterns, and animation guidelines."
applyTo: "apps/mobile/**/*.tsx"
---

# React Native Component Guidelines (Mobile)

- Use Expo Router for navigation (file-based routing in `app/`)
- NativeWind for styling (Tailwind classes via `className` prop)
- Use `react-native-reanimated` for 60fps animations
- Use `Lottie` for complex archetype reveal animations
- Secure token storage via `expo-secure-store`
- For charts: `react-native-svg` + custom components or Victory Native
- Bottom tab navigation for main screens (5 tabs: Home, Quest, Learn, Group, Profile)
- Always test on both iOS and Android viewports
- Use `SafeAreaView` wrapper for screens
- Dark theme default: `bg-[#0A0E27]` background throughout
