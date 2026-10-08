import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Accueil() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
        paddingHorizontal: 25,
      }}
    >
      {/* Contenu principal */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo An-Contact */}
        <Image
          source={require("../../assets/images/logoAncontact.png")}
          style={{
            width: 110,
            height: 110,
            marginBottom: 25,
          }}
          resizeMode="contain"
        />

        {/* Nom de l'application */}
        <Text
          style={{
            color: "#38BDF8",
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: 1,
            marginBottom: 15,
          }}
        >
          An-Contact
        </Text>

        {/* Bienvenue */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          Bienvenue 👋
        </Text>

        {/* Description */}
        <Text
          style={{
            color: "#E2E8F0",
            fontSize: 18,
            textAlign: "center",
            lineHeight: 26,
            marginBottom: 8,
          }}
        >
          Tous vos contacts,
          {"\n"}
          au même endroit.
        </Text>

        <Text
          style={{
            color: "#AFC4D8",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 21,
            maxWidth: 320,
            marginBottom: 30,
          }}
        >
          Recherchez, appelez et contactez vos proches
          rapidement et simplement.
        </Text>

        {/* Carte */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#0D4C8F",
            borderRadius: 22,
            padding: 20,
            marginBottom: 25,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#155FA8",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 15,
            }}
          >
            <Ionicons
              name="flash-outline"
              size={25}
              color="#38BDF8"
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 4,
              }}
            >
              Simple et rapide
            </Text>

            <Text
              style={{
                color: "#BFD3E5",
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              Accédez à vos contacts en quelques secondes.
            </Text>
          </View>
        </View>

        {/* Bouton */}
        <Pressable
          onPress={() => router.push("/contact")}
          style={{
            width: "100%",
            backgroundColor: "#38BDF8",
            paddingVertical: 17,
            borderRadius: 15,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="people-outline"
            size={22}
            color="white"
          />

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Voir mes contacts
          </Text>
        </Pressable>
      </View>
      
{/*test simple des alert*/}

    {/*<Pressable onPress={()=>router.push("/alert")} style={{
        width: "100%",
            backgroundColor: "#38BDF8",
            paddingVertical: 17,
            borderRadius: 15,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
      }}
      >

      <Text style={{
        color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 10,
      }}>
        Supprimer
      </Text>

      </Pressable> /*}

      {/* Slogan */}
      <View
        style={{
          alignItems: "center",
          paddingBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#94A3B8",
            fontSize: 13,
          }}
        >
          Simple • Rapide • Pratique
        </Text>

        <Text
          style={{
            color: "#64748B",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          An-Contact
        </Text>
      </View>
    </View>
  );
}