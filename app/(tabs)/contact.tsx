
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

// Formater les numéros de téléphone sénégalais
function formaterTelephone(telephone: string) {
  const chiffres = telephone.replace(/\D/g, "");

  let numeroLocal = chiffres;

  if (chiffres.length === 12 && chiffres.startsWith("221")) {
    numeroLocal = chiffres.slice(3);
  }

  if (numeroLocal.length === 9) {
    return numeroLocal.replace(
      /(\d{2})(\d{3})(\d{2})(\d{2})/,
      "$1 $2 $3 $4"
    );
  }

  return telephone;
}

export default function Contact() {
  const [recherche, setRecherche] = useState("");

  const { contacts } = useContacts();

  const rechercheNettoyee = recherche
    .trim()
    .toLowerCase();

  const chiffresRecherche = recherche.replace(/\D/g, "");

  const contactsFiltre = contacts.filter((contact) => {
    const nomCorrespond = contact.nom
      .toLowerCase()
      .includes(rechercheNettoyee);

    const telephoneNettoye = contact.telephone.replace(/\D/g, "");

    const telephoneCorrespond =
      chiffresRecherche.length > 0 &&
      telephoneNettoye.includes(chiffresRecherche);

    const categorieCorrespond = contact.categorie
      ? contact.categorie.toLowerCase().includes(rechercheNettoyee)
      : false;

    return (
      !rechercheNettoyee ||
      nomCorrespond ||
      telephoneCorrespond ||
      categorieCorrespond
    );
  });

  const nombreFavoris = contacts.filter(
    (contact) => contact.favori
  ).length;

  const rechercheActive = rechercheNettoyee.length > 0;

  const ouvrirContact = (id: number) => {
    router.push({
      pathname: "/[id]",
      params: {
        id: String(id),
      },
    });
  };

  const ouvrirRappels = () => {
    router.push("/rappels");
  };

  const ouvrirAjout = () => {
    router.push("/ajouter");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#071D35",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* EN-TÊTE */}

        <View
          style={{
            backgroundColor: "#0A3F7A",
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 28,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          {/* BARRE DU HAUT */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: "#14508A",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: "#3475AC",
                }}
              >
                <Ionicons
                  name="people"
                  size={25}
                  color="#7DD3FC"
                />
              </View>

              <View>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  An-contact
                </Text>

                <Text
                  style={{
                    color: "#C5D9EB",
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  Ton carnet de contacts
                </Text>
              </View>
            </View>

            <Pressable
              onPress={ouvrirRappels}
              accessibilityRole="button"
              accessibilityLabel="Voir tous mes rappels"
              style={({ pressed }) => ({
                width: 47,
                height: 47,
                borderRadius: 15,
                backgroundColor: pressed
                  ? "#24649C"
                  : "#14508A",
                borderWidth: 1,
                borderColor: "#3475AC",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons
                name="alarm-outline"
                size={25}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          {/* TITRE */}

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: "bold",
              letterSpacing: 0.2,
            }}
          >
            Mes contacts
          </Text>

          <Text
            style={{
              color: "#C5D9EB",
              fontSize: 14,
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            Retrouvez facilement les personnes qui comptent pour vous.
          </Text>

          {/* STATISTIQUES */}

          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
            }}
          >
            {/* NOMBRE DE CONTACTS */}

            <View
              style={{
                flex: 1,
                backgroundColor: "#14508A",
                borderRadius: 18,
                padding: 15,
                borderWidth: 1,
                borderColor: "#28639B",
                marginRight: 8,
              }}
            >
              <View
                style={{
                  width: 39,
                  height: 39,
                  borderRadius: 13,
                  backgroundColor: "#1D619B",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="people-outline"
                  size={22}
                  color="#7DD3FC"
                />
              </View>

              <Text
                style={{
                  color: "#C5D9EB",
                  fontSize: 12,
                }}
              >
                Contacts
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 26,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                {contacts.length}
              </Text>
            </View>

            {/* NOMBRE DE FAVORIS */}

            <View
              style={{
                flex: 1,
                backgroundColor: "#14508A",
                borderRadius: 18,
                padding: 15,
                borderWidth: 1,
                borderColor: "#28639B",
                marginLeft: 8,
              }}
            >
              <View
                style={{
                  width: 39,
                  height: 39,
                  borderRadius: 13,
                  backgroundColor: "#49283C",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="heart"
                  size={22}
                  color="#FF718A"
                />
              </View>

              <Text
                style={{
                  color: "#C5D9EB",
                  fontSize: 12,
                }}
              >
                Favoris
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 26,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                {nombreFavoris}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENU PRINCIPAL */}

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 25,
          }}
        >
          {/* BARRE DE RECHERCHE */}

          <View
            style={{
              minHeight: 56,
              backgroundColor: "#102F4D",
              borderRadius: 17,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: "#254866",
              marginBottom: 27,
            }}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color="#7DD3FC"
            />

            <TextInput
              placeholder="Nom, numéro ou catégorie..."
              placeholderTextColor="#8EA7BE"
              value={recherche}
              onChangeText={setRecherche}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                flex: 1,
                color: "#FFFFFF",
                marginLeft: 11,
                paddingVertical: 14,
                fontSize: 14,
              }}
            />

            {recherche.length > 0 && (
              <Pressable
                onPress={() => setRecherche("")}
                accessibilityRole="button"
                accessibilityLabel="Effacer la recherche"
                hitSlop={10}
                style={{
                  padding: 5,
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color="#94AFC7"
                />
              </Pressable>
            )}
          </View>

          {/* TITRE ET BOUTON AJOUTER */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <View
              style={{
                flex: 1,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {rechercheActive
                  ? "Résultats"
                  : "Tous les contacts"}
              </Text>

              <Text
                style={{
                  color: "#94AFC7",
                  fontSize: 12,
                  marginTop: 5,
                }}
              >
                {contactsFiltre.length} résultat
                {contactsFiltre.length !== 1 ? "s" : ""}
                {rechercheActive ? " trouvé" : ""}
                {rechercheActive && contactsFiltre.length !== 1
                  ? "s"
                  : ""}
              </Text>
            </View>

            <Pressable
              onPress={ouvrirAjout}
              accessibilityRole="button"
              accessibilityLabel="Ajouter un contact"
              style={({ pressed }) => ({
                backgroundColor: "#38BDF8",
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [
                  {
                    scale: pressed ? 0.97 : 1,
                  },
                ],
              })}
            >
              <Ionicons
                name="add"
                size={21}
                color="#07345D"
              />

              <Text
                style={{
                  color: "#07345D",
                  fontWeight: "bold",
                  fontSize: 14,
                  marginLeft: 4,
                }}
              >
                Ajouter
              </Text>
            </Pressable>
          </View>

          {/* ÉTAT VIDE */}

          {contactsFiltre.length === 0 && (
            <View
              style={{
                backgroundColor: "#102F4D",
                borderRadius: 23,
                paddingHorizontal: 22,
                paddingVertical: 34,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#254866",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 27,
                  backgroundColor: "#174A72",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 19,
                }}
              >
                <Ionicons
                  name={
                    rechercheActive
                      ? "search-outline"
                      : "people-outline"
                  }
                  size={39}
                  color="#38BDF8"
                />
              </View>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {rechercheActive
                  ? "Aucun résultat"
                  : "Ton carnet est vide"}
              </Text>

              <Text
                style={{
                  color: "#A9C0D5",
                  fontSize: 14,
                  lineHeight: 22,
                  textAlign: "center",
                  marginTop: 10,
                  marginBottom: 23,
                }}
              >
                {rechercheActive
                  ? "Aucun contact ne correspond à ta recherche. Essaie un autre nom ou numéro."
                  : "Ajoute ton premier contact pour retrouver facilement ses coordonnées et créer des rappels."}
              </Text>

              {rechercheActive ? (
                <Pressable
                  onPress={() => setRecherche("")}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    backgroundColor: "#174A72",
                    borderWidth: 1,
                    borderColor: "#38BDF8",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: pressed ? 0.75 : 1,
                  })}
                >
                  <Ionicons
                    name="close-outline"
                    size={19}
                    color="#7DD3FC"
                  />

                  <Text
                    style={{
                      color: "#7DD3FC",
                      fontWeight: "bold",
                      marginLeft: 7,
                    }}
                  >
                    Effacer la recherche
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={ouvrirAjout}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    backgroundColor: "#38BDF8",
                    paddingHorizontal: 20,
                    paddingVertical: 13,
                    borderRadius: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={20}
                    color="#07345D"
                  />

                  <Text
                    style={{
                      color: "#07345D",
                      fontWeight: "bold",
                      marginLeft: 8,
                  }}
                  >
                    Ajouter mon premier contact
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* LISTE DES CONTACTS */}

          {contactsFiltre.map((contact) => (
            <Pressable
              key={contact.id}
              onPress={() => ouvrirContact(contact.id)}
              accessibilityRole="button"
              accessibilityLabel={`Ouvrir la fiche de ${contact.nom}`}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? "#19466B"
                  : "#102F4D",
                padding: 15,
                marginBottom: 13,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: pressed
                  ? "#38BDF8"
                  : "#254866",
                opacity: pressed ? 0.92 : 1,
              })}
            >
              {/* AVATAR */}

              <View
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 18,
                  backgroundColor: "#DFF4FF",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 13,
                }}
              >
                <Text
                  style={{
                    color: "#0A3F7A",
                    fontSize: 23,
                    fontWeight: "bold",
                  }}
                >
                  {contact.nom.trim().charAt(0).toUpperCase() || "?"}
                </Text>
              </View>

              {/* NOM, TÉLÉPHONE ET CATÉGORIE */}

              <View
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {contact.nom}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 7,
                  }}
                >
                  <Ionicons
                    name="call-outline"
                    size={14}
                    color="#8EAFCB"
                  />

                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#A9C0D5",
                      fontSize: 13,
                      marginLeft: 6,
                      flexShrink: 1,
                    }}
                  >
                    {formaterTelephone(contact.telephone)}
                  </Text>
                </View>

                {contact.categorie ? (
                  <View
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "#174A72",
                      paddingHorizontal: 9,
                      paddingVertical: 4,
                      borderRadius: 8,
                      marginTop: 8,
                      maxWidth: "100%",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#7DD3FC",
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                    >
                      {contact.categorie}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* FAVORI */}

              {contact.favori && (
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: "#49283C",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  <Ionicons
                    name="heart"
                    size={18}
                    color="#FF718A"
                  />
                </View>
              )}

              {/* FLÈCHE */}

              <View
                style={{
                  width: 31,
                  height: 31,
                  borderRadius: 10,
                  backgroundColor: "#174A72",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#7DD3FC"
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

