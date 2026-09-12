import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";

import { router } from "expo-router";

import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { useContacts } from "../../ContactContext";

export default function Contact() {

  const [recherche, setRecherche] = useState("");

  const { contacts } = useContacts();

  const contactsFiltre = contacts.filter(
    (contact) =>
      contact.nom
        .toLowerCase()
        .includes(recherche.toLowerCase()) ||
      contact.telephone.includes(recherche)
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
        paddingHorizontal: 20,
      }}
    >

      {/* Notification */}

      <View
        style={{
          marginTop: 35,
          alignItems: "flex-end",
        }}
      >
        <Ionicons
          name="notifications-outline"
          size={30}
          color="white"
        />
      </View>

      {/* Titre */}

      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          Mes contacts
        </Text>

        <Text
          style={{
            color: "#BFD3E5",
            marginTop: 6,
          }}
        >
          Retrouvez facilement vos proches
        </Text>
      </View>

      {/* Recherche */}

      <View
        style={{
          height: 52,
          width: "100%",
          backgroundColor: "#F8FAFC",
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          marginBottom: 20,
        }}
      >

        <Ionicons
          name="search-outline"
          size={22}
          color="#64748B"
        />

        <TextInput
          placeholder="Rechercher un contact..."
          placeholderTextColor="#94A3B8"
          value={recherche}
          onChangeText={setRecherche}
          style={{
            flex: 1,
            color: "#0F172A",
            marginLeft: 10,
          }}
        />

      </View>

      {/* Nombre de contacts + bouton Ajouter */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >

        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
          }}
        >
          Contacts ({contacts.length})
        </Text>

        <Pressable
          onPress={() => router.push("/ajouter")}
          style={{
            backgroundColor: "#38BDF8",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >

          <Ionicons
            name="add"
            size={20}
            color="white"
          />

          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginLeft: 4,
            }}
          >
            Ajouter
          </Text>

        </Pressable>

      </View>

      {/* Liste des contacts */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        {/* Aucun contact */}

        {contactsFiltre.length === 0 && (
          <View
            style={{
              backgroundColor: "#0D4C8F",
              borderRadius: 20,
              padding: 30,
              alignItems: "center",
            }}
          >

            <Ionicons
              name="people-outline"
              size={45}
              color="#38BDF8"
            />

            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 12,
              }}
            >
              Aucun contact
            </Text>

            <Text
              style={{
                color: "#BFD3E5",
                fontSize: 14,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Ajoutez votre premier contact
              avec le bouton Ajouter.
            </Text>

          </View>
        )}

        {/* Contacts */}

        {contactsFiltre.map((contact) => (

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

            {/* Nom + téléphone */}

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

            {/* Coeur si favori */}

            {contact.favori && (
              <Ionicons
                name="heart"
                size={20}
                color="#FF5C70"
                style={{
                  marginRight: 8,
                }}
              />
            )}

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#94A3B8"
            />

          </Pressable>

        ))}

      </ScrollView>

    </View>
  );
}