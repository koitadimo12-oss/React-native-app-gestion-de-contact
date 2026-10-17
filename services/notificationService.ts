import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Définir le comportement des notifications lorsque l'application est ouverte.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Demander l'autorisation d'afficher les notifications.
export async function demanderAutorisationNotifications(): Promise<boolean> {
  try {
    const { status: statutActuel } =
      await Notifications.getPermissionsAsync();

    let statutFinal = statutActuel;

    if (statutActuel !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      statutFinal = status;
    }

    if (statutFinal !== "granted") {
      console.log("Autorisation des notifications refusée.");
      return false;
    }

    // Créer un canal de notification sur Android.
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("rappels", {
        name: "Rappels de contacts",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      });
    }

    return true;
  } catch (error) {
    console.error(
      "Erreur lors de la demande d'autorisation :",
      error
    );

    return false;
  }
}

// Programmer une notification locale pour un rappel.
export async function programmerNotification(
  titre: string,
  message: string,
  dateHeure: Date
): Promise<string | null> {
  try {
    const autorisation = await demanderAutorisationNotifications();

    if (!autorisation) {
      return null;
    }

    // Vérifier que la date est dans le futur.
    if (dateHeure.getTime() <= Date.now()) {
      console.warn(
        "Impossible de programmer une notification dans le passé."
      );

      return null;
    }

    // Programmer la notification locale.
    const identifiant = await Notifications.scheduleNotificationAsync({
      content: {
        title: titre,
        body: message,
        data: {
          type: "rappel",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dateHeure,
        ...(Platform.OS === "android" ? { channelId: "rappels" } : {}),
      },
    });

    console.log("Notification programmée avec succès :", identifiant);

    return identifiant;
  } catch (error) {
    console.error(
      "Erreur lors de la programmation de la notification :",
      error
    );

    return null;
  }
}

// Annuler une notification programmée.
export async function annulerNotification(
  identifiant: string
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifiant);

    console.log("Notification annulée :", identifiant);
  } catch (error) {
    console.error(
      "Erreur lors de l'annulation de la notification :",
      error
    );
  }
}

// Récupérer les notifications encore programmées.
export async function obtenirNotificationsProgrammees() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notifications :",
      error
    );

    return [];
  }
}