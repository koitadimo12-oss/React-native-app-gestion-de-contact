import {View,Text,TextInput, Pressable} from "react-native";
import { router,useLocalSearchParams,} from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useContacts } from "../ContactContext";

export default function Modifier() {

  // Récupérer les informations envoyées par [id].tsx
  const {id,nom: ancienNom,telephone: ancienTelephone, } = useLocalSearchParams();

  // Mettre les anciennes informations dans les champs
  const [nom, setNom] = useState(
    String(ancienNom ?? "")
  );

  const [telephone, setTelephone] = useState(
    String(ancienTelephone ?? "")
  );

  // Message
  const [message, setMessage] = useState("");

  // Fonction pour modifier le contact
  const { modifierContact } = useContacts();

  const enregistrerModification = () => {

    if (!nom.trim() || !telephone.trim()) {
      return;
    }

    modifierContact(
      Number(id),
      nom.trim(),
      telephone.trim()
    );

    // Afficher le message
    setMessage("Contact modifié avec succès");

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
            backgroundColor: "#7077A4",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
          }}
        >

          <Ionicons
            name="create-outline"
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
          Modifier le contact
        </Text>

        <Text
          style={{
            color: "#D9EAF7",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Modifiez les informations du contact
        </Text>

      </View>

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
            placeholder="Nom"
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
            placeholder="Téléphone"
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

        {/* Message */}

        {message && (
          <Text
            style={{
              color: "green",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            {message}
          </Text>
        )}

        {/* Bouton Modifier */}

        <Pressable
          onPress={enregistrerModification}
          style={{
            backgroundColor: "#7077A4",
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
            Enregistrer les modifications
          </Text>

        </Pressable>

      </View>

    </View>
  );
}