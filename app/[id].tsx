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
  ScrollView,
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
          onPress: async () => {
            try {
              await supprimerContact(contact.id);

              router.back();
            } catch (error) {
              console.log(
                "Erreur suppression contact :",
                error
              );
            }
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
        id: String(contact.id),
        categorie: contact.categorie ?? "",
        nom: contact.nom,
        telephone: contact.telephone,
        note: contact.note ?? "",
      },
    });
  };

  // FAVORI

  const favori = async () => {
    try {
      await changerFavori(contact.id);
    } catch (error) {
      console.log(
        "Erreur modification favori :",
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
        paddingBottom: 35,
      }}
    >
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        {/* BARRE DU HAUT */}

        <View
          style={{
            marginTop: 45,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* RETOUR */}

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

          {/* FAVORI */}

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

        {/* IDENTITÉ DU CONTACT */}

        <View
          style={{
            alignItems: "center",
            marginTop: 30,
            marginBottom: 28,
          }}
        >
          {/* AVATAR */}

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
              marginBottom: 16,
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

          {/* NOM */}

          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {contact.nom}
          </Text>

          {/* CATÉGORIE */}

          {contact.categorie && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#38BDF8",
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                marginTop: 10,
              }}
            >
              <Ionicons
                name="pricetag"
                size={16}
                color="white"
              />

              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 6,
                }}
              >
                {contact.categorie}
              </Text>
            </View>
          )}

          {/* TÉLÉPHONE */}

          <Text
            style={{
              color: "#BFD3E5",
              fontSize: 17,
              marginTop: 10,
            }}
          >
            {contact.telephone}
          </Text>
        </View>

        {/* APPELER / WHATSAPP */}

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

        {/* À PROPOS */}

        {contact.note && (
          <View
            style={{
              backgroundColor: "#0D4C8F",
              borderRadius: 20,
              padding: 18,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#BFD3E5",
                fontSize: 13,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              À PROPOS
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#38BDF8"
              />

              <Text
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: 15,
                  lineHeight: 23,
                  marginLeft: 10,
                }}
              >
                {contact.note}
              </Text>
            </View>
          </View>
        )}

        {/* INFORMATIONS */}

        <View
          style={{
            backgroundColor: "#0D4C8F",
            borderRadius: 20,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#BFD3E5",
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            INFORMATIONS
          </Text>

          {/* CATÉGORIE */}

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
                backgroundColor: "#38BDF8",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="pricetag"
                size={20}
                color="white"
              />
            </View>

            <View
              style={{
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                }}
              >
                Catégorie
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                {contact.categorie || "Aucune catégorie"}
              </Text>
            </View>
          </View>
        </View>

        {/* ACTIONS */}

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
              fontWeight: "bold",
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
      </View>
    </ScrollView>
  );
}