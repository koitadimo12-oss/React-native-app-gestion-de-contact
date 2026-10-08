import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { api } from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { useContacts } from "../ContactContext";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [chargement, setChargement] = useState(false);

  const { chargerContacts } = useContacts();

  const connecter = async () => {
    if (!email || !motDePasse) {
      console.log("Veuillez remplir tous les champs");
      return;
    }

    try {
      setChargement(true);

      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: motDePasse,
      });

      const token = response.data.access_token;

      await SecureStore.setItemAsync("token", token);

      console.log("JWT enregistre avec succes");

      // Charger les contacts du compte connecté
      await chargerContacts();

      console.log("Contacts du compte charges avec succes");

      router.replace("/(tabs)/acceuil");

    } catch (error: any) {
      console.log(
        "Erreur connexion :",
        error.response?.data || error.message
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
        paddingHorizontal: 25,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* Logo */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <Image
            source={require("../assets/images/logoAncontact.png")}
            style={{
              width: 85,
              height: 85,
            }}
            resizeMode="contain"
          />

          <Text
            style={{
              color: "#38BDF8",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 8,
            }}
          >
            An-Contact
          </Text>
        </View>

        {/* Titre */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          Bon retour 👋
        </Text>

        <Text
          style={{
            color: "#BFD3E5",
            fontSize: 15,
            marginBottom: 30,
          }}
        >
          Connectez-vous pour retrouver vos contacts.
        </Text>

        {/* Email */}
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
            marginBottom: 18,
            borderWidth: 1,
            borderColor: "#1765A8",
          }}
        >
          <Ionicons
            name="mail-outline"
            size={21}
            color="#38BDF8"
          />

          <TextInput
            placeholder="Votre adresse email"
            placeholderTextColor="#8FAFC8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={{
              flex: 1,
              color: "#FFFFFF",
              fontSize: 15,
              marginLeft: 12,
            }}
          />
        </View>

        {/* Mot de passe */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          Mot de passe
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
          }}
        >
          <Ionicons
            name="lock-closed-outline"
            size={21}
            color="#38BDF8"
          />

          <TextInput
            placeholder="Votre mot de passe"
            placeholderTextColor="#8FAFC8"
            secureTextEntry={!voirMotDePasse}
            value={motDePasse}
            onChangeText={setMotDePasse}
            style={{
              flex: 1,
              color: "#FFFFFF",
              fontSize: 15,
              marginLeft: 12,
            }}
          />

          <Pressable
            onPress={() =>
              setVoirMotDePasse(!voirMotDePasse)
            }
          >
            <Ionicons
              name={
                voirMotDePasse
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={21}
              color="#8FAFC8"
            />
          </Pressable>
        </View>

        {/* Mot de passe oublié */}
        <Pressable
          style={{
            alignSelf: "flex-end",
            marginTop: 12,
            marginBottom: 25,
          }}
        >
          <Text
            style={{
              color: "#38BDF8",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Mot de passe oublié ?
          </Text>
        </Pressable>

        {/* Bouton connexion */}
        <Pressable
          onPress={connecter}
          disabled={chargement}
          style={{
            height: 56,
            backgroundColor: "#38BDF8",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            opacity: chargement ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            {chargement ? "Connexion..." : "Se connecter"}
          </Text>

          {!chargement && (
            <Ionicons
              name="arrow-forward"
              size={21}
              color="#FFFFFF"
              style={{
                marginLeft: 10,
              }}
            />
          )}
        </Pressable>

        {/* Inscription */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 25,
          }}
        >
          <Text
            style={{
              color: "#AFC4D8",
              fontSize: 14,
            }}
          >
            Pas encore de compte ?{" "}
          </Text>

          <Link
            href="/inscription"
            style={{
              color: "#38BDF8",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            S'inscrire
          </Link>
        </View>
      </View>

      {/* Bas de page */}
      <View
        style={{
          alignItems: "center",
          paddingBottom: 25,
        }}
      >
        <Text
          style={{
            color: "#64748B",
            fontSize: 11,
          }}
        >
          Simple • Rapide • Pratique
        </Text>
      </View>
    </View>
  );
}