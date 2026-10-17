import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COULEURS = {
  fond: "#E8EDF5",
  primaire: "#17365D",
  secondaire: "#3978B8",
  blanc: "#F8FAFD",
  texte: "#17263C",
  texteSecondaire: "#68788F",
  bordure: "#D6DFEB",
  bleuFond: "#DFEAF8",
  vert: "#16805D",
  vertFond: "#DDF5E9",
};

export default function AccueilScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COULEURS.fond}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contenu}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="people"
              size={25}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerTexte}>
            <Text style={styles.nomApplication}>
              An-contact
            </Text>

            <Text style={styles.sousTitre}>
              Ton carnet de contacts intelligent
            </Text>
          </View>

          <View style={styles.indicateur}>
            <View style={styles.indicateurPoint} />
          </View>
        </View>

        {/* Bienvenue */}
        <View style={styles.bienvenue}>
          <View style={styles.bienvenueTexte}>
            <Text style={styles.bonjour}>
              Bonjour 👋
            </Text>

            <Text style={styles.titreBienvenue}>
              Bienvenue sur An-contact
            </Text>

            <Text style={styles.descriptionBienvenue}>
              Retrouve facilement tes contacts et organise
              tes rappels au quotidien.
            </Text>
          </View>

          <View style={styles.illustration}>
            <Ionicons
              name="person-circle-outline"
              size={63}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Section raccourcis */}
        <View style={styles.sectionEntete}>
          <View>
            <Text style={styles.sectionTitre}>
              Accès rapide
            </Text>

            <Text style={styles.sectionDescription}>
              Toutes tes fonctionnalités au même endroit.
            </Text>
          </View>
        </View>

        {/* Contacts */}
        <TouchableOpacity
          style={styles.carteAction}
          onPress={() => router.push("/(tabs)/contact")}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcone,
              { backgroundColor: COULEURS.bleuFond },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={25}
              color={COULEURS.primaire}
            />
          </View>

          <View style={styles.actionTexte}>
            <Text style={styles.actionTitre}>
              Mes contacts
            </Text>

            <Text style={styles.actionDescription}>
              Consulte et retrouve tes contacts enregistrés.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COULEURS.texteSecondaire}
          />
        </TouchableOpacity>

        {/* Favoris */}
        <TouchableOpacity
          style={styles.carteAction}
          onPress={() => router.push("/(tabs)/favori")}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcone,
              { backgroundColor: "#FBE5E8" },
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={24}
              color="#C83C4A"
            />
          </View>

          <View style={styles.actionTexte}>
            <Text style={styles.actionTitre}>
              Mes favoris
            </Text>

            <Text style={styles.actionDescription}>
              Accède rapidement aux contacts importants.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COULEURS.texteSecondaire}
          />
        </TouchableOpacity>

        {/* Rappels */}
        <TouchableOpacity
          style={styles.carteAction}
          onPress={() => router.push("/rappels")}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcone,
              { backgroundColor: "#FCEBD5" },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#B96B16"
            />
          </View>

          <View style={styles.actionTexte}>
            <Text style={styles.actionTitre}>
              Mes rappels
            </Text>

            <Text style={styles.actionDescription}>
              Planifie tes appels et tes suivis importants.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COULEURS.texteSecondaire}
          />
        </TouchableOpacity>

        {/* Ajouter un contact */}
        <TouchableOpacity
          style={styles.boutonAjouter}
          onPress={() => router.push("/ajouter")}
          activeOpacity={0.85}
        >
          <Ionicons
            name="person-add-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.boutonAjouterTexte}>
            Ajouter un contact
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Conseil */}
        <View style={styles.conseil}>
          <View style={styles.conseilIcone}>
            <Ionicons
              name="bulb-outline"
              size={21}
              color={COULEURS.primaire}
            />
          </View>

          <View style={styles.conseilTexte}>
            <Text style={styles.conseilTitre}>
              Petit conseil
            </Text>

            <Text style={styles.conseilDescription}>
              Ajoute tes contacts importants aux favoris
              pour les retrouver plus rapidement.
            </Text>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color={COULEURS.texteSecondaire}
          />

          <Text style={styles.footerTexte}>
            An-contact · Tes contacts, simplement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COULEURS.fond,
  },

  contenu: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 23,
  },

  logo: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COULEURS.primaire,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTexte: {
    flex: 1,
    marginLeft: 11,
  },

  nomApplication: {
    color: COULEURS.primaire,
    fontSize: 19,
    fontWeight: "900",
  },

  sousTitre: {
    color: COULEURS.texteSecondaire,
    fontSize: 10,
    marginTop: 3,
  },

  indicateur: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: COULEURS.vertFond,
    alignItems: "center",
    justifyContent: "center",
  },

  indicateurPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COULEURS.vert,
  },

  bienvenue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COULEURS.primaire,
    borderRadius: 22,
    padding: 18,
    marginBottom: 26,
    overflow: "hidden",
  },

  bienvenueTexte: {
    flex: 1,
    paddingRight: 8,
  },

  bonjour: {
    color: "#B9D9FF",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
  },

  titreBienvenue: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 27,
  },

  descriptionBienvenue: {
    color: "#DCE8F7",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 9,
  },

  illustration: {
    width: 69,
    height: 69,
    borderRadius: 23,
    backgroundColor: "#2B4B70",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionEntete: {
    marginBottom: 14,
  },

  sectionTitre: {
    color: COULEURS.texte,
    fontSize: 19,
    fontWeight: "900",
  },

  sectionDescription: {
    color: COULEURS.texteSecondaire,
    fontSize: 11,
    marginTop: 5,
  },

  carteAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COULEURS.blanc,
    borderWidth: 1,
    borderColor: COULEURS.bordure,
    borderRadius: 17,
    padding: 13,
    marginBottom: 11,
  },

  actionIcone: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTexte: {
    flex: 1,
    marginLeft: 12,
    marginRight: 7,
  },

  actionTitre: {
    color: COULEURS.texte,
    fontSize: 13,
    fontWeight: "800",
  },

  actionDescription: {
    color: COULEURS.texteSecondaire,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  boutonAjouter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COULEURS.primaire,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 5,
  },

  boutonAjouterTexte: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  conseil: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E0E9F5",
    borderRadius: 15,
    padding: 13,
    marginTop: 22,
    borderWidth: 1,
    borderColor: COULEURS.bordure,
  },

  conseilIcone: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: COULEURS.blanc,
    alignItems: "center",
    justifyContent: "center",
  },

  conseilTexte: {
    flex: 1,
    marginLeft: 10,
  },

  conseilTitre: {
    color: COULEURS.primaire,
    fontSize: 12,
    fontWeight: "800",
  },

  conseilDescription: {
    color: COULEURS.texteSecondaire,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 23,
  },

  footerTexte: {
    color: COULEURS.texteSecondaire,
    fontSize: 10,
  },
});