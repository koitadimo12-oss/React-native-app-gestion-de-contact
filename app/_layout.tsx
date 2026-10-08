
import { Stack } from "expo-router";
import "react-native-reanimated";

import { ContactProvider } from "../ContactContext";

export default function RootLayout() {
  return (
    <ContactProvider>
      <Stack>

        {/* Page de connexion */}
        <Stack.Screen
          name="connexion"
          options={{
            headerShown: false,
          }}
        />

        {/* Page d'inscription */}
        <Stack.Screen
          name="inscription"
          options={{
            headerShown: false,
          }}
        />

        {/* Application principale */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {/* Détail d'un contact */}
        <Stack.Screen
          name="[id]"
          options={{
            title: "Détail du contact",
          }}
        />

        {/* Ajouter / modifier un contact */}
        <Stack.Screen
          name="ajouter"
          options={{
            title: "Ajouter un contact",
          }}
        />

        {/* Suppression */}
        <Stack.Screen
          name="alert"
          options={{
            title: "Supprimer",
          }}
        />
          <Stack.Screen
    name="modifier-profil"
    options={{ headerShown: false }}
  />

      </Stack>
    </ContactProvider>
  );
}

