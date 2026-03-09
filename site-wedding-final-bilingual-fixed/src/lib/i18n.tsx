import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "fr" | "el";

const translations = {
  fr: {
    meta: {
      title: "Alexia & Alexandre - Mariage 17 Juillet 2027",
      description:
        "Alexia et Alexandre vous invitent à célébrer leur mariage le 17 juillet 2027 à Athènes, Grèce.",
      ogDescription: "Célébrons notre union à Athènes, entre Grèce et France.",
      htmlLang: "fr",
    },
    nav: {
      story: "Notre Histoire",
      venue: "Le Lieu",
      accommodation: "Hébergement",
      transport: "Transport",
      rsvp: "RSVP",
      contact: "Contact",
    },
    hero: {
      marrying: "Nous nous marions",
      dateLocation: "17 Juillet 2027 · Athènes, Grèce",
      alt: "Côte méditerranéenne au coucher du soleil",
      countdown: {
        days: "Jours",
        hours: "Heures",
        minutes: "Minutes",
        seconds: "Secondes",
      },
    },
    story: {
      eyebrow: "Notre Histoire",
      title: "Bienvenue à bord de notre plus beau voyage",
      imageAlt: "Alexia et Alexandre",
      paragraphs: [
        "Entre la lumière de la Méditerranée, les paysages de la Grèce et l'élégance de la France, notre histoire s'écrit entre deux cultures qui nous sont chères. Ce mariage est pour nous l'occasion de réunir ces deux univers et de célébrer ce mélange qui fait aussi la richesse de notre couple.",
        "Nous avons imaginé cette journée comme un véritable voyage : un moment de partage, de joie et de fête, entourés de nos familles et de nos amis venus de près ou de loin.",
        "Athènes sera le point de départ de cette belle aventure, où traditions grecques et esprit français se rencontreront pour créer des souvenirs inoubliables.",
      ],
      closing:
        "Merci de faire partie de ce voyage avec nous. Votre présence rendra cette célébration encore plus spéciale.",
    },
    venue: {
      eyebrow: "La Célébration",
      title: "Le Lieu",
      imageAlt: "Cathédrale Saint-Denys-l'Aréopagite d'Athènes",
      intro:
        "Voici le planning et les informations importantes concernant la cérémonie religieuse et le lieu de la soirée.",
      ceremony:
        "Cérémonie religieuse dans la Cathédrale Saint-Denys-l'Aréopagite d'Athènes",
      ceremonyEnd: "Fin de la cérémonie",
      arrival:
        "Arrivée sur le lieu Κτήμα Κεκρωπία Φαίδων Γεωργίτσης",
      mapsLead:
        "Prenez le lien Google Maps suivant pour vous rendre sur le lieu :",
      clickHere: "Cliquez-ici",
    },
    accommodation: {
      eyebrow: "Séjour",
      title: "Hôtels & Airbnb",
      paragraphs: [
        "Si vous souhaitez séjourner dans le centre d’Athènes, à proximité de la cérémonie religieuse, nous vous conseillons de choisir un hôtel dans les quartiers de Monastiraki, Plaka ou Syntagma. Si vous avez des questions sur d’autres quartiers, n’hésitez pas à nous les poser.",
        "Si vous préférez être en bord de mer, mais donc plus éloignés du centre d’Athènes et du lieu du mariage, vous pouvez regarder du côté de Porto Rafti, Nea Makri, Vouliagmeni ou Glyfada. Dans ce cas, une voiture sera nécessaire pour vos déplacements.",
        "Si vous souhaitez être proches du lieu de la réception, vous pouvez séjourner à Koropi, Karellas, Profitis Ilias, Peania ou Spata. Là aussi, une voiture sera nécessaire.",
        "Pour un logement plus économique tout en restant sur la ligne de métro reliant l’aéroport, vous pouvez regarder les quartiers de Agia Paraskevi ou Doukissis Plakentias.",
      ],
      bookingLead: "N’hésitez pas à consulter",
      bookingMiddle: "ou",
      bookingTail: "pour vos recherches.",
      note:
        "Dans tous les cas, il faudra prévoir un moyen de transport (voiture de location ou taxi) pour vous rendre de la cérémonie religieuse au lieu de la réception.",
    },
    transport: {
      eyebrow: "Transport",
      title: "Taxi & Location de voiture",
      imageAlt: "Location de voiture en Grèce",
      taxiTitle: "Taxis :",
      taxiText:
        "Deux options s’offrent à vous : télécharger l’application Uber ou FREENOW, toutes deux très utilisées à Athènes.",
      rentalTitle: "Location de voiture :",
      rentalText:
        "À l’aéroport d’Athènes, tous les loueurs de véhicules sont ouverts 24h/24 et 7j/7 (Europcar, Sixt, Hertz, Enterprise, etc.).",
      europcar:
        "Nous vous conseillons Europcar, qui est dans la grande majorité des cas le plus avantageux.",
      downtown:
        "Ces loueurs sont également présents dans le centre d’Athènes, mais les agences n’y sont généralement pas ouvertes 24h/24.",
      group:
        "N’hésitez pas à louer un véhicule à plusieurs (amis, famille, etc.). Il existe des voitures 4, 5 ou 9 places, notamment des vans, qui peuvent être une solution pratique.",
      help:
        "N’hésitez pas à nous contacter si vous avez la moindre question, nous serons ravis de vous aider.",
    },
    rsvp: {
      eyebrow: "Répondez",
      title: "Confirmer sa Présence",
      intro:
        "Merci de nous confirmer votre présence avant le 17 mai 2027 afin que nous puissions organiser au mieux cette journée.",
      thankYouTitle: "Merci !",
      thankYouText:
        "Votre réponse a bien été envoyée. Nous avons hâte de vous retrouver à Athènes !",
      name: "Nom complet",
      namePlaceholder: "Votre nom",
      email: "Email",
      guests: "Nombre de personnes",
      attending: "Serez-vous présent(e) ?",
      yes: "Oui, avec joie !",
      no: "Malheureusement non",
      message: "Un petit mot ? (optionnel)",
      messagePlaceholder: "Votre message pour les mariés...",
      submit: "Envoyer ma réponse",
      sending: "Envoi en cours...",
      person: "personne",
      people: "personnes",
      error: "Une erreur est survenue. Merci de réessayer.",
    },
    contact: {
      eyebrow: "Une question ?",
      title: "Nous Contacter",
      text:
        "N'hésitez pas à nous contacter pour toute question concernant le mariage, les déplacements ou l'hébergement. Nous serons ravis de vous aider !",
      cta: "Nous écrire",
      date: "17 Juillet 2027",
      footer: "Fait avec",
      footerEnd: "pour notre plus beau jour",
    },
  },
  el: {
    meta: {
      title: "Alexia & Alexandre - Γάμος 17 Ιουλίου 2027",
      description:
        "Η Alexia και ο Alexandre σας προσκαλούν να γιορτάσετε τον γάμο τους στις 17 Ιουλίου 2027 στην Αθήνα, Ελλάδα.",
      ogDescription: "Ας γιορτάσουμε την ένωσή μας στην Αθήνα, ανάμεσα στη Γαλλία και την Ελλάδα.",
      htmlLang: "el",
    },
    nav: {
      story: "Η Ιστορία μας",
      venue: "Ο Χώρος",
      accommodation: "Διαμονή",
      transport: "Μεταφορά",
      rsvp: "RSVP",
      contact: "Επικοινωνία",
    },
    hero: {
      marrying: "Παντρευόμαστε",
      dateLocation: "17 Ιουλίου 2027 · Αθήνα, Ελλάδα",
      alt: "Μεσογειακή ακτή στο ηλιοβασίλεμα",
      countdown: {
        days: "Ημέρες",
        hours: "Ώρες",
        minutes: "Λεπτά",
        seconds: "Δευτ.",
      },
    },
    story: {
      eyebrow: "Η Ιστορία μας",
      title: "Καλώς ήρθατε στο πιο όμορφο ταξίδι μας",
      imageAlt: "Alexia και Alexandre",
      paragraphs: [
        "Ανάμεσα στο φως της Μεσογείου, τα τοπία της Ελλάδας και την κομψότητα της Γαλλίας, η ιστορία μας γράφεται ανάμεσα σε δύο κουλτούρες που αγαπάμε πολύ. Αυτός ο γάμος είναι για εμάς η ευκαιρία να ενώσουμε αυτούς τους δύο κόσμους και να γιορτάσουμε αυτό το όμορφο μείγμα που αποτελεί και τον πλούτο του ζευγαριού μας.",
        "Οραματιστήκαμε αυτή την ημέρα σαν ένα αληθινό ταξίδι: μια στιγμή μοιράσματος, χαράς και γιορτής, μαζί με τις οικογένειες και τους φίλους μας που θα έρθουν από κοντά ή από μακριά.",
        "Η Αθήνα θα είναι η αφετηρία αυτής της όμορφης περιπέτειας, όπου οι ελληνικές παραδόσεις και το γαλλικό πνεύμα θα συναντηθούν για να δημιουργήσουν αξέχαστες αναμνήσεις.",
      ],
      closing:
        "Σας ευχαριστούμε που είστε μέρος αυτού του ταξιδιού μαζί μας. Η παρουσία σας θα κάνει αυτή τη γιορτή ακόμα πιο ξεχωριστή.",
    },
    venue: {
      eyebrow: "Ο Εορτασμός",
      title: "Ο Χώρος",
      imageAlt: "Καθεδρικός Ναός Saint-Denys-l'Aréopagite της Αθήνας",
      intro:
        "Ακολουθεί το πρόγραμμα και οι σημαντικές πληροφορίες σχετικά με τη θρησκευτική τελετή και τον χώρο της δεξίωσης.",
      ceremony:
        "Θρησκευτική τελετή στον Καθεδρικό Ναό Saint-Denys-l'Aréopagite της Αθήνας",
      ceremonyEnd: "Λήξη της τελετής",
      arrival:
        "Άφιξη στον χώρο Κτήμα Κεκρωπία Φαίδων Γεωργίτσης",
      mapsLead:
        "Χρησιμοποιήστε τον παρακάτω σύνδεσμο Google Maps για να μεταβείτε στον χώρο:",
      clickHere: "Πατήστε εδώ",
    },
    accommodation: {
      eyebrow: "Διαμονή",
      title: "Ξενοδοχεία & Airbnb",
      paragraphs: [
        "Αν επιθυμείτε να μείνετε στο κέντρο της Αθήνας, κοντά στη θρησκευτική τελετή, σας προτείνουμε να επιλέξετε ξενοδοχείο στις περιοχές Μοναστηράκι, Πλάκα ή Σύνταγμα. Αν έχετε απορίες για άλλες περιοχές, μη διστάσετε να μας ρωτήσετε.",
        "Αν προτιμάτε να μείνετε δίπλα στη θάλασσα, αλλά πιο μακριά από το κέντρο της Αθήνας και τον χώρο του γάμου, μπορείτε να κοιτάξετε προς Πόρτο Ράφτη, Νέα Μάκρη, Βουλιαγμένη ή Γλυφάδα. Σε αυτήν την περίπτωση θα χρειαστεί αυτοκίνητο για τις μετακινήσεις σας.",
        "Αν θέλετε να είστε κοντά στον χώρο της δεξίωσης, μπορείτε να μείνετε σε Κορωπί, Καρέλλα, Προφήτη Ηλία, Παιανία ή Σπάτα. Και σε αυτήν την περίπτωση θα χρειαστεί αυτοκίνητο.",
        "Για πιο οικονομική διαμονή, παραμένοντας όμως στη γραμμή του μετρό που συνδέει το αεροδρόμιο, μπορείτε να κοιτάξετε τις περιοχές Αγία Παρασκευή ή Δουκίσσης Πλακεντίας.",
      ],
      bookingLead: "Μπορείτε να χρησιμοποιήσετε το",
      bookingMiddle: "ή το",
      bookingTail: "για την αναζήτησή σας.",
      note:
        "Σε κάθε περίπτωση, θα χρειαστεί να προβλέψετε ένα μέσο μεταφοράς (ενοικιαζόμενο αυτοκίνητο ή ταξί) για να μεταβείτε από τη θρησκευτική τελετή στον χώρο της δεξίωσης.",
    },
    transport: {
      eyebrow: "Μεταφορά",
      title: "Ταξί & Ενοικίαση αυτοκινήτου",
      imageAlt: "Ενοικίαση αυτοκινήτου στην Ελλάδα",
      taxiTitle: "Ταξί :",
      taxiText:
        "Έχετε δύο επιλογές: να κατεβάσετε την εφαρμογή Uber ή την FREENOW, οι οποίες χρησιμοποιούνται ευρέως στην Αθήνα.",
      rentalTitle: "Ενοικίαση αυτοκινήτου :",
      rentalText:
        "Στο αεροδρόμιο της Αθήνας, όλες οι εταιρείες ενοικίασης οχημάτων είναι ανοιχτές 24 ώρες το 24ωρο και 7 ημέρες την εβδομάδα (Europcar, Sixt, Hertz, Enterprise κ.λπ.).",
      europcar:
        "Σας προτείνουμε την Europcar, η οποία στις περισσότερες περιπτώσεις είναι η πιο συμφέρουσα επιλογή.",
      downtown:
        "Οι εταιρείες αυτές υπάρχουν και στο κέντρο της Αθήνας, αλλά τα γραφεία εκεί συνήθως δεν λειτουργούν 24 ώρες το 24ωρο.",
      group:
        "Μη διστάσετε να νοικιάσετε ένα όχημα μαζί με άλλους (φίλους, οικογένεια κ.λπ.). Υπάρχουν αυτοκίνητα 4, 5 ή 9 θέσεων, καθώς και βαν, που μπορούν να αποτελέσουν πρακτική λύση.",
      help:
        "Αν έχετε οποιαδήποτε απορία, μη διστάσετε να επικοινωνήσετε μαζί μας· θα χαρούμε πολύ να σας βοηθήσουμε.",
    },
    rsvp: {
      eyebrow: "Απαντήστε",
      title: "Επιβεβαίωση Παρουσίας",
      intro:
        "Παρακαλούμε επιβεβαιώστε την παρουσία σας έως τις 17 Μαΐου 2027, ώστε να οργανώσουμε με τον καλύτερο τρόπο αυτή την ημέρα.",
      thankYouTitle: "Ευχαριστούμε!",
      thankYouText:
        "Η απάντησή σας στάλθηκε επιτυχώς. Ανυπομονούμε να σας δούμε στην Αθήνα!",
      name: "Ονοματεπώνυμο",
      namePlaceholder: "Το όνομά σας",
      email: "Email",
      guests: "Αριθμός ατόμων",
      attending: "Θα παρευρεθείτε;",
      yes: "Ναι, με μεγάλη χαρά!",
      no: "Δυστυχώς όχι",
      message: "Ένα μικρό μήνυμα; (προαιρετικό)",
      messagePlaceholder: "Το μήνυμά σας προς το ζευγάρι...",
      submit: "Αποστολή απάντησης",
      sending: "Αποστολή...",
      person: "άτομο",
      people: "άτομα",
      error: "Παρουσιάστηκε σφάλμα. Παρακαλούμε δοκιμάστε ξανά.",
    },
    contact: {
      eyebrow: "Μια ερώτηση;",
      title: "Επικοινωνήστε μαζί μας",
      text:
        "Μη διστάσετε να επικοινωνήσετε μαζί μας για οποιαδήποτε ερώτηση σχετικά με τον γάμο, τις μετακινήσεις ή τη διαμονή. Θα χαρούμε πολύ να σας βοηθήσουμε!",
      cta: "Γράψτε μας",
      date: "17 Ιουλίου 2027",
      footer: "Φτιαγμένο με",
      footerEnd: "για την πιο όμορφη ημέρα μας",
    },
  },
} as const;

type Translations = typeof translations.fr;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("wedding-language");
    return saved === "el" ? "el" : "fr";
  });

  useEffect(() => {
    localStorage.setItem("wedding-language", language);
    document.documentElement.lang = translations[language].meta.htmlLang;
    document.title = translations[language].meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", translations[language].meta.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", translations[language].meta.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", translations[language].meta.ogDescription);
    }
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t: translations[language] }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
