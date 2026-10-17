
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

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
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useContacts } from "@/ContactContext";
import type { Contact } from "@/ContactContext";
import { api } from "@/services/api";
import { programmerNotification } from "@/services/notificationService";

export default function AjouterRappelScreen() {
  const router = useRouter();

  const { contactId: contactIdParam } = useLocalSearchParams<{
    contactId?: string | string[];
  }>();

  const { contacts, chargerContacts } = useContacts();

  const [contactId, setContactId] = useState<number | null>(null);
  const [titre, setTitre] = useState("Appeler mon contact");
  const [modifierTitre, setModifierTitre] = useState(false);

  const [dateHeure, setDateHeure] = useState(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5, 0, 0);
    return date;
  });

  const [afficherDate, setAfficherDate] = useState(false);
  const [afficherHeure, setAfficherHeure] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [chargementContacts, setChargementContacts] = useState(true);

  const contactSelectionne = contacts.find(
    (contact: Contact) => Number(contact.id) === contactId
  );

  // Sélectionner automatiquement le contact transmis dans l'URL.
  useEffect(() => {
    const parametreId = Array.isArray(contactIdParam)
      ? contactIdParam[0]
      : contactIdParam;

    if (!parametreId) return;

    const id = Number(parametreId);

    if (!Number.isInteger(id) || id <= 0) return;

    const contactExiste = contacts.some(
      (contact: Contact) => Number(contact.id) === id
    );

    if (contactExiste) {
      setContactId(id);
    }
  }, [contactIdParam, contacts]);

  // Charger les contacts à chaque ouverture de l'écran.
  useFocusEffect(
    useCallback(() => {
      let actif = true;

      const charger = async () => {
        try {
          setChargementContacts(true);
          await chargerContacts();
        } catch (error) {
          console.error("Erreur chargement contacts :", error);

          if (actif) {
            Alert.alert(
              "Erreur",
              "Impossible de récupérer les contacts. Vérifiez votre connexion."
            );
          }
        } finally {
          if (actif) {
            setChargementContacts(false);
          }
        }
      };

      void charger();

      return () => {
        actif = false;
      };
    }, [chargerContacts])
  );

  // Choisir la date du rappel.
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

  // Choisir l'heure du rappel.
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

  // Enregistrer le rappel puis programmer sa notification locale.
  const enregistrerRappel = async () => {
    if (chargement) return;

    if (!contactSelectionne) {
      Alert.alert(
        "Contact obligatoire",
        "Sélectionnez un contact enregistré avant de continuer."
      );
      return;
    }

    const titreFinal = titre.trim();

    if (!titreFinal) {
      Alert.alert(
        "Titre obligatoire",
        "Saisissez le motif de votre rappel."
      );
      return;
    }

    if (dateHeure.getTime() <= Date.now()) {
      Alert.alert(
        "Date ou heure passée",
        "Choisissez une date et une heure dans le futur."
      );
      return;
    }

    try {
      setChargement(true);

      // 1. Enregistrer le rappel dans le backend.
      const reponse = await api.post("/rappels", {
        contactId: contactSelectionne.id,
        titre: titreFinal,
        dateHeure: dateHeure.toISOString(),
      });

      console.log("Rappel créé :", reponse.data);

      // 2. Programmer la notification sur le téléphone.
      let identifiantNotification: string | null = null;

      try {
        console.log("========== TEST RAPPEL ==========");
        console.log("Titre :", titreFinal);
        console.log("Contact :", contactSelectionne.nom);
        console.log("Date choisie :", dateHeure.toString());
        console.log("Date ISO :", dateHeure.toISOString());
        console.log("Heure actuelle :", new Date().toString());
        console.log(
          "Délai avant notification (secondes) :",
          Math.round(
            (dateHeure.getTime() - Date.now()) / 1000
          )
        );

        identifiantNotification = await programmerNotification(
          titreFinal,
          `Il est temps de contacter ${contactSelectionne.nom}.`,
          dateHeure
        );

        if (identifiantNotification) {
          console.log(
            "NOTIFICATION DU RAPPEL PROGRAMMÉE :",
            identifiantNotification
          );
        } else {
          console.warn(
            "Le rappel est enregistré, mais la notification n'a pas été programmée."
          );
        }

        console.log("=================================");
      } catch (erreurNotification) {
        console.error(
          "Erreur de programmation de la notification :",
          erreurNotification
        );
      }

      // 3. Préparer la confirmation.
      const dateAffichee = dateHeure.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const heureAffichee = dateHeure.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const notificationProgrammee =
        identifiantNotification !== null;

      const message = notificationProgrammee
        ? `Ton rappel pour ${contactSelectionne.nom} est enregistré.\n\nUne notification locale est programmée pour le ${dateAffichee} à ${heureAffichee}.`
        : `Ton rappel pour ${contactSelectionne.nom} est enregistré pour le ${dateAffichee} à ${heureAffichee}.\n\nCependant, la notification locale n'a pas pu être programmée. Vérifie les autorisations de notification de ton téléphone.`;

      Alert.alert(
        notificationProgrammee
          ? "Rappel enregistré"
          : "Rappel enregistré sans notification",
        message,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "Erreur création rappel :",
        error.response?.data || error.message
      );

      const messageErreur = error.response?.data?.message;

      Alert.alert(
        "Erreur",
        Array.isArray(messageErreur)
          ? messageErreur.join("\n")
          : typeof messageErreur === "string"
            ? messageErreur
            : "Impossible d'enregistrer le rappel. Vérifiez votre connexion et réessayez."
      );
    } finally {
      setChargement(false);
    }
  };

  const dateFormatee = dateHeure.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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
          <Text style={styles.title}>Nouveau rappel</Text>
          <Text style={styles.subtitle}>
            Programmez votre prochain appel.
          </Text>
        </View>
      </View>

      <View style={styles.illustration}>
        <Ionicons
          name="notifications-outline"
          size={42}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          Informations du contact
        </Text>

        <Text style={styles.label}>Choisir un contact</Text>

        {chargementContacts ? (
          <View style={styles.loadingContacts}>
            <ActivityIndicator color="#0A3F7A" />
            <Text style={styles.helperText}>
              Chargement des contacts...
            </Text>
          </View>
        ) : contacts.length === 0 ? (
          <View style={styles.emptyContacts}>
            <Text style={styles.emptyText}>
              Aucun contact disponible.
            </Text>
            <Text style={styles.helperText}>
              Ajoutez d'abord un contact dans votre application.
            </Text>
          </View>
        ) : (
          <View style={styles.contactsList}>
            {contacts.map((contact: Contact) => {
              const selectionne =
                Number(contact.id) === contactId;

              return (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactItem,
                    selectionne && styles.contactItemSelected,
                  ]}
                  onPress={() => setContactId(Number(contact.id))}
                  activeOpacity={0.8}
                >
                  <View style={styles.contactIcon}>
                    <Ionicons
                      name="person-outline"
                      size={21}
                      color="#0A3F7A"
                    />
                  </View>

                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>
                      {contact.nom}
                    </Text>
                    <Text style={styles.contactPhone}>
                      {contact.telephone}
                    </Text>
                  </View>

                  <Ionicons
                    name={
                      selectionne
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={23}
                    color={
                      selectionne ? "#0284C7" : "#94A3B8"
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {contactSelectionne && (
          <View style={styles.selectedContact}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#0284C7"
            />
            <Text style={styles.selectedContactText}>
              Contact sélectionné : {contactSelectionne.nom}
            </Text>
          </View>
        )}

        <View style={styles.separator} />

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
              maxLength={100}
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
            <Text style={styles.titleValue}>{titre}</Text>
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

        <Text style={styles.sectionTitle}>Planification</Text>

        <Text style={styles.label}>Date du rappel</Text>

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
              Platform.OS === "ios" ? "spinner" : "default"
            }
            minimumDate={new Date()}
            onChange={choisirDate}
          />
        )}

        <Text style={styles.label}>Heure du rappel</Text>

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
              Platform.OS === "ios" ? "spinner" : "default"
            }
            onChange={choisirHeure}
          />
        )}

        <Text style={styles.helperText}>
          Choisissez une date et une heure futures.
        </Text>

        <TouchableOpacity
          style={[
            styles.saveButton,
            chargement && styles.disabledButton,
          ]}
          onPress={enregistrerRappel}
          disabled={chargement || chargementContacts}
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
              : "Enregistrer le rappel"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={chargement}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color="#0284C7"
        />
        <Text style={styles.infoText}>
          Votre rappel sera enregistré sur votre compte. Une
          notification locale sera programmée pour vous prévenir
          à la date et à l'heure choisies.
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
    fontSize: 25,
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
  contactsList: {
    gap: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE5EF",
    backgroundColor: "#FAFCFF",
    gap: 10,
  },
  contactItemSelected: {
    borderColor: "#0284C7",
    backgroundColor: "#EAF7FF",
  },
  contactIcon: {
    width: 40,
    height: 40,
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
  contactPhone: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  selectedContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  selectedContactText: {
    flex: 1,
    color: "#075985",
    fontSize: 13,
  },
  loadingContacts: {
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  emptyContacts: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  emptyText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
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
    gap: 10,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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

