
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Accueil() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A3F7A",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 45,
          paddingBottom: 25,
        }}
      >
        {/* En-tête */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 35,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/logoAncontact.png")}
              style={{
                width: 48,
                height: 48,
                marginRight: 12,
              }}
              resizeMode="contain"
            />

            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                An-Contact
              </Text>

              <Text
                style={{
                  color: "#AFC4D8",
                  fontSize: 12,
                  marginTop: 3,
                }}
              >
                Vos contacts, toujours proches
              </Text>
            </View>
          </View>

          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#15518A",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#2868A0",
            }}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={21}
              color="#38BDF8"
            />
          </View>
        </View>

        {/* Bloc de bienvenue */}
        <View
          style={{
            marginBottom: 30,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#15518A",
              paddingHorizontal: 13,
              paddingVertical: 7,
              borderRadius: 20,
              marginBottom: 17,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="sparkles-outline"
              size={15}
              color="#38BDF8"
            />

            <Text
              style={{
                color: "#BAE6FD",
                fontSize: 12,
                fontWeight: "600",
                marginLeft: 7,
              }}
            >
              Votre espace personnel
            </Text>
          </View>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: "bold",
              lineHeight: 43,
              marginBottom: 12,
            }}
          >
            Bienvenue 👋{"\n"}
            <Text
              style={{
                color: "#38BDF8",
              }}
            >
              Restons connectés.
            </Text>
          </Text>

          <Text
            style={{
              color: "#C5D7E8",
              fontSize: 15,
              lineHeight: 24,
              maxWidth: 330,
            }}
          >
            Retrouvez vos contacts, gérez vos favoris et programmez vos
            rappels en toute simplicité.
          </Text>
        </View>

        {/* Illustration principale */}
        <View
          style={{
            backgroundColor: "#0D4C8F",
            borderRadius: 24,
            padding: 22,
            marginBottom: 30,
            borderWidth: 1,
            borderColor: "#2164A0",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 19,
                  fontWeight: "bold",
                  marginBottom: 9,
                }}
              >
                Tout au même endroit
              </Text>

              <Text
                style={{
                  color: "#C5D7E8",
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                Organisez vos contacts et ne manquez plus vos appels
                importants.
              </Text>
            </View>

            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: 24,
                backgroundColor: "#155FA8",
                alignItems: "center",
                justifyContent: "center",
                transform: [{ rotate: "-5deg" }],
              }}
            >
              <Ionicons
                name="people"
                size={40}
                color="#38BDF8"
              />
            </View>
          </View>

          {/* Points forts */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 22,
              paddingTop: 17,
              borderTopWidth: 1,
              borderTopColor: "#28639A",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 18,
                marginBottom: 5,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#38BDF8"
              />

              <Text
                style={{
                  color: "#E2E8F0",
                  fontSize: 12,
                  marginLeft: 6,
                }}
              >
                Simple
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 18,
                marginBottom: 5,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#38BDF8"
              />

              <Text
                style={{
                  color: "#E2E8F0",
                  fontSize: 12,
                  marginLeft: 6,
                }}
              >
                Pratique
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#38BDF8"
              />

              <Text
                style={{
                  color: "#E2E8F0",
                  fontSize: 12,
                  marginLeft: 6,
                }}
              >
                Rapide
              </Text>
            </View>
          </View>
        </View>

        {/* Titre des raccourcis */}
        <View
          style={{
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 21,
              fontWeight: "bold",
            }}
          >
            Que souhaitez-vous faire ?
          </Text>

          <Text
            style={{
              color: "#AFC4D8",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            Accédez rapidement à vos fonctionnalités.
          </Text>
        </View>

        {/* Carte Contacts */}
        <Pressable
          onPress={() => router.push("/contact")}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir mes contacts"
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#E0F2FE" : "#FFFFFF",
            borderRadius: 20,
            padding: 19,
            marginBottom: 14,
            flexDirection: "row",
            alignItems: "center",
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View
            style={{
              width: 55,
              height: 55,
              borderRadius: 17,
              backgroundColor: "#E0F2FE",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 15,
            }}
          >
            <Ionicons
              name="people-outline"
              size={28}
              color="#0A3F7A"
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "#0F2F50",
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Mes contacts
            </Text>

            <Text
              style={{
                color: "#64748B",
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              Consulter et gérer mon répertoire
            </Text>
          </View>

          <Ionicons
            name="chevron-forward-circle"
            size={29}
            color="#0A3F7A"
          />
        </Pressable>

        {/* Carte Rappels */}
        <Pressable
          onPress={() => router.push("/rappels")}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir mes rappels"
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#124779" : "#0D4C8F",
            borderRadius: 20,
            padding: 19,
            marginBottom: 28,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#2868A0",
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View
            style={{
              width: 55,
              height: 55,
              borderRadius: 17,
              backgroundColor: "#155FA8",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 15,
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={28}
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
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              Mes rappels
            </Text>

            <Text
              style={{
                color: "#C5D7E8",
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              Programmer mes prochains appels
            </Text>
          </View>

          <Ionicons
            name="chevron-forward-circle"
            size={29}
            color="#38BDF8"
          />
        </Pressable>

        {/* Pied de page */}
        <View
          style={{
            alignItems: "center",
            paddingTop: 18,
            borderTopWidth: 1,
            borderTopColor: "#1A5288",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 7,
            }}
          >
            <Ionicons
              name="heart"
              size={13}
              color="#38BDF8"
            />

            <Text
              style={{
                color: "#AFC4D8",
                fontSize: 12,
                marginLeft: 6,
              }}
            >
              Simple • Rapide • Pratique
            </Text>
          </View>

          <Text
            style={{
              color: "#7897B5",
              fontSize: 11,
            }}
          >
            An-Contact © 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

