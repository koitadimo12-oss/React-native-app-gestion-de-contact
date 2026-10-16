import React, { useCallback, useState } from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
ActivityIndicator,
RefreshControl,
Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { api } from "@/services/api";

type Rappel = {
id: number;
titre: string;
dateHeure: string;
effectue: boolean;
contact: {
id: number;
nom: string;
telephone: string;
};
};

export default function RappelsScreen() {
const router = useRouter();

const [rappels, setRappels] = useState<Rappel[]>([]);
const [chargement, setChargement] = useState(true);
const [actualisation, setActualisation] = useState(false);
const [suppressionId, setSuppressionId] = useState<number | null>(null);
const [erreur, setErreur] = useState("");

const chargerRappels = useCallback(async (rafraichir = false) => {
try {
if (rafraichir) {
setActualisation(true);
} else {
setChargement(true);
}


  setErreur("");

  const reponse = await api.get<Rappel[]>("/rappels");
  setRappels(reponse.data);
} catch (error) {
  console.error("Erreur lors du chargement des rappels :", error);

  setErreur(
    "Impossible de charger les rappels. Vérifiez votre connexion et réessayez.",
  );
} finally {
  setChargement(false);
  setActualisation(false);
}


}, []);

useFocusEffect(
useCallback(() => {
chargerRappels();
}, [chargerRappels]),
);

const formaterDateHeure = (dateHeure: string) => {
const date = new Date(dateHeure);


if (Number.isNaN(date.getTime())) {
  return "Date indisponible";
}

const dateFormatee = date.toLocaleDateString("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const heureFormatee = date.toLocaleTimeString("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

return `${dateFormatee} à ${heureFormatee}`;


};

const supprimerRappel = (rappel: Rappel) => {
Alert.alert(
"Supprimer ce rappel",
`Voulez-vous vraiment supprimer le rappel « ${rappel.titre} » associé à ${rappel.contact.nom} ?`,
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
setSuppressionId(rappel.id);


          await api.delete(`/rappels/${rappel.id}`);

          setRappels((anciensRappels) =>
            anciensRappels.filter(
              (element) => element.id !== rappel.id,
            ),
          );

          Alert.alert("Succès", "Le rappel a été supprimé.");
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);

          Alert.alert(
            "Erreur",
            "Impossible de supprimer ce rappel. Réessayez.",
          );
        } finally {
          setSuppressionId(null);
        }
      },
    },
  ],
);


};

const modifierRappel = (rappel: Rappel) => {
  router.push({
    pathname: "/modifierRappel",
    params: {
      id: String(rappel.id),
      titre: rappel.titre,
      dateHeure: rappel.dateHeure,
      contactId: String(rappel.contact.id),
      contactNom: rappel.contact.nom,
    },
  });
};;

return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    refreshControl={
      <RefreshControl
        refreshing={actualisation}
        onRefresh={() => chargerRappels(true)}
        tintColor="#0A3F7A"
      />
    }
  >
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Mes rappels</Text>

        <Text style={styles.subtitle}>
          N'oubliez plus vos appels importants.
        </Text>
      </View>

      <View style={styles.headerIcon}>
        <Ionicons
          name="notifications-outline"
          size={28}
          color="#FFFFFF"
        />
      </View>
    </View>

  <TouchableOpacity
    style={styles.addButton}
    onPress={() => router.push("/ajouterRappel")}
    activeOpacity={0.8}
  >
    <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
    <Text style={styles.addButtonText}>Créer un rappel</Text>
  </TouchableOpacity>

  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Mes rappels</Text>

    <View style={styles.counter}>
      <Text style={styles.counterText}>{rappels.length}</Text>
    </View>
  </View>

  {chargement ? (
    <View style={styles.messageCard}>
      <ActivityIndicator size="large" color="#0A3F7A" />
      <Text style={styles.messageText}>
        Chargement des rappels...
      </Text>
    </View>
  ) : erreur ? (
    <View style={styles.messageCard}>
      <Ionicons
        name="alert-circle-outline"
        size={42}
        color="#DC2626"
      />

      <Text style={styles.emptyTitle}>Chargement impossible</Text>
      <Text style={styles.messageText}>{erreur}</Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => chargerRappels()}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyButtonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  ) : rappels.length === 0 ? (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="calendar-outline"
          size={42}
          color="#38BDF8"
        />
      </View>

      <Text style={styles.emptyTitle}>
        Aucun rappel pour le moment
      </Text>

      <Text style={styles.emptyText}>
        Programmez un appel pour penser à contacter vos proches au bon
        moment.
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push("/ajouterRappel")}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyButtonText}>
          Ajouter mon premier rappel
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    rappels.map((rappel) => (
      <View key={rappel.id} style={styles.rappelCard}>
        <View style={styles.contactIcon}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#0A3F7A"
          />
        </View>

        <View style={styles.rappelInfo}>
          <Text style={styles.contactName}>
            {rappel.contact.nom}
          </Text>

          <Text style={styles.phone}>
            {rappel.contact.telephone}
          </Text>

          <Text style={styles.rappelTitre}>{rappel.titre}</Text>

          <Text style={styles.date}>
            {formaterDateHeure(rappel.dateHeure)}
          </Text>

          {rappel.effectue && (
            <Text style={styles.effectue}>Rappel effectué</Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => modifierRappel(rappel)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color="#0A3F7A"
              />
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                suppressionId === rappel.id && styles.disabledButton,
              ]}
              onPress={() => supprimerRappel(rappel)}
              disabled={suppressionId === rappel.id}
              activeOpacity={0.8}
            >
              {suppressionId === rappel.id ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#DC2626"
                  />
                  <Text style={styles.deleteButtonText}>
                    Supprimer
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ))
  )}
