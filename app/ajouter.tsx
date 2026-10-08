import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { useContacts } from "../ContactContext";
import { api } from "@/services/api";

export default function Ajouter() {
  const {
    categorie: categorieParam,
  } = useLocalSearchParams();

  const [categorie, setCategorie] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const { ajouterContact } = useContacts();

  useEffect(() => {
    if (typeof categorieParam === "string") {
      setCategorie(categorieParam);
    }
  }, [categorieParam]);

  const enregistrer = async () => {
    if (
      !categorie.trim() ||
      !nom.trim() ||
      !telephone.trim()
    ) {
      return;
    }

    try {
      const response = await api.post("/contacts", {
        nom: nom.trim(),
        telephone: telephone.trim(),
        favori: false,
        categorie: categorie.trim(),
        note: note.trim(),
      });

      console.log("Contact créé :", response.data);

      // On ajoute exactement le contact retourné par le backend
      ajouterContact(response.data);

      setMessage("Nouveau contact ajouté");

      // Redirection vers l'onglet Contacts
      setTimeout(() => {
        router.replace("/(tabs)/contact");
      }, 1000);
    } catch (error: any) {
      console.log(
        "Erreur création contact :",
        error.response?.data || error.message
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
        {/* EN-TÊTE */}
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

        {/* MESSAGE DE SUCCÈS */}
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

        {/* FORMULAIRE */}
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

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/categorie",
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "#38BDF8",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 15,
              marginBottom: 22,
            }}
          >
            <Ionicons
              name="pricetag-outline"
              size={21}
              color="#38BDF8"
            />

            <View
              style={{
                flex: 1,
                marginLeft: 10,
              }}
            >
              {categorie ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: "#0F172A",
                    fontWeight: "600",
                  }}
                >
                  {categorie}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: "#94A3B8",
                  }}
                >
                  Choisir une catégorie
                </Text>
              )}
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#94A3B8"
            />
          </Pressable>

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

          {/* DESCRIPTION */}
          <Text
            style={{
              color: "#0F172A",
              fontSize: 15,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Description
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
              placeholder="Ex : Rencontre à l'université..."
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

          {/* BOUTON ENREGISTRER */}
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
    </ScrollView>
  );
}