import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { api } from "@/services/api";

type User = {
  id: number;
  nom: string;
  email: string;
};

export default function ModifierProfil() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);

  // RÉCUPÉRER LES INFORMATIONS ACTUELLES
  useEffect(() => {
    const chargerProfil = async () => {
      try {
        const response = await api.get<User>("/user/me");

        console.log(
          "Profil récupéré :",
          response.data
        );

        setNom(response.data.nom);
        setEmail(response.data.email);
      } catch (error: any) {
        console.log(
          "Erreur récupération profil :",
          error.response?.data || error.message
        );
      } finally {
        setChargement(false);
      }
    };

    chargerProfil();
  }, []);

  // ENREGISTRER LES MODIFICATIONS
  const enregistrer = async () => {
    if (!nom.trim() || !email.trim()) {
      console.log(
        "Le nom et l'email sont obligatoires"
      );
      return;
    }

    try {
      setEnregistrement(true);

      const response = await api.put<User>(
        "/user/me",
        {
          nom: nom.trim(),
          email: email.trim().toLowerCase(),
        }
      );

      console.log(
        "Profil modifié :",
        response.data
      );

      router.back();
    } catch (error: any) {
      console.log(
        "Erreur modification profil :",
        error.response?.data || error.message
      );
    } finally {
      setEnregistrement(false);
    }
  };

  if (chargement) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A3F7A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
          }}
        >
          Chargement du profil...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
      }}
      contentContainerStyle={{
        padding: 25,
        paddingBottom: 40,
      }}
    >
      {/* EN-TÊTE */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 35,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#0D4C8F",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 15,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        <View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: "bold",
            }}
          >
            Modifier mon profil
          </Text>

          <Text
            style={{
              color: "#BFD3E5",
              fontSize: 14,
              marginTop: 5,
            }}
          >
            Modifiez vos informations
          </Text>
        </View>
      </View>

      {/* AVATAR */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 35,
        }}
      >
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#38BDF8",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            {nom
              .split(" ")
              .filter((mot) => mot.length > 0)
              .slice(0, 2)
              .map((mot) => mot[0])
              .join("")
              .toUpperCase() || "U"}
          </Text>
        </View>
      </View>

      {/* NOM */}
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        Nom
      </Text>

      <View
        style={{
          height: 55,
          backgroundColor: "#0D4C8F",
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          borderWidth: 1,
          borderColor: "#1765A8",
          marginBottom: 22,
        }}
      >
        <Ionicons
          name="person-outline"
          size={21}
          color="#38BDF8"
        />

        <TextInput
          value={nom}
          onChangeText={setNom}
          placeholder="Votre nom"
          placeholderTextColor="#8FAFC8"
          style={{
            flex: 1,
            color: "#FFFFFF",
            fontSize: 15,
            marginLeft: 12,
          }}
        />
      </View>

      {/* EMAIL */}
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        Email
      </Text>

      <View
        style={{
          height: 55,
          backgroundColor: "#0D4C8F",
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          borderWidth: 1,
          borderColor: "#1765A8",
          marginBottom: 30,
        }}
      >
        <Ionicons
          name="mail-outline"
          size={21}
          color="#38BDF8"
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Votre email"
          placeholderTextColor="#8FAFC8"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            flex: 1,
            color: "#FFFFFF",
            fontSize: 15,
            marginLeft: 12,
          }}
        />
      </View>

      {/* BOUTON ENREGISTRER */}
      <Pressable
        onPress={enregistrer}
        disabled={enregistrement}
        style={{
          height: 56,
          backgroundColor: "#38BDF8",
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          opacity: enregistrement ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 17,
            fontWeight: "bold",
          }}
        >
          {enregistrement
            ? "Enregistrement..."
            : "Enregistrer"}
        </Text>

        {!enregistrement && (
          <Ionicons
            name="checkmark"
            size={22}
            color="#FFFFFF"
            style={{
              marginLeft: 10,
            }}
          />
        )}
      </Pressable>
    </ScrollView>
  );
}