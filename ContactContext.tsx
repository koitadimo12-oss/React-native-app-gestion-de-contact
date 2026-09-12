import {
  createContext,
  useContext,
  useState,
} from "react";

export type Contact = {
  id: number;
  nom: string;
  telephone: string;
  favori: boolean;
};

type ContactContextType = {
  contacts: Contact[];

  ajouterContact: (
    nom: string,
    telephone: string
  ) => void;

  modifierContact: (
    id: number,
    nom: string,
    telephone: string
  ) => void;

  supprimerContact: (id: number) => void;

  changerFavori: (id: number) => void;
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

  // AJOUTER
  const ajouterContact = (
    nom: string,
    telephone: string
  ) => {

    const nouveauContact: Contact = {
      id: Date.now(),
      nom: nom,
      telephone: telephone,
      favori: false,
    };

    setContacts((anciensContacts) => [
      ...anciensContacts,
      nouveauContact,
    ]);
  };

  // MODIFIER
  const modifierContact = (
    id: number,
    nom: string,
    telephone: string
  ) => {

    setContacts((anciensContacts) =>
      anciensContacts.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              nom: nom,
              telephone: telephone,
            }
          : contact
      )
    );
  };

  // SUPPRIMER
  const supprimerContact = (id: number) => {

    setContacts((anciensContacts) =>
      anciensContacts.filter(
        (contact) => contact.id !== id
      )
    );
  };

  // FAVORI
  const changerFavori = (id: number) => {

    setContacts((anciensContacts) =>
      anciensContacts.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              favori: !contact.favori,
            }
          : contact
      )
    );
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        ajouterContact,
        modifierContact,
        supprimerContact,
        changerFavori,
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