import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { Ionicons } from "@expo/vector-icons";

import { useContacts } from "../../ContactContext";
import { api } from "@/services/api";

type User = {
  id: number;
  nom: string;
  email: string;
};

export default function Profil() {
  const { viderContacts } = useContacts();

  const [user, setUser] = useState<User | null>(null);
  const [chargement, setChargement] = useState(true);

  // RÉCUPÉRER L'UTILISATEUR CONNECTÉ
  useEffect(() => {
    const chargerProfil = async () => {
      try {
        const response = await api.get("/user/me");

        console.log(
          "Utilisateur connecté :",
          response.data
        );

        setUser(response.data);
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

  // DÉCONNEXION
  const deconnecter = async () => {
    await SecureStore.deleteItemAsync("token");

    viderContacts();

    router.replace("/inscription");
  };

  // INITIALLES
  const initiales = user?.nom
    ? user.nom
        .split(" ")
        .filter((mot) => mot.length > 0)
        .slice(0, 2)
        .map((mot) => mot[0])
        .join("")
        .toUpperCase()
    : "U";

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
      {/* TITRE */}
      <View
        style={{
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          Mon profil
        </Text>

        <Text
          style={{
            color: "#BFD3E5",
            fontSize: 15,
            marginTop: 6,
          }}
        >
          Gérez votre compte An-Contact
        </Text>
      </View>

      {/* AVATAR + NOM */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 35,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#38BDF8",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {initiales}
          </Text>
        </View>

        {/* Nom */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 23,
            fontWeight: "bold",
          }}
        >
          {chargement
            ? "Chargement..."
            : user?.nom || "Utilisateur"}
        </Text>

        {/* Email */}
        <Text
          style={{
            color: "#BFD3E5",
            fontSize: 14,
            marginTop: 6,
          }}
        >
          {chargement
            ? "..."
            : user?.email || "Email indisponible"}
        </Text>
      </View>

      {/* INFORMATIONS DU COMPTE */}
      <View
        style={{
          backgroundColor: "#0D4C8F",
          borderRadius: 18,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Informations du compte
        </Text>

        {/* NOM */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#1765A8",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name="person-outline"
              size={21}
              color="#38BDF8"
            />
          </View>

          <View>
            <Text
              style={{
                color: "#8FAFC8",
                fontSize: 12,
              }}
            >
              Nom
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "600",
                marginTop: 3,
              }}
            >
              {chargement
                ? "Chargement..."
                : user?.nom || "Nom indisponible"}
            </Text>
          </View>
        </View>

        {/* EMAIL */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#1765A8",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name="mail-outline"
              size={21}
              color="#38BDF8"
            />
          </View>

          <View>
            <Text
              style={{
                color: "#8FAFC8",
                fontSize: 12,
              }}
            >
              Email
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "600",
                marginTop: 3,
              }}
            >
              {chargement
                ? "Chargement..."
                : user?.email || "Email indisponible"}
            </Text>
          </View>
        </View>
      </View>

      {/* ACTIONS */}
      <View
        style={{
          backgroundColor: "#0D4C8F",
          borderRadius: 18,
          padding: 8,
          marginBottom: 25,
        }}
      >
        {/* MODIFIER PROFIL */}
        <Pressable
          onPress={() => {
            router.push("/modifierProfil");
          }}
          style={{
            height: 58,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#1765A8",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name="create-outline"
              size={21}
              color="#38BDF8"
            />
          </View>

          <Text
            style={{
              flex: 1,
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Modifier mon profil
          </Text>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#8FAFC8"
          />
        </Pressable>

        {/* SÉPARATEUR */}
        <View
          style={{
            height: 1,
            backgroundColor: "#1765A8",
            marginHorizontal: 12,
          }}
        />

        {/* DÉCONNEXION */}
        <Pressable
          onPress={deconnecter}
          style={{
            height: 58,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#7F1D1D",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={21}
              color="#FCA5A5"
            />
          </View>

          <Text
            style={{
              flex: 1,
              color: "#FCA5A5",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Se déconnecter
          </Text>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#FCA5A5"
          />
        </Pressable>
      </View>

      {/* INFORMATIONS APPLICATION */}
      <View
        style={{
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          An-Contact
        </Text>

        <Text
          style={{
            color: "#64748B",
            fontSize: 12,
            marginTop: 4,
          }}
        >
          Version 1.0.0
        </Text>

        <Text
          style={{
            color: "#64748B",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          Simple • Rapide • Pratique
        </Text>
      </View>
    </ScrollView>
  );
}