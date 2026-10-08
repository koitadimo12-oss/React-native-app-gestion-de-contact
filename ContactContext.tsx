import {
  createContext,
  useContext,
  useState,
} from "react";

import { api } from "@/services/api";

export type Contact = {
  id: number;
  nom: string;
  telephone: string;
  favori: boolean;
  categorie: string | null;
  note: string | null;
};

type ContactContextType = {
  contacts: Contact[];

  chargerContacts: () => Promise<void>;

  ajouterContact: (contact: Contact) => void;

  modifierContact: (
    id: number,
    nom: string,
    telephone: string,
    categorie: string,
    note: string
  ) => Promise<void>;

  supprimerContact: (id: number) => Promise<void>;

  changerFavori: (id: number) => void;

  // VIDER LES CONTACTS LORS DE LA DÉCONNEXION
  viderContacts: () => void;
};

const ContactContext = createContext<
  ContactContextType | undefined
>(undefined);

export function ContactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // RÉCUPÉRER LES CONTACTS DEPUIS LE BACKEND
  const chargerContacts = async () => {
    try {
      const response = await api.get("/contacts");

      console.log(
        "Contacts récupérés :",
        response.data
      );

      setContacts(response.data);
    } catch (error: any) {
      console.log(
        "Erreur récupération contacts :",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // AJOUTER
  const ajouterContact = (contact: Contact) => {
    setContacts((anciensContacts) => [
      ...anciensContacts,
      contact,
    ]);
  };

  // MODIFIER
  const modifierContact = async (
    id: number,
    nom: string,
    telephone: string,
    categorie: string,
    note: string
  ) => {
    try {
      const response = await api.put(`/contacts/${id}`, {
        nom: nom.trim(),
        telephone: telephone.trim(),
        categorie: categorie.trim(),
        note: note.trim(),
      });

      console.log(
        "Contact modifié :",
        response.data
      );

      setContacts((anciensContacts) =>
        anciensContacts.map((contact) =>
          contact.id === id
            ? response.data
            : contact
        )
      );
    } catch (error: any) {
      console.log(
        "Erreur modification contact :",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // SUPPRIMER
  const supprimerContact = async (id: number) => {
    try {
      await api.delete(`/contacts/${id}`);

      console.log(
        "Contact supprimé :",
        id
      );

      setContacts((anciensContacts) =>
        anciensContacts.filter(
          (contact) => contact.id !== id
        )
      );
    } catch (error: any) {
      console.log(
        "Erreur suppression contact :",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // FAVORI
  const changerFavori = async (id: number) => {
    try {
      const contact = contacts.find(
        (contact) => contact.id === id
      );

      if (!contact) {
        return;
      }

      const nouveauFavori = !contact.favori;

      const response = await api.put(`/contacts/${id}`, {
        favori: nouveauFavori,
      });

      console.log(
        "Favori modifié :",
        response.data
      );

      setContacts((anciensContacts) =>
        anciensContacts.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                favori: response.data.favori,
              }
            : contact
        )
      );
    } catch (error: any) {
      console.log(
        "Erreur modification favori :",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // VIDER LES CONTACTS LORS DE LA DÉCONNEXION
  const viderContacts = () => {
    setContacts([]);
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        chargerContacts,
        ajouterContact,
        modifierContact,
        supprimerContact,
        changerFavori,
        viderContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error(
      "useContacts doit être utilisé dans ContactProvider"
    );
  }

  return context;
}