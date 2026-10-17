
import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { api } from "@/services/api";

import {
  programmerNotification,
} from "@/services/notificationService";

export default function ModifierRappelScreen() {
  const router = useRouter();

  // Récupérer les informations du rappel sélectionné
  const params = useLocalSearchParams<{
    id?: string | string[];
    titre?: string | string[];
    dateHeure?: string | string[];
    contactId?: string | string[];
    contactNom?: string | string[];
  }>();

  const obtenirParametre = (
    valeur?: string | string[]
  ): string => {
    return Array.isArray(valeur)
      ? valeur[0] ?? ""
      : valeur ?? "";
  };

  const id = Number(obtenirParametre(params.id));

  const contactId = obtenirParametre(params.contactId);
  const contactNom = obtenirParametre(params.contactNom);

  const titreInitial = obtenirParametre(params.titre);
  const dateInitiale = obtenirParametre(params.dateHeure);

  const [titre, setTitre] = useState(titreInitial);

  const [modifierTitre, setModifierTitre] = useState(false);

  const [dateHeure, setDateHeure] = useState(() => {
    const date = new Date(dateInitiale);

    return Number.isNaN(date.getTime())
      ? new Date(Date.now() + 5 * 60 * 1000)
      : date;
  });

  const [afficherDate, setAfficherDate] = useState(false);

  const [afficherHeure, setAfficherHeure] = useState(false);

  const [chargement, setChargement] = useState(false);

  // Modifier la date
  const choisirDate = (
    evenement: DateTimePickerEvent,
    nouvelleDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setAfficherDate(false);
    }

    if (evenement.type === "dismissed" || !nouvelleDate) {
      return;
    }

    setDateHeure((ancienneDate) => {
      const resultat = new Date(ancienneDate);

      resultat.setFullYear(
        nouvelleDate.getFullYear(),
        nouvelleDate.getMonth(),
        nouvelleDate.getDate()
      );

      return resultat;
    });
  };

  // Modifier l'heure
  const choisirHeure = (
    evenement: DateTimePickerEvent,
    nouvelleDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setAfficherHeure(false);
    }

    if (evenement.type === "dismissed" || !nouvelleDate) {
      return;
    }

    setDateHeure((ancienneDate) => {
      const resultat = new Date(ancienneDate);

      resultat.setHours(
        nouvelleDate.getHours(),
        nouvelleDate.getMinutes(),
        0,
        0
      );

      return resultat;
    });
  };

  // Enregistrer les modifications et programmer la notification
  const enregistrerModifications = async () => {
    // Vérifier l'identifiant
    if (!Number.isInteger(id) || id <= 0) {
      Alert.alert(
        "Erreur",
        "L'identifiant du rappel est invalide. Retournez à la liste et réessayez."
      );

      return;
    }

    // Vérifier le titre
    if (!titre.trim()) {
      Alert.alert(
        "Titre obligatoire",
        "Saisissez le motif de votre rappel."
      );

      return;
    }

    // Vérifier la date
    if (dateHeure.getTime() <= Date.now()) {
      Alert.alert(
        "Date ou heure passée",
        "Choisissez une date et une heure dans le futur."
      );

      return;
    }

    try {
      setChargement(true);

      const titreFinal = titre.trim();

      // 1. Modifier le rappel dans le backend
      const reponse = await api.patch(`/rappels/${id}`, {
        titre: titreFinal,
        dateHeure: dateHeure.toISOString(),
      });

      console.log("Rappel modifié :", reponse.data);

      // 2. Programmer la notification à la nouvelle date
      const notificationId = await programmerNotification(
        titreFinal,
        `Il est temps de contacter ${
          contactNom || "votre contact"
        }.`,
        dateHeure
      );

      // 3. Vérifier si la notification a été programmée
      if (notificationId) {
        console.log(
          "Notification du rappel modifié programmée :",
          notificationId
        );

        Alert.alert(
          "Modification réussie",
          "Votre rappel a été modifié et une nouvelle notification a été programmée.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        console.warn(
          "Le rappel est modifié, mais la notification n'a pas été programmée."
        );

        Alert.alert(
          "Rappel modifié",
          "La modification a été enregistrée, mais la notification n'a pas pu être programmée. Vérifiez les autorisations de notification de votre téléphone.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error(
        "Erreur modification rappel :",
        error.response?.data || error.message
      );

      const message = error.response?.data?.message;

      Alert.alert(
        "Erreur",
        Array.isArray(message)
          ? message.join("\n")
          : typeof message === "string"
            ? message
            : "Impossible de modifier le rappel. Vérifiez votre connexion et réessayez."
      );
    } finally {
      setChargement(false);
    }
  };

  // Formater la date
  const dateFormatee = dateHeure.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Formater l'heure
  const heureFormatee = dateHeure.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* EN-TÊTE */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Retour"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#0A3F7A"
          />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Modifier le rappel
          </Text>

          <Text style={styles.subtitle}>
            Modifiez le motif, la date ou l'heure.
          </Text>
        </View>
      </View>

      {/* ILLUSTRATION */}

      <View style={styles.illustration}>
        <Ionicons
          name="create-outline"
          size={42}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.formCard}>
        {/* CONTACT ASSOCIÉ */}

        <Text style={styles.sectionTitle}>
          Contact associé
        </Text>

        <View style={styles.contactContainer}>
          <View style={styles.contactIcon}>
            <Ionicons
              name="person-outline"
              size={23}
              color="#0A3F7A"
            />
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>
              {contactNom || "Contact associé"}
            </Text>

            <Text style={styles.helperText}>
              Le contact ne peut pas être modifié.
            </Text>
          </View>

          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#64748B"
          />
        </View>

        <View style={styles.separator} />

        {/* MOTIF */}

        <Text style={styles.sectionTitle}>
          Motif du rappel
        </Text>

        {modifierTitre ? (
          <View style={styles.titleEditor}>
            <TextInput
              style={styles.titleInput}
              value={titre}
              onChangeText={setTitre}
              placeholder="Saisissez le motif du rappel"
              placeholderTextColor="#94A3B8"
              maxLength={150}
              autoFocus
            />

            <TouchableOpacity
              style={styles.editorButton}
              onPress={() => {
                if (!titre.trim()) {
                  Alert.alert(
                    "Titre obligatoire",
                    "Saisissez un motif avant de terminer."
                  );

                  return;
                }

                setTitre(titre.trim());
                setModifierTitre(false);
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#0284C7"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Ionicons
              name="create-outline"
              size={21}
              color="#64748B"
            />

            <Text style={styles.titleValue}>
              {titre || "Aucun motif"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.changeTitleButton}
          onPress={() => setModifierTitre(!modifierTitre)}
        >
          <Text style={styles.changeTitleText}>
            {modifierTitre
              ? "Fermer la modification"
              : "Modifier le motif"}
          </Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* PLANIFICATION */}

        <Text style={styles.sectionTitle}>
          Planification
        </Text>

        <Text style={styles.label}>
          Date du rappel
        </Text>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => {
            setAfficherHeure(false);
            setAfficherDate(true);
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#64748B"
          />

          <Text style={styles.pickerValue}>
            {dateFormatee}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>

        {afficherDate && (
          <DateTimePicker
            value={dateHeure}
            mode="date"
            display={
              Platform.OS === "ios"
                ? "spinner"
                : "default"
            }
            minimumDate={new Date()}
            onChange={choisirDate}
          />
        )}

        <Text style={styles.label}>
          Heure du rappel
        </Text>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => {
            setAfficherDate(false);
            setAfficherHeure(true);
          }}
        >
          <Ionicons
            name="time-outline"
            size={21}
            color="#64748B"
          />

          <Text style={styles.pickerValue}>
            {heureFormatee}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>

        {afficherHeure && (
          <DateTimePicker
            value={dateHeure}
            mode="time"
            is24Hour
            display={
              Platform.OS === "ios"
                ? "spinner"
                : "default"
            }
            onChange={choisirHeure}
          />
        )}

        <Text style={styles.helperText}>
          Choisissez une date et une heure dans le futur.
        </Text>

        {/* ENREGISTRER */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            chargement && styles.disabledButton,
          ]}
          onPress={enregistrerModifications}
          disabled={chargement}
          activeOpacity={0.85}
        >
          {chargement ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons
              name="checkmark-circle-outline"
              size={23}
              color="#FFFFFF"
            />
          )}

          <Text style={styles.saveButtonText}>
            {chargement
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </Text>
        </TouchableOpacity>

        {/* ANNULER */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={chargement}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>
            Annuler
          </Text>
        </TouchableOpacity>
      </View>

      {/* INFORMATION */}

      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color="#0284C7"
        />

        <Text style={styles.infoText}>
          Les modifications seront enregistrées sur votre compte.
          Le rappel restera associé au même contact.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FC",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2EAF2",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    color: "#0A3F7A",
    fontSize: 23,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 5,
  },

  illustration: {
    width: 82,
    height: 82,
    borderRadius: 25,
    backgroundColor: "#0A3F7A",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2EAF2",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0A3F7A",
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 15,
  },

  inputContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE5EF",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FAFCFF",
    gap: 10,
  },

  titleValue: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
    paddingVertical: 12,
  },

  titleEditor: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0284C7",
    borderRadius: 12,
    backgroundColor: "#FAFCFF",
    paddingHorizontal: 12,
  },

  titleInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
    paddingVertical: 12,
  },

  editorButton: {
    padding: 5,
  },

  pickerValue: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
    paddingVertical: 12,
  },

  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE5EF",
    backgroundColor: "#F8FAFC",
    gap: 10,
  },

  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF1F8",
    alignItems: "center",
    justifyContent: "center",
  },

  contactInfo: {
    flex: 1,
  },

  contactName: {
    color: "#0A3F7A",
    fontSize: 15,
    fontWeight: "700",
  },

  helperText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 6,
  },

  separator: {
    height: 1,
    backgroundColor: "#E2EAF2",
    marginVertical: 25,
  },

  changeTitleButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },

  changeTitleText: {
    color: "#0284C7",
    fontSize: 13,
    fontWeight: "600",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A3F7A",
    minHeight: 54,
    borderRadius: 14,
    marginTop: 28,
    paddingHorizontal: 10,
    gap: 10,
  },

  disabledButton: {
    opacity: 0.65,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "center",
  },

  cancelButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  cancelButtonText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EAF7FF",
    padding: 14,
    borderRadius: 14,
    marginTop: 18,
    gap: 10,
  },

  infoText: {
    flex: 1,
    color: "#075985",
    fontSize: 13,
    lineHeight: 20,
  },
});