</ScrollView>


);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#F4F8FC",
paddingHorizontal: 20,
},
content: {
paddingBottom: 30,
},
header: {
marginTop: 25,
marginBottom: 25,
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},
title: {
fontSize: 28,
fontWeight: "bold",
color: "#0A3F7A",
},
subtitle: {
marginTop: 6,
fontSize: 14,
color: "#64748B",
},
headerIcon: {
width: 52,
height: 52,
borderRadius: 16,
backgroundColor: "#0A3F7A",
justifyContent: "center",
alignItems: "center",
},
addButton: {
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
backgroundColor: "#0A3F7A",
paddingVertical: 16,
borderRadius: 14,
gap: 10,
},
addButtonText: {
color: "#FFFFFF",
fontSize: 16,
fontWeight: "bold",
},
sectionHeader: {
flexDirection: "row",
alignItems: "center",
marginTop: 30,
marginBottom: 15,
gap: 10,
},
sectionTitle: {
color: "#0A3F7A",
fontSize: 20,
fontWeight: "bold",
},
counter: {
minWidth: 28,
height: 28,
borderRadius: 14,
backgroundColor: "#DDF3FF",
justifyContent: "center",
alignItems: "center",
paddingHorizontal: 8,
},
counterText: {
color: "#0A3F7A",
fontWeight: "bold",
},
emptyCard: {
backgroundColor: "#FFFFFF",
borderRadius: 20,
padding: 25,
alignItems: "center",
marginTop: 5,
borderWidth: 1,
borderColor: "#E2EAF2",
},
emptyIcon: {
width: 80,
height: 80,
borderRadius: 40,
backgroundColor: "#EAF7FF",
justifyContent: "center",
alignItems: "center",
marginBottom: 18,
},
emptyTitle: {
fontSize: 17,
fontWeight: "bold",
color: "#0A3F7A",
textAlign: "center",
marginTop: 10,
},
emptyText: {
fontSize: 14,
lineHeight: 22,
color: "#64748B",
textAlign: "center",
marginTop: 10,
},
messageCard: {
backgroundColor: "#FFFFFF",
borderRadius: 20,
padding: 25,
alignItems: "center",
marginTop: 5,
borderWidth: 1,
borderColor: "#E2EAF2",
},
messageText: {
fontSize: 14,
lineHeight: 22,
color: "#64748B",
textAlign: "center",
marginTop: 12,
},
emptyButton: {
marginTop: 20,
backgroundColor: "#EAF7FF",
paddingVertical: 12,
paddingHorizontal: 18,
borderRadius: 12,
},
emptyButtonText: {
color: "#0A3F7A",
fontWeight: "bold",
},
rappelCard: {
flexDirection: "row",
alignItems: "flex-start",
backgroundColor: "#FFFFFF",
padding: 16,
borderRadius: 16,
marginBottom: 12,
borderWidth: 1,
borderColor: "#E2EAF2",
},
contactIcon: {
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: "#EAF7FF",
justifyContent: "center",
alignItems: "center",
},
rappelInfo: {
flex: 1,
marginLeft: 12,
},
contactName: {
color: "#0A3F7A",
fontSize: 16,
fontWeight: "bold",
},
phone: {
color: "#64748B",
marginTop: 4,
fontSize: 13,
},
rappelTitre: {
color: "#334155",
marginTop: 6,
fontSize: 14,
fontWeight: "500",
},
date: {
color: "#0284C7",
marginTop: 6,
fontSize: 13,
fontWeight: "600",
},
effectue: {
color: "#15803D",
marginTop: 6,
fontSize: 12,
fontWeight: "bold",
},
actions: {
flexDirection: "row",
flexWrap: "wrap",
gap: 8,
marginTop: 14,
},
editButton: {
flexDirection: "row",
alignItems: "center",
gap: 6,
backgroundColor: "#EAF7FF",
paddingVertical: 9,
paddingHorizontal: 12,
borderRadius: 10,
},
editButtonText: {
color: "#0A3F7A",
fontSize: 13,
fontWeight: "bold",
},
deleteButton: {
flexDirection: "row",
alignItems: "center",
gap: 6,
backgroundColor: "#FEF2F2",
paddingVertical: 9,
paddingHorizontal: 12,
borderRadius: 10,
},
deleteButtonText: {
color: "#DC2626",
fontSize: 13,
fontWeight: "bold",
},
disabledButton: {
opacity: 0.5,
},
});
