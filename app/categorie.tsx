import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

const categories = [
  {
    nom: "Université",
    description: "Études et formation",
    icon: "school-outline",
  },
  {
    nom: "Travail",
    description: "Collègues et relations professionnelles",
    icon: "briefcase-outline",
  },
  {
    nom: "Famille",
    description: "Membres de la famille",
    icon: "people-outline",
  },
  {
    nom: "Ami",
    description: "Amis et proches",
    icon: "heart-outline",
  },
  {
    nom: "Client",
    description: "Clients et relations commerciales",
    icon: "handshake-outline",
  },
  {
    nom: "Autre",
    description: "Autres relations",
    icon: "pricetag-outline",
  },
];

export default function Categorie() {
  const choisirCategorie = (categorie: string) => {
    router.replace({
      pathname: "/ajouter",
      params: {
        categorie,
      },
    });
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
            marginTop: 50,
            marginBottom: 35,
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
              marginBottom: 25,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
            />
          </Pressable>

          {/* TITRE */}

          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            Choisir une catégorie
          </Text>

          <Text
            style={{
              color: "#D9EAF7",
              fontSize: 15,
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            Quel type de relation avez-vous avec
            ce contact ?
          </Text>
        </View>

        {/* CATÉGORIES */}

        <View
          style={{
            gap: 12,
          }}
        >
          {categories.map((categorie) => (
            <Pressable
              key={categorie.nom}
              onPress={() =>
                choisirCategorie(categorie.nom)
              }
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: 18,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* ICÔNE */}

              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: "#E0F2FE",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={categorie.icon as any}
                  size={27}
                  color="#0A3F7A"
                />
              </View>

              {/* NOM + DESCRIPTION */}

              <View
                style={{
                  flex: 1,
                  marginLeft: 15,
                }}
              >
                <Text
                  style={{
                    color: "#0F172A",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  {categorie.nom}
                </Text>

                <Text
                  style={{
                    color: "#64748B",
                    fontSize: 13,
                    marginTop: 4,
                    lineHeight: 18,
                  }}
                >
                  {categorie.description}
                </Text>
              </View>

              {/* FLÈCHE */}

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#94A3B8"
              />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}