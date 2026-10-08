import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { useContacts } from "../ContactContext";

export default function Modifier() {
  // Récupérer les informations envoyées par [id].tsx
  const {
    id,
    categorie: ancienneCategorie,
    nom: ancienNom,
    telephone: ancienTelephone,
    note: ancienneNote,
  } = useLocalSearchParams();

  // Catégorie
  const [categorie, setCategorie] = useState(
    String(ancienneCategorie ?? "")
  );

  // Nom
  const [nom, setNom] = useState(
    String(ancienNom ?? "")
  );

  // Téléphone
  const [telephone, setTelephone] = useState(
    String(ancienTelephone ?? "")
  );

  // Note
  const [note, setNote] = useState(
    String(ancienneNote ?? "")
  );

  // Message
  const [message, setMessage] = useState("");

  // Fonction de modification
  const { modifierContact } = useContacts();

  const enregistrerModification = async () => {
    if (!categorie.trim() || !nom.trim() || !telephone.trim()) {
      return;
    }

    try {
      await modifierContact(
        Number(id),
        nom.trim(),
        telephone.trim(),
        categorie.trim(),
        note.trim()
      );

      setMessage("Contact modifié avec succès");

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.log(
        "Erreur modification contact :",
        error
      );
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
      }}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      <View
        style={{
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
          {/* CATÉGORIE */}

          <Text
            style={{
              color: "#0F172A",
              fontSize: 15,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Catégorie
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "#38BDF8",
              borderRadius: 12,
              paddingHorizontal: 14,
              marginBottom: 22,
            }}
          >
            <Ionicons
              name="pricetag-outline"
              size={21}
              color="#38BDF8"
            />

            <TextInput
              placeholder="Ex : Université, Travail, Famille..."
              placeholderTextColor="#94A3B8"
              value={categorie}
              onChangeText={setCategorie}
              style={{
                flex: 1,
                paddingVertical: 15,
                paddingHorizontal: 10,
                fontSize: 16,
                color: "#0F172A",
              }}
            />
          </View>

          {/* NOM */}

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

          {/* TÉLÉPHONE */}

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
              marginBottom: 22,
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

          {/* NOTE */}

          <Text
            style={{
              color: "#0F172A",
              fontSize: 15,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Note
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 12,
              paddingHorizontal: 14,
              marginBottom: 25,
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={21}
              color="#64748B"
              style={{
                marginTop: 16,
              }}
            />

            <TextInput
              placeholder="Ajoutez une note sur ce contact..."
              placeholderTextColor="#94A3B8"
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
              style={{
                flex: 1,
                minHeight: 100,
                paddingVertical: 15,
                paddingHorizontal: 10,
                fontSize: 16,
                color: "#0F172A",
              }}
            />
          </View>

          {/* MESSAGE */}

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

          {/* BOUTON */}

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
    </ScrollView>
  );
}