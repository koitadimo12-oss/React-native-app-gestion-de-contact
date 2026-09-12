
import {
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";

import { router } from "expo-router";

import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { useContacts } from "../ContactContext";

export default function Ajouter() {

  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [telephone, setTelephone] = useState("");

  const { ajouterContact } = useContacts();

  const enregistrer = () => {

    if (!nom.trim() || !telephone.trim()) {
      return;
    }

    // Ajouter le contact
    ajouterContact(
      nom.trim(),
      telephone.trim()
    );

    // Afficher le message
    setMessage("Nouveau contact ajouté");

    // Attendre 1 seconde puis revenir
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
        paddingHorizontal: 20,
      }}
    >

      {/* En-tête */}

      <View
        style={{
          marginTop: 60,
          marginBottom: 35,
          alignItems: "center",
        }}
      >

        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#38BDF8",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
          }}
        >

          <Ionicons
            name="person-add-outline"
            size={34}
            color="white"
          />

        </View>

        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          Ajouter un contact
        </Text>

        <Text
          style={{
            color: "#D9EAF7",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Enregistrez un nouveau contact
        </Text>

      </View>

      {/* Message de confirmation */}

      {message !== "" && (
        <View
          style={{
            backgroundColor: "#22C55E",
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderRadius: 12,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            {message}
          </Text>
        </View>
      )}

      {/* Carte */}

      <View
        style={{
          backgroundColor: "#F8FAFC",
          borderRadius: 25,
          padding: 25,
        }}
      >

        {/* Nom */}

        <Text
          style={{
            color: "#0F172A",
            fontSize: 15,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          Nom
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            borderRadius: 12,
            paddingHorizontal: 14,
            marginBottom: 22,
          }}
        >

          <Ionicons
            name="person-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            placeholder="Ex : Abdou"
            placeholderTextColor="#94A3B8"
            value={nom}
            onChangeText={setNom}
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 10,
              fontSize: 16,
              color: "#0F172A",
            }}
          />

        </View>

        {/* Téléphone */}

        <Text
          style={{
            color: "#0F172A",
            fontSize: 15,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          Téléphone
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            borderRadius: 12,
            paddingHorizontal: 14,
            marginBottom: 25,
          }}
        >

          <Ionicons
            name="call-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            placeholder="Ex : 77 123 45 67"
            placeholderTextColor="#94A3B8"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 10,
              fontSize: 16,
              color: "#0F172A",
            }}
          />

        </View>

        {/* Enregistrer */}

        <Pressable
          onPress={enregistrer}
          style={{
            backgroundColor: "#38BDF8",
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >

          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="white"
          />

          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Enregistrer
          </Text>

        </Pressable>

      </View>

    </View>
  );
}

