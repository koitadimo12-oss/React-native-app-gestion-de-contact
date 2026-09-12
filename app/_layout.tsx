import { Stack } from "expo-router";
import "react-native-reanimated";

import { ContactProvider } from "../ContactContext";

export default function RootLayout() {
  return (
    <ContactProvider>
      <Stack>

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="[id]"
          options={{
            title: "Détail du contact",
          }}
        />

        <Stack.Screen
          name="ajouter"
          options={{
            title: "Ajouter un contact",
          }}
        />

      </Stack>
    </ContactProvider>
  );
}