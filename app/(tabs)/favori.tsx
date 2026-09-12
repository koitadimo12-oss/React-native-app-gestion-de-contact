
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useContacts } from "../../ContactContext";

export default function Favori() {
  const { contacts } = useContacts();

  const favoris = contacts.filter(
    (contact) => contact.favori
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
        paddingHorizontal: 20,
      }}
    >
      {/* En-tête */}
      <View
        style={{
          marginTop: 45,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 75,
            height: 75,
            borderRadius: 38,
            backgroundColor: "#38BDF8",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 15,
          }}
        >
          <Ionicons
            name="heart"
            size={38}
            color="white"
          />
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 27,
            fontWeight: "bold",
          }}
        >
          Mes favoris
        </Text>

        <Text
          style={{
            color: "#D2E4F2",
            fontSize: 14,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Retrouvez facilement vos contacts favoris
        </Text>
      </View>

      {/* Liste */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 40,
        }}
      >
        {/* Aucun favori */}
        {favoris.length === 0 && (
          <View
            style={{
              backgroundColor: "#0D4C8F",
              borderRadius: 22,
              padding: 30,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="heart-outline"
              size={50}
              color="#38BDF8"
            />

            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 15,
              }}
            >
              Aucun favori
            </Text>

            <Text
              style={{
                color: "#BFD3E5",
                fontSize: 14,
                textAlign: "center",
                marginTop: 8,
                lineHeight: 21,
              }}
            >
              Ajoutez des contacts aux favoris
              pour les retrouver rapidement.
            </Text>
          </View>
        )}

        {/* Contacts favoris */}
        {favoris.map((contact) => (
          <Pressable
            key={contact.id}
            onPress={() =>
              router.push({
                pathname: "/[id]",
                params: {
                  id: contact.id,
                },
              })
            }
            style={{
              backgroundColor: "white",
              padding: 15,
              marginBottom: 12,
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: "#E0F2FE",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 13,
              }}
            >
              <Text
                style={{
                  color: "#0A3F7A",
                  fontSize: 21,
                  fontWeight: "bold",
                }}
              >
                {contact.nom
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            {/* Informations */}
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#0F172A",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {contact.nom}
              </Text>

              <Text
                style={{
                  color: "#64748B",
                  marginTop: 5,
                }}
              >
                {contact.telephone}
              </Text>
            </View>

            {/* Cœur */}
            <Ionicons
              name="heart"
              size={24}
              color="#FF5C70"
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

