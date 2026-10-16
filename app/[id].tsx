
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Linking,
  Alert,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContacts } from "../ContactContext";

// Icône correspondant à la catégorie
function obtenirIconeCategorie(
  categorie: string | null | undefined
): keyof typeof Ionicons.glyphMap {
  switch (categorie?.toLowerCase().trim()) {
    case "université":
    case "universite":
      return "school-outline";

    case "travail":
      return "briefcase-outline";

    case "famille":
      return "people-outline";

    case "ami":
      return "heart-outline";

    case "client":
      return "business-outline";

    case "autre":
    default:
      return "pricetag-outline";
  }
}

// Formater le numéro de téléphone
function formaterTelephone(
  telephone: string | null | undefined
): string {
  if (!telephone) {
    return "Numéro non disponible";
  }

  const numero = telephone.replace(/\D/g, "");

  let numeroLocal = numero;

  if (numero.startsWith("221") && numero.length === 12) {
    numeroLocal = numero.substring(3);
  }

  if (numeroLocal.length === 9) {
    return numeroLocal.replace(
      /^(\d{2})(\d{3})(\d{2})(\d{2})$/,
      "$1 $2 $3 $4"
    );
  }

  return telephone;
}

// Préparer le numéro pour WhatsApp
function preparerNumeroWhatsApp(
  telephone: string | null | undefined
): string | null {
  if (!telephone) {
    return null;
  }

  let numero = telephone.replace(/\D/g, "");

  if (numero.startsWith("00")) {
    numero = numero.substring(2);
  }

  if (numero.length === 9) {
    numero = "221" + numero;
  }

  if (numero.length < 10) {
    return null;
  }

  return numero;
}

export default function Idcontact() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    contacts,
    supprimerContact,
    changerFavori,
  } = useContacts();

  // Rechercher le contact correspondant à l'identifiant
  const contact = contacts.find(
    (element) => String(element.id) === String(id)
  );

  // Arrêter le rendu si le contact n'existe pas
  if (!contact) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F4F8FC",
          justifyContent: "center",
          alignItems: "center",
          padding: 25,
        }}
      >
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#E2EEFA",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="person-outline"
            size={42}
            color="#0A3F7A"
          />
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#0A3F7A",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Contact introuvable
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "#64748B",
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          Ce contact n'existe pas ou n'est plus disponible.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/contact")}
          style={{
            backgroundColor: "#0A3F7A",
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Retour aux contacts
          </Text>
        </Pressable>
      </View>
    );
  }

  // À partir d'ici, le contact existe.
  const contactSelectionne = contact;

  const nomContact = contactSelectionne.nom || "Sans nom";

  const categorieContact =
    contactSelectionne.categorie || "Autre";

  const telephoneContact =
    contactSelectionne.telephone || "";

  const noteContact = contactSelectionne.note || "";

  const iconeCategorie = obtenirIconeCategorie(
    contactSelectionne.categorie
  );

  // Appeler le contact
  async function appelerContact() {
    if (!telephoneContact) {
      Alert.alert(
        "Numéro indisponible",
        "Ce contact ne possède pas de numéro de téléphone."
      );
      return;
    }

    try {
      await Linking.openURL(`tel:${telephoneContact}`);
    } catch {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir l'application Téléphone."
      );
    }
  }

  // Ouvrir WhatsApp
  async function ouvrirWhatsApp() {
    const numero = preparerNumeroWhatsApp(telephoneContact);

    if (!numero) {
      Alert.alert(
        "Numéro invalide",
        "Vérifie le numéro de téléphone de ce contact."
      );
      return;
    }

    try {
      await Linking.openURL(`https://wa.me/${numero}`);
    } catch {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir WhatsApp."
      );
    }
  }

  // Ajouter ou retirer des favoris
  function basculerFavori() {
    changerFavori(contactSelectionne.id);
  }

  // Modifier le contact
  function modifierContact() {
    router.push({
      pathname: "/modifier",
      params: {
        id: String(contactSelectionne.id),
      },
    });
  }

  // Créer un rappel lié au contact
  function creerRappel() {
    router.push({
      pathname: "/ajouterRappel",
      params: {
        contactId: String(contactSelectionne.id),
      },
    });
  }

  // Afficher les rappels
  function afficherRappels() {
    router.push("/rappels");
  }

  // Confirmer la suppression
  function confirmerSuppression() {
    Alert.alert(
      "Supprimer le contact",
      `Veux-tu vraiment supprimer ${nomContact} ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            supprimerContact(contactSelectionne.id);
            router.replace("/(tabs)/contact");
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F4F8FC",
      }}
      contentContainerStyle={{
        paddingBottom: 35,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* En-tête */}
      <View
        style={{
          backgroundColor: "#0A3F7A",
          paddingTop: 25,
          paddingBottom: 35,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.15)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#FFFFFF"
            />
          </Pressable>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 19,
              fontWeight: "bold",
              marginLeft: 15,
            }}
          >
            Détails du contact
          </Text>

          <View style={{ flex: 1 }} />

          <Pressable
            onPress={basculerFavori}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.15)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={
                contactSelectionne.favori
                  ? "heart"
                  : "heart-outline"
              }
              size={23}
              color={
                contactSelectionne.favori
                  ? "#FF8FA3"
                  : "#FFFFFF"
              }
            />
          </Pressable>
        </View>

        {/* Avatar et identité */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#38BDF8",
              borderWidth: 4,
              borderColor: "rgba(255,255,255,0.35)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              {nomContact.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {nomContact}
          </Text>

          {/* Catégorie et icône */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              marginTop: 12,
            }}
          >
            <Ionicons
              name={iconeCategorie}
              size={18}
              color="#FFFFFF"
            />

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              {categorieContact}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions rapides */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginTop: 20,
          marginBottom: 25,
        }}
      >
        <Pressable
          onPress={appelerContact}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            paddingVertical: 18,
            alignItems: "center",
            marginRight: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "#E1F5FE",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 9,
            }}
          >
            <Ionicons
              name="call-outline"
              size={25}
              color="#0284C7"
            />
          </View>

          <Text
            style={{
              color: "#0A3F7A",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Appeler
          </Text>
        </Pressable>

        <Pressable
          onPress={ouvrirWhatsApp}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            paddingVertical: 18,
            alignItems: "center",
            marginLeft: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "#DCFCE7",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 9,
            }}
          >
            <Ionicons
              name="logo-whatsapp"
              size={25}
              color="#16A34A"
            />
          </View>

          <Text
            style={{
              color: "#0A3F7A",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            WhatsApp
          </Text>
        </Pressable>
      </View>

      {/* Informations */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#0A3F7A",
            marginBottom: 13,
          }}
        >
          Informations
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 18,
            marginBottom: 25,
            elevation: 2,
          }}
        >
          {/* Téléphone */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 14,
                backgroundColor: "#E1F5FE",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 13,
              }}
            >
              <Ionicons
                name="call-outline"
                size={22}
                color="#0284C7"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#64748B",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Numéro de téléphone
              </Text>

              <Text
                style={{
                  color: "#0A3F7A",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {formaterTelephone(
                  contactSelectionne.telephone
                )}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#E2E8F0",
              marginBottom: 20,
            }}
          />

          {/* Catégorie */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 14,
                backgroundColor: "#EDE9FE",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 13,
              }}
            >
              <Ionicons
                name={iconeCategorie}
                size={22}
                color="#7C3AED"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#64748B",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Catégorie
              </Text>

              <Text
                style={{
                  color: "#0A3F7A",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {categorieContact}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#E2E8F0",
              marginBottom: 20,
            }}
          />

          {/* Description */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 14,
                backgroundColor: "#FEF3C7",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 13,
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#D97706"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#64748B",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Description
              </Text>

              <Text
                style={{
                  color: noteContact ? "#334155" : "#94A3B8",
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                {noteContact || "Aucune description ajoutée."}
              </Text>
            </View>
          </View>
        </View>

        {/* Rappels */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#0A3F7A",
            marginBottom: 13,
          }}
        >
          Rappels
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 18,
            marginBottom: 25,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 15,
                backgroundColor: "#E0F2FE",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 13,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color="#0284C7"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#0A3F7A",
                  marginBottom: 4,
                }}
              >
                Ne rien oublier
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: "#64748B",
                  lineHeight: 19,
                }}
              >
                Crée un rappel associé à ce contact.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={creerRappel}
            style={{
              backgroundColor: "#0A3F7A",
              paddingVertical: 14,
              borderRadius: 13,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              Créer un rappel
            </Text>
          </Pressable>

          <Pressable
            onPress={afficherRappels}
            style={{
              borderWidth: 1,
              borderColor: "#BFDBFE",
              paddingVertical: 13,
              borderRadius: 13,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#0A3F7A"
            />

            <Text
              style={{
                color: "#0A3F7A",
                fontSize: 15,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Voir mes rappels
            </Text>
          </Pressable>
        </View>

        {/* Gestion du contact */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#0A3F7A",
            marginBottom: 13,
          }}
        >
          Gestion du contact
        </Text>

        <Pressable
          onPress={modifierContact}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 17,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 43,
              height: 43,
              borderRadius: 13,
              backgroundColor: "#E0F2FE",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 13,
            }}
          >
            <Ionicons
              name="create-outline"
              size={23}
              color="#0284C7"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#0A3F7A",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Modifier le contact
            </Text>

            <Text
              style={{
                color: "#64748B",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Modifier ses informations
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#94A3B8"
          />
        </Pressable>

        <Pressable
          onPress={confirmerSuppression}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 17,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#FECACA",
          }}
        >
          <View
            style={{
              width: 43,
              height: 43,
              borderRadius: 13,
              backgroundColor: "#FEE2E2",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 13,
            }}
          >
            <Ionicons
              name="trash-outline"
              size={23}
              color="#DC2626"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#DC2626",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Supprimer le contact
            </Text>

            <Text
              style={{
                color: "#64748B",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Cette action demande une confirmation
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#DC2626"
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

