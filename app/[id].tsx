import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  View,
  Text,
  Linking,
  Pressable,
  Alert,
} from "react-native";

import {
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";

import { useContacts } from "../ContactContext";

export default function Idcontact() {

  const { id } = useLocalSearchParams();

  const {
    contacts,
    supprimerContact,
    changerFavori,
  } = useContacts();

  const contact = contacts.find(
    (contact) => contact.id === Number(id)
  );

  if (!contact) {
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
            color: "white",
            fontSize: 18,
          }}
        >
          Contact introuvable
        </Text>
      </View>
    );
  }

  const numero = contact.telephone.replace(/ /g, "");

  const numeroWhatsApp = `221${numero}`;

  // SUPPRIMER

  const supprimer = () => {

    Alert.alert(
      "Supprimer le contact",
      `Voulez-vous supprimer ${contact.nom} ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            supprimerContact(contact.id);
            router.back();
          },
        },
      ]
    );
  };

  // MODIFIER

  const modifier = () => {

    router.push({
      pathname: "/modifier",

      params: {
        id: contact.id,
        nom: contact.nom,
        telephone: contact.telephone,
      },
    });
  };

  // FAVORI

  const favori = () => {
    changerFavori(contact.id);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
        paddingHorizontal: 20,
      }}
    >

      {/* Barre du haut */}

      <View
        style={{
          marginTop: 45,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        {/* Retour */}

        <Pressable
          onPress={() => router.back()}
          style={{
            width: 45,
            height: 45,
            borderRadius: 23,
            backgroundColor: "#0D4C8F",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
          />

        </Pressable>

        {/* Favori */}

        <Pressable
          onPress={favori}
          style={{
            width: 45,
            height: 45,
            borderRadius: 23,
            backgroundColor: "#0D4C8F",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <Ionicons
            name={
              contact.favori
                ? "heart"
                : "heart-outline"
            }
            size={26}
            color="#FF5C70"
          />

        </Pressable>

      </View>

      {/* Informations */}

      <View
        style={{
          alignItems: "center",
          marginTop: 35,
          marginBottom: 30,
        }}
      >

        <View
          style={{
            width: 105,
            height: 105,
            borderRadius: 53,
            backgroundColor: "#E0F2FE",
            borderWidth: 4,
            borderColor: "#38BDF8",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >

          <Text
            style={{
              color: "#0A3F7A",
              fontSize: 42,
              fontWeight: "bold",
            }}
          >
            {contact.nom
              .charAt(0)
              .toUpperCase()}
          </Text>

        </View>

        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          {contact.nom}
        </Text>

        <Text
          style={{
            color: "#BFD3E5",
            fontSize: 17,
            marginTop: 7,
          }}
        >
          {contact.telephone}
        </Text>

      </View>

      {/* Appeler / WhatsApp */}

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 25,
        }}
      >

        {/* APPELER */}

        <Pressable
          onPress={() =>
            Linking.openURL(
              `tel:${contact.telephone}`
            )
          }
          style={{
            flex: 1,
            backgroundColor: "#38BDF8",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >

          <Ionicons
            name="call"
            size={25}
            color="white"
          />

          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            Appeler
          </Text>

        </Pressable>

        {/* WHATSAPP */}

        <Pressable
          onPress={() =>
            Linking.openURL(
              `whatsapp://send?phone=${numeroWhatsApp}`
            )
          }
          style={{
            flex: 1,
            backgroundColor: "#25D366",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >

          <FontAwesome
            name="whatsapp"
            size={26}
            color="white"
          />

          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            WhatsApp
          </Text>

        </Pressable>

      </View>

      {/* Actions */}

      <View
        style={{
          backgroundColor: "#0D4C8F",
          borderRadius: 20,
          padding: 18,
        }}
      >

        <Text
          style={{
            color: "#BFD3E5",
            fontSize: 13,
            marginBottom: 15,
          }}
        >
          ACTIONS
        </Text>

        {/* MODIFIER */}

        <Pressable
          onPress={modifier}
          style={{
            backgroundColor: "#7077A4",
            paddingVertical: 15,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >

          <Ionicons
            name="create-outline"
            size={23}
            color="white"
          />

          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            Modifier le contact
          </Text>

        </Pressable>

        {/* SUPPRIMER */}

        <Pressable
          onPress={supprimer}
          style={{
            backgroundColor: "#8F1915",
            paddingVertical: 15,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <Ionicons
            name="trash-outline"
            size={23}
            color="white"
          />

          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            Supprimer le contact
          </Text>

        </Pressable>

      </View>

      {/* Message favori */}

      <Text
        style={{
          color: "#94A3B8",
          fontSize: 13,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        {contact.favori
          ? "❤️ Ce contact est dans vos favoris"
          : "♡ Ajoutez ce contact à vos favoris"}
      </Text>

    </View>
  );
}