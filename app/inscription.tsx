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

export default function Inscription() {
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [voirConfirmation, setVoirConfirmation] = useState(false);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const inscrire = async () => {
    try {
      const response = await api.post("/auth/register", {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        password: motDePasse,
      });

      console.log("Inscription réussie :", response.data);

      router.replace("/connexion");
    } catch (error: any) {
      console.log(
        "Erreur inscription :",
        error.response?.data || error.message
      );
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
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../assets/images/logoAncontact.png")}
            style={{
              width: 75,
              height: 75,
            }}
            resizeMode="contain"
          />

          <Text
            style={{
              color: "#38BDF8",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            An-Contact
          </Text>
        </View>

        {/* Titre */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 7,
          }}
        >
          Créer un compte ✨
        </Text>

        <Text
          style={{
            color: "#BFD3E5",
            fontSize: 15,
            marginBottom: 22,
          }}
        >
          Créez votre compte pour gérer vos contacts.
        </Text>

        {/* Nom */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 7,
          }}
        >
          Nom
        </Text>

        <View
          style={{
            height: 52,
            backgroundColor: "#0D4C8F",
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: "#1765A8",
          }}
        >
          <Ionicons
            name="person-outline"
            size={21}
            color="#38BDF8"
          />

          <TextInput
            placeholder="Votre nom"
            placeholderTextColor="#8FAFC8"
            value={nom}
            onChangeText={setNom}
            style={{
              flex: 1,
              color: "#FFFFFF",
              fontSize: 15,
              marginLeft: 12,
            }}
          />
        </View>

        {/* Email */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 7,
          }}
        >
          Email
        </Text>

        <View
          style={{
            height: 52,
            backgroundColor: "#0D4C8F",
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            marginBottom: 14,
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
            marginBottom: 7,
          }}
        >
          Mot de passe
        </Text>

        <View
          style={{
            height: 52,
            backgroundColor: "#0D4C8F",
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            marginBottom: 14,
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
            placeholder="Créer un mot de passe"
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

        {/* Confirmation */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 7,
          }}
        >
          Confirmer le mot de passe
        </Text>

        <View
          style={{
            height: 52,
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
            name="shield-checkmark-outline"
            size={21}
            color="#38BDF8"
          />

          <TextInput
            placeholder="Confirmer votre mot de passe"
            placeholderTextColor="#8FAFC8"
            secureTextEntry={!voirConfirmation}
            value={confirmation}
            onChangeText={setConfirmation}
            style={{
              flex: 1,
              color: "#FFFFFF",
              fontSize: 15,
              marginLeft: 12,
            }}
          />

          <Pressable
            onPress={() =>
              setVoirConfirmation(!voirConfirmation)
            }
          >
            <Ionicons
              name={
                voirConfirmation
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={21}
              color="#8FAFC8"
            />
          </Pressable>
        </View>

        {/* Bouton */}
        <Pressable
          onPress={inscrire}
          style={{
            height: 55,
            backgroundColor: "#38BDF8",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 22,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Créer mon compte
          </Text>

          <Ionicons
            name="arrow-forward"
            size={21}
            color="#FFFFFF"
            style={{
              marginLeft: 10,
            }}
          />
        </Pressable>

        {/* Connexion */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#AFC4D8",
              fontSize: 14,
            }}
          >
            Vous avez déjà un compte ?{" "}
          </Text>

          <Link
            href="/connexion"
            style={{
              color: "#38BDF8",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Se connecter
          </Link>
        </View>
      </View>

      {/* Bas de page */}
      <View
        style={{
          alignItems: "center",
          paddingBottom: 20,
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