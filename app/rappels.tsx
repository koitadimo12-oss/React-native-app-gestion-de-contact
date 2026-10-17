
import React, { useCallback, useMemo, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, RefreshControl, Alert, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { api } from "@/services/api";

type Rappel = {
  id: number;
  titre: string;
  dateHeure: string;
  effectue: boolean;
  contact: { id: number; nom: string; telephone: string } | null;
};

type Filtre = "tous" | "avenir" | "effectues";

const C = {
  primaire: "#17365D", secondaire: "#3978B8", fond: "#E8EDF5",
  blanc: "#F8FAFD", texte: "#17263C", gris: "#68788F",
  bordure: "#D6DFEB", vert: "#16805D", vertFond: "#DDF5E9",
  orange: "#B96B16", orangeFond: "#FCEBD5", rouge: "#C83C4A",
  rougeFond: "#FBE5E8", bleuFond: "#DFEAF8",
};

// Afficher les numéros sénégalais sous la forme 77 777 77 77.
const formaterTelephone = (telephone: string) => {
  const chiffres = telephone.replace(/\D/g, "");
  const numero = chiffres.startsWith("221") && chiffres.length === 12
    ? chiffres.slice(3)
    : chiffres;

  return numero.length === 9
    ? `${numero.slice(0, 2)} ${numero.slice(2, 5)} ${numero.slice(5, 7)} ${numero.slice(7)}`
    : telephone;
};

export default function RappelsScreen() {
  const router = useRouter();
  const [rappels, setRappels] = useState<Rappel[]>([]);
  const [chargement, setChargement] = useState(true);
  const [actualisation, setActualisation] = useState(false);
  const [erreur, setErreur] = useState("");
  const [suppressionId, setSuppressionId] = useState<number | null>(null);
  const [filtre, setFiltre] = useState<Filtre>("tous");

  // Charger les rappels depuis le backend.
  const chargerRappels = useCallback(async (silencieux = false) => {
    silencieux ? setActualisation(true) : setChargement(true);
    setErreur("");

    try {
      const { data } = await api.get<Rappel[]>("/rappels");
      setRappels(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur chargement rappels :", e);
      setErreur("Impossible de charger les rappels. Vérifie ta connexion.");
    } finally {
      setChargement(false);
      setActualisation(false);
    }
  }, []);

  // Actualiser à chaque ouverture de l'écran.
  useFocusEffect(useCallback(() => {
    chargerRappels();
  }, [chargerRappels]));

  const estEffectue = (r: Rappel) => r.effectue;
  const estEnRetard = (r: Rappel) =>
    !r.effectue && new Date(r.dateHeure).getTime() < Date.now();
  const estAVenir = (r: Rappel) =>
    !r.effectue && new Date(r.dateHeure).getTime() >= Date.now();

  const nombreAVenir = rappels.filter(estAVenir).length;
  const nombreEffectues = rappels.filter(estEffectue).length;
  const nombreEnRetard = rappels.filter(estEnRetard).length;

  // Filtrer et trier les rappels par date.
  const rappelsFiltres = useMemo(() => {
    const liste = rappels.filter(r =>
      filtre === "tous" ||
      (filtre === "avenir" && estAVenir(r)) ||
      (filtre === "effectues" && r.effectue)
    );

    return liste.sort((a, b) =>
      filtre === "effectues"
        ? new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime()
        : new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime()
    );
  }, [rappels, filtre]);

  // Formater la date et l'heure.
  const obtenirDate = (valeur: string) => {
    const date = new Date(valeur);

    if (Number.isNaN(date.getTime())) {
      return { complete: "Date indisponible", heure: "--:--" };
    }

    const aujourdHui = new Date();
    const demain = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    demain.setDate(demain.getDate() + 1);
    demain.setHours(0, 0, 0, 0);

    const jour = new Date(date);
    jour.setHours(0, 0, 0, 0);

    const complete = jour.getTime() === aujourdHui.getTime()
      ? "Aujourd'hui"
      : jour.getTime() === demain.getTime()
        ? "Demain"
        : date.toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          });

    return {
      complete,
      heure: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit", minute: "2-digit",
      }),
    };
  };

  // Déterminer le statut du rappel.
  const obtenirStatut = (r: Rappel) => {
    if (r.effectue) {
      return { texte: "Effectué", couleur: C.vert, fond: C.vertFond };
    }
    if (estEnRetard(r)) {
      return { texte: "En retard", couleur: C.orange, fond: C.orangeFond };
    }
    return { texte: "À venir", couleur: C.secondaire, fond: C.bleuFond };
  };

  // Ouvrir le formulaire de modification.
  const modifierRappel = (r: Rappel) => {
    if (!r.contact) {
      Alert.alert("Contact indisponible", "Ce rappel n'a pas de contact associé.");
      return;
    }

    router.push({
      pathname: "/modifierRappel",
      params: {
        id: String(r.id),
        titre: r.titre,
        dateHeure: r.dateHeure,
        contactId: String(r.contact.id),
        contactNom: r.contact.nom,
      },
    });
  };

  // Supprimer après confirmation.
  const supprimerRappel = (r: Rappel) => {
    Alert.alert("Supprimer le rappel", `Supprimer « ${r.titre} » ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setSuppressionId(r.id);
          try {
            await api.delete(`/rappels/${r.id}`);
            setRappels(anciens => anciens.filter(item => item.id !== r.id));
          } catch (e) {
            console.error("Erreur suppression :", e);
            Alert.alert("Erreur", "Impossible de supprimer ce rappel.");
          } finally {
            setSuppressionId(null);
          }
        },
      },
    ]);
  };

  // Bouton de filtre réutilisable.
  const boutonFiltre = (valeur: Filtre, titre: string, nombre: number) => {
    const actif = filtre === valeur;

    return (
      <TouchableOpacity
        key={valeur}
        style={[s.filtre, actif && s.filtreActif]}
        onPress={() => setFiltre(valeur)}
        activeOpacity={0.8}
      >
        <Text style={[s.filtreTexte, actif && s.filtreTexteActif]}>
          {titre}
        </Text>
        <View style={[s.filtreNombre, actif && s.filtreNombreActif]}>
          <Text style={[s.filtreNombreTexte, actif && s.filtreNombreTexteActif]}>
            {nombre}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Afficher une carte de rappel.
  const carteRappel = (r: Rappel) => {
    const date = obtenirDate(r.dateHeure);
    const statut = obtenirStatut(r);
    const suppression = suppressionId === r.id;

    return (
      <View key={r.id} style={s.carte}>
        <View style={s.enteteCarte}>
          <View style={s.icone}>
            <Ionicons
              name={r.effectue ? "checkmark-done-outline" : "notifications-outline"}
              size={21}
              color={C.primaire}
            />
          </View>

          <View style={s.flex}>
            <Text style={s.titreCarte} numberOfLines={2}>{r.titre}</Text>
            <Text style={s.sousTitre}>Rappel de contact</Text>
          </View>

          <View style={[s.badge, { backgroundColor: statut.fond }]}>
            <Text style={{ color: statut.couleur, fontSize: 10, fontWeight: "800" }}>
              {statut.texte}
            </Text>
          </View>
        </View>

        {/* Date et heure */}
        <View style={s.dateBloc}>
          <Ionicons name="calendar-outline" size={18} color={C.primaire} />
          <View style={s.flex}>
            <Text style={s.label}>DATE</Text>
            <Text style={s.valeur}>{date.complete}</Text>
          </View>
          <Ionicons name="time-outline" size={18} color={C.primaire} />
          <Text style={s.valeur}>{date.heure}</Text>
        </View>

        {/* Contact associé */}
        <View style={s.contactBloc}>
          <Ionicons name="person-circle-outline" size={27} color={C.primaire} />
          <View style={s.flex}>
            <Text style={s.label}>CONTACT ASSOCIÉ</Text>
            <Text style={s.contactNom} numberOfLines={1}>
              {r.contact?.nom || "Contact indisponible"}
            </Text>
            {!!r.contact?.telephone && (
              <Text style={s.sousTitre}>
                {formaterTelephone(r.contact.telephone)}
              </Text>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.boutonModifier}
            onPress={() => modifierRappel(r)}
            disabled={suppression}
          >
            <Ionicons name="create-outline" size={16} color={C.primaire} />
            <Text style={s.texteModifier}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.boutonSupprimer}
            onPress={() => supprimerRappel(r)}
            disabled={suppression}
          >
            {suppression ? (
              <ActivityIndicator size="small" color={C.rouge} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={15} color={C.rouge} />
                <Text style={s.texteSupprimer}>Supprimer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.fond} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.contenu}
        refreshControl={
          <RefreshControl
            refreshing={actualisation}
            onRefresh={() => chargerRappels(true)}
            tintColor={C.primaire}
          />
        }
      >
        {/* En-tête */}
        <View style={s.entete}>
          <View style={s.flex}>
            <Text style={s.surTitre}>ORGANISATION</Text>
            <Text style={s.titrePage}>Mes rappels</Text>
            <Text style={s.description}>N'oublie plus les personnes importantes.</Text>
          </View>
          <TouchableOpacity
            style={s.boutonActualiser}
            onPress={() => chargerRappels(true)}
            accessibilityLabel="Actualiser les rappels"
          >
            <Ionicons name="refresh-outline" size={21} color={C.primaire} />
          </TouchableOpacity>
        </View>

        {/* Statistiques */}
        <View style={s.resume}>
          <Text style={s.resumeTitre}>Ton planning</Text>
          <Text style={s.resumeDescription}>Garde le contrôle de tes rappels.</Text>

          <View style={s.stats}>
            {[
              { nombre: rappels.length, titre: "Total" },
              { nombre: nombreAVenir, titre: "À venir" },
              { nombre: nombreEffectues, titre: "Effectués" },
            ].map(stat => (
              <View key={stat.titre} style={s.stat}>
                <Text style={s.statNombre}>{stat.nombre}</Text>
                <Text style={s.statTitre}>{stat.titre}</Text>
              </View>
            ))}
          </View>

          {nombreEnRetard > 0 && (
            <Text style={s.retard}>⚠ {nombreEnRetard} rappel(s) en retard</Text>
          )}
        </View>

        {/* Accès à la création */}
        <TouchableOpacity
          style={s.ajouter}
          onPress={() => router.push("/ajouterRappel")}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={29} color={C.primaire} />
          <View style={s.flex}>
            <Text style={s.ajouterTitre}>Nouveau rappel</Text>
            <Text style={s.sousTitre}>Planifier un appel ou un suivi</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.primaire} />
        </TouchableOpacity>

        {/* Liste et filtres */}
        <View style={s.sectionEntete}>
          <View style={s.flex}>
            <Text style={s.sectionTitre}>Tes rappels</Text>
            <Text style={s.description}>Retrouve tous tes rendez-vous.</Text>
          </View>
          <Text style={s.compteur}>{rappelsFiltres.length}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtres}>
          {boutonFiltre("tous", "Tous", rappels.length)}
          {boutonFiltre("avenir", "À venir", nombreAVenir)}
          {boutonFiltre("effectues", "Effectués", nombreEffectues)}
        </ScrollView>

        {chargement ? (
          <View style={s.etat}>
            <ActivityIndicator size="large" color={C.primaire} />
            <Text style={s.etatTexte}>Chargement des rappels...</Text>
          </View>
        ) : erreur ? (
          <View style={s.etat}>
            <Ionicons name="cloud-offline-outline" size={30} color={C.rouge} />
            <Text style={s.etatTitre}>Une erreur est survenue</Text>
            <Text style={s.etatTexte}>{erreur}</Text>
            <TouchableOpacity style={s.reessayer} onPress={() => chargerRappels()}>
              <Text style={s.texteReessayer}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : rappelsFiltres.length === 0 ? (
          <View style={s.etat}>
            <Ionicons name="calendar-clear-outline" size={34} color={C.primaire} />
            <Text style={s.etatTitre}>
              {filtre === "effectues" ? "Aucun rappel effectué"
                : filtre === "avenir" ? "Aucun rappel à venir"
                : "Aucun rappel pour le moment"}
            </Text>
            <Text style={s.etatTexte}>
              {filtre === "tous"
                ? "Ajoute un rappel pour ne pas oublier un appel important."
                : "Les rappels correspondants apparaîtront ici."}
            </Text>
            {filtre === "tous" && (
              <TouchableOpacity
                style={s.reessayer}
                onPress={() => router.push("/ajouterRappel")}
              >
                <Text style={s.texteReessayer}>+ Créer un rappel</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={s.liste}>{rappelsFiltres.map(carteRappel)}</View>
        )}

        {/* Pied de page */}
        <Text style={s.pied}>Tes rappels sont associés à tes contacts.</Text>
      </ScrollView>
    </View>
  );
}

// Styles compacts de l'écran.
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.fond },
  contenu: { padding: 18, paddingBottom: 35 },
  flex: { flex: 1 },
  entete: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  surTitre: { color: C.secondaire, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  titrePage: { color: C.texte, fontSize: 27, fontWeight: "900", marginTop: 4 },
  description: { color: C.gris, fontSize: 12, marginTop: 5 },
  boutonActualiser: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: C.blanc,
    borderWidth: 1, borderColor: C.bordure, alignItems: "center", justifyContent: "center",
  },
  resume: { backgroundColor: C.primaire, borderRadius: 19, padding: 17, marginBottom: 13 },
  resumeTitre: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  resumeDescription: { color: "#DCE8F7", fontSize: 11, marginTop: 4 },
  stats: { flexDirection: "row", marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#49617D" },
  stat: { flex: 1, alignItems: "center" },
  statNombre: { color: "#FFF", fontSize: 22, fontWeight: "900" },
  statTitre: { color: "#DCE8F7", fontSize: 11, marginTop: 3 },
  retard: { color: "#FFD5A6", fontSize: 11, marginTop: 13 },
  ajouter: {
    flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: C.blanc,
    padding: 12, borderRadius: 15, borderWidth: 1, borderColor: C.bordure, marginBottom: 24,
  },
  ajouterTitre: { color: C.texte, fontSize: 13, fontWeight: "800" },
  sousTitre: { color: C.gris, fontSize: 11, marginTop: 3 },
  sectionEntete: { flexDirection: "row", alignItems: "center", marginBottom: 13 },
  sectionTitre: { color: C.texte, fontSize: 19, fontWeight: "900" },
  compteur: { color: C.primaire, backgroundColor: C.bleuFond, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7, fontWeight: "800" },
  filtres: { gap: 8, paddingBottom: 14 },
  filtre: {
    flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 12,
    paddingVertical: 8, backgroundColor: C.blanc, borderWidth: 1, borderColor: C.bordure, borderRadius: 10,
  },
  filtreActif: { backgroundColor: C.primaire, borderColor: C.primaire },
  filtreTexte: { color: C.gris, fontSize: 12, fontWeight: "700" },
  filtreTexteActif: { color: "#FFF" },
  filtreNombre: { minWidth: 20, alignItems: "center", backgroundColor: C.fond, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  filtreNombreActif: { backgroundColor: "#49617D" },
  filtreNombreTexte: { color: C.gris, fontSize: 10, fontWeight: "800" },
  filtreNombreTexteActif: { color: "#FFF" },
  liste: { gap: 11 },
  carte: { backgroundColor: C.blanc, borderRadius: 17, padding: 13, borderWidth: 1, borderColor: C.bordure },
  enteteCarte: { flexDirection: "row", alignItems: "center", gap: 9 },
  icone: { width: 39, height: 39, borderRadius: 12, backgroundColor: C.bleuFond, alignItems: "center", justifyContent: "center" },
  titreCarte: { color: C.texte, fontSize: 13, fontWeight: "800" },
  badge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  dateBloc: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EEF2F8", borderRadius: 11, padding: 10, marginTop: 13 },
  label: { color: C.gris, fontSize: 9, fontWeight: "800", marginBottom: 3 },
  valeur: { color: C.primaire, fontSize: 11, fontWeight: "800" },
  contactBloc: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 13 },
  contactNom: { color: C.primaire, fontSize: 12, fontWeight: "800" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12, paddingTop: 11, borderTopWidth: 1, borderTopColor: C.bordure },
  boutonModifier: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: C.bleuFond, borderRadius: 9 },
  texteModifier: { color: C.primaire, fontSize: 11, fontWeight: "800" },
  boutonSupprimer: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: C.rougeFond, borderRadius: 9 },
  texteSupprimer: { color: C.rouge, fontSize: 11, fontWeight: "800" },
  etat: { alignItems: "center", backgroundColor: C.blanc, borderRadius: 16, borderWidth: 1, borderColor: C.bordure, padding: 25, gap: 9 },
  etatTitre: { color: C.texte, fontSize: 14, fontWeight: "800", textAlign: "center" },
  etatTexte: { color: C.gris, fontSize: 12, lineHeight: 18, textAlign: "center" },
  reessayer: { backgroundColor: C.primaire, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 9, marginTop: 5 },
  texteReessayer: { color: "#FFF", fontSize: 12, fontWeight: "800" },
  pied: { color: C.gris, fontSize: 10, textAlign: "center", marginTop: 20 },
});

