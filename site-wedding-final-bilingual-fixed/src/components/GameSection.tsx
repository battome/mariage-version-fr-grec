import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Gift, RotateCcw, Send, Sparkles, Trophy, X } from "lucide-react";
import { Language, useLanguage } from "@/lib/i18n";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import HiddenHeart from "@/components/HiddenHeart";

type CategoryId = "couple" | "observation" | "fun";
type QuestionKind = "choice" | "ranking" | "text";

type LocalizedText = Record<Language, string>;

type Option = {
  value: string;
  label: LocalizedText;
};

type Question = {
  id: string;
  category: CategoryId;
  kind: QuestionKind;
  prompt: LocalizedText;
  options?: Option[];
};

type BonusQuestion = {
  id: string;
  prompt: LocalizedText;
  options: Option[];
};

type LeaderboardEntry = {
  name: string;
  score: number;
  created_at: string;
};

const labels = {
  fr: {
    eyebrow: "Jeu des invités",
    title: "Le quiz des mariés",
    reward: "À la clé des récompenses extraordinaires",
    open: "Jouer au quiz",
    intro:
      "Répondez aux questions, cherchez les indices sur le site et tentez de grimper dans le classement des invités.",
    teamName: "NOM PRÉNOM",
    teamPlaceholder: "Votre nom",
    email: "ADRESSE MAIL",
    emailPlaceholder: "votre@email.com",
    submit: "Valider mes réponses",
    replay: "Rejouer",
    score: "Votre score",
    ranking: "Classement",
    emptyRanking: "Aucun score pour le moment.",
    loadingRanking: "Chargement du classement...",
    answerPlaceholder: "Votre réponse",
    choose: "Choisir",
    rankPlaceholder: "Choisir une chanson",
    bonusTitle: "Bonus",
    close: "Fermer",
    saved: "Score enregistré",
    sending: "Calcul du score...",
    error:
      "Impossible d'enregistrer le score pour le moment. Vérifie la table et les variables Supabase.",
    duplicateEmail: "Cette adresse mail a déjà été utilisée pour jouer.",
    categories: {
      couple: "Questions sur les mariés",
      observation: "Questions d'observation",
      fun: "Questions fun et improbables",
    },
    notes: {
      observation: "Les réponses sont visibles sur le site.",
      fun: "Les invités doivent deviner ce que les mariés répondraient.",
    },
  },
  el: {
    eyebrow: "Παιχνίδι καλεσμένων",
    title: "Το κουίζ του ζευγαριού",
    reward: "Με εξαιρετικά δώρα στο τέλος",
    open: "Παίξτε το κουίζ",
    intro:
      "Απαντήστε στις ερωτήσεις, βρείτε στοιχεία στον ιστότοπο και ανεβείτε στην κατάταξη των καλεσμένων.",
    teamName: "ΟΝΟΜΑ ΕΠΩΝΥΜΟ",
    teamPlaceholder: "Το όνομά σας",
    email: "EMAIL",
    emailPlaceholder: "to-email-sas@example.com",
    submit: "Υποβολή απαντήσεων",
    replay: "Παίξτε ξανά",
    score: "Η βαθμολογία σας",
    ranking: "Κατάταξη",
    emptyRanking: "Δεν υπάρχει ακόμα βαθμολογία.",
    loadingRanking: "Φόρτωση κατάταξης...",
    answerPlaceholder: "Η απάντησή σας",
    choose: "Επιλογή",
    rankPlaceholder: "Επιλέξτε τραγούδι",
    bonusTitle: "Μπόνους",
    close: "Κλείσιμο",
    saved: "Η βαθμολογία αποθηκεύτηκε",
    sending: "Υπολογισμός βαθμολογίας...",
    error:
      "Δεν ήταν δυνατή η αποθήκευση της βαθμολογίας. Ελέγξτε τον πίνακα και τις μεταβλητές Supabase.",
    duplicateEmail: "Αυτή η διεύθυνση email έχει ήδη χρησιμοποιηθεί για το παιχνίδι.",
    categories: {
      couple: "Ερωτήσεις για το ζευγάρι",
      observation: "Ερωτήσεις παρατήρησης",
      fun: "Αστείες και απρόβλεπτες ερωτήσεις",
    },
    notes: {
      observation: "Οι απαντήσεις φαίνονται στον ιστότοπο.",
      fun: "Οι καλεσμένοι πρέπει να μαντέψουν τι θα απαντούσε το ζευγάρι.",
    },
  },
} as const;

const categories: Array<{ id: CategoryId; weight: number }> = [
  { id: "couple", weight: 40 },
  { id: "observation", weight: 30 },
  { id: "fun", weight: 30 },
];

const getDaysUntilWedding = () => {
  const weddingDate = new Date("2027-07-17T14:00:00");
  const diff = weddingDate.getTime() - Date.now();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const daysUntilWedding = getDaysUntilWedding();

const correctAnswers: Record<string, string> = {
  "first-island": "agistri",
  "alexia-birth-city": "athens",
  "alexandre-birth-city": "paris",
  "meeting-month": "june",
  "favorite-series": "game-of-thrones",
  "mamma-mia-ranking": "lay-all-your-love-on-me|super-trouper|dancing-queen|our-last-summer",
  "alexandre-greek-song": "athina-mou",
  "rsvp-deadline": "2027-01-30",
  "ceremony-time": "17h00",
  "days-left": String(daysUntilWedding),
  "hidden-hearts": "8",
  "groom-nipples": "4",
  "bride-height": "1.58",
  "donkey-impulse": "alexandre",
  "weird-greek-purchase": "bull-testicle-nerve",
  "alexia-greek-dish": "papoutsakia",
};

const calculateScore = (answers: Record<string, string>) => {
  const scoreByCategory = categories.reduce(
    (total, category) => {
      const categoryQuestions = questions.filter((question) => question.category === category.id);
      const correctCount = categoryQuestions.filter(
        (question) => answers[question.id] === correctAnswers[question.id],
      ).length;

      if (categoryQuestions.length === 0) {
        return total;
      }

      return total + (correctCount / categoryQuestions.length) * category.weight;
    },
    0,
  );

  return Math.round(scoreByCategory);
};

const bonusQuestion: BonusQuestion = {
  id: "winner-prediction",
  prompt: {
    fr: "D'après toi, qui remportera le quiz, plutôt ... 😊",
    el: "Κατά τη γνώμη σου, ποιος θα κερδίσει το κουίζ, μάλλον ... 😊",
  },
  options: [
    { value: "bride-friend", label: { fr: "Amis de la mariée", el: "Φίλοι της νύφης" } },
    { value: "bride-family", label: { fr: "Famille de la mariée", el: "Οικογένεια της νύφης" } },
    { value: "groom-friend", label: { fr: "Amis du marié", el: "Φίλοι του γαμπρού" } },
    { value: "groom-family", label: { fr: "Famille du marié", el: "Οικογένεια του γαμπρού" } },
  ],
};

const questions: Question[] = [
  {
    id: "first-island",
    category: "couple",
    kind: "choice",
    prompt: {
      fr: "Quelle île les mariés ont-ils visitée ensemble pour la première fois ?",
      el: "Ποιο νησί επισκέφτηκε το ζευγάρι μαζί για πρώτη φορά;",
    },
    options: [
      { value: "agistri", label: { fr: "Agistri", el: "Αγκίστρι" } },
      { value: "santorin", label: { fr: "Santorin", el: "Σαντορίνη" } },
      { value: "paros", label: { fr: "Paros", el: "Πάρος" } },
      { value: "mykonos", label: { fr: "Mykonos", el: "Μύκονος" } },
    ],
  },
  {
    id: "alexia-birth-city",
    category: "couple",
    kind: "choice",
    prompt: {
      fr: "Dans quelle ville Alexia est-elle née ?",
      el: "Σε ποια πόλη γεννήθηκε η Alexia;",
    },
    options: [
      { value: "athens", label: { fr: "Athènes", el: "Αθήνα" } },
      { value: "sparta", label: { fr: "Sparte", el: "Σπάρτη" } },
      { value: "kalamata", label: { fr: "Kalamata", el: "Καλαμάτα" } },
      { value: "thessaloniki", label: { fr: "Thessalonique", el: "Θεσσαλονίκη" } },
    ],
  },
  {
    id: "alexandre-birth-city",
    category: "couple",
    kind: "choice",
    prompt: {
      fr: "Dans quelle ville Alexandre est-il né ?",
      el: "Σε ποια πόλη γεννήθηκε ο Alexandre;",
    },
    options: [
      { value: "paris", label: { fr: "Paris", el: "Παρίσι" } },
      { value: "lyon", label: { fr: "Lyon", el: "Λυών" } },
      { value: "nice", label: { fr: "Nice", el: "Νίκαια" } },
      { value: "saumur", label: { fr: "Saumur", el: "Σωμύρ" } },
    ],
  },
  {
    id: "meeting-month",
    category: "couple",
    kind: "choice",
    prompt: {
      fr: "Quel est le mois de leur rencontre ?",
      el: "Ποιος είναι ο μήνας της γνωριμίας τους;",
    },
    options: [
      { value: "march", label: { fr: "Mars", el: "Μάρτιος" } },
      { value: "june", label: { fr: "Juin", el: "Ιούνιος" } },
      { value: "september", label: { fr: "Septembre", el: "Σεπτέμβριος" } },
      { value: "october", label: { fr: "Octobre", el: "Οκτώβριος" } },
    ],
  },
  {
    id: "favorite-series",
    category: "couple",
    kind: "choice",
    prompt: {
      fr: "Quelle est la série préférée des mariés ?",
      el: "Ποια είναι η αγαπημένη σειρά του ζευγαριού;",
    },
    options: [
      { value: "stranger-things", label: { fr: "Stranger Things", el: "Stranger Things" } },
      { value: "game-of-thrones", label: { fr: "Game of Thrones", el: "Game of Thrones" } },
      { value: "breaking-bad", label: { fr: "Breaking Bad", el: "Breaking Bad" } },
      { value: "shameless", label: { fr: "Shameless", el: "Shameless" } },
    ],
  },
  {
    id: "mamma-mia-ranking",
    category: "couple",
    kind: "ranking",
    prompt: {
      fr: "Classez ces chansons de Mamma Mia dans l'ordre de préférence des mariés.",
      el: "Βάλτε αυτά τα τραγούδια του Mamma Mia στη σειρά προτίμησης του ζευγαριού.",
    },
    options: [
      { value: "lay-all-your-love-on-me", label: { fr: "Lay All Your Love On Me", el: "Lay All Your Love On Me" } },
      { value: "super-trouper", label: { fr: "Super Trouper", el: "Super Trouper" } },
      { value: "dancing-queen", label: { fr: "Dancing Queen", el: "Dancing Queen" } },
      { value: "our-last-summer", label: { fr: "Our Last Summer", el: "Our Last Summer" } },
    ],
  },
  {
    id: "alexandre-greek-song",
    category: "couple",
    kind: "choice",
    prompt: {
      fr: "Quelle est la chanson grecque préférée d'Alexandre ?",
      el: "Ποιο είναι το αγαπημένο ελληνικό τραγούδι του Alexandre;",
    },
    options: [
      { value: "athina-mou", label: { fr: "Athina Mou", el: "Athina Mou" } },
      { value: "madame", label: { fr: "Madame", el: "Madame" } },
      { value: "sigharitiria", label: { fr: "Sigharitiria", el: "Sigharitiria" } },
      { value: "anaveis-foties", label: { fr: "Anaveis Foties", el: "Anaveis Foties" } },
    ],
  },
  {
    id: "rsvp-deadline",
    category: "observation",
    kind: "choice",
    prompt: {
      fr: "Quelle est la date limite pour confirmer votre présence au mariage ?",
      el: "Ποια είναι η προθεσμία για να επιβεβαιώσετε την παρουσία σας στον γάμο;",
    },
    options: [
      { value: "2027-01-15", label: { fr: "15 janvier 2027", el: "15 Ιανουαρίου 2027" } },
      { value: "2027-02-15", label: { fr: "15 février 2027", el: "15 Φεβρουαρίου 2027" } },
      { value: "2027-01-30", label: { fr: "30 janvier 2027", el: "30 Ιανουαρίου 2027" } },
      { value: "2027-03-01", label: { fr: "1er mars 2027", el: "1 Μαρτίου 2027" } },
    ],
  },
  {
    id: "ceremony-time",
    category: "observation",
    kind: "choice",
    prompt: {
      fr: "À quelle heure débute la cérémonie ?",
      el: "Τι ώρα αρχίζει η τελετή;",
    },
    options: [
      { value: "16h30", label: { fr: "16h30", el: "16:30" } },
      { value: "18h00", label: { fr: "18h00", el: "18:00" } },
      { value: "17h00", label: { fr: "17h00", el: "17:00" } },
      { value: "19h00", label: { fr: "19h00", el: "19:00" } },
    ],
  },
  {
    id: "days-left",
    category: "observation",
    kind: "choice",
    prompt: {
      fr: "Combien de jours reste-t-il avant le mariage ?",
      el: "Πόσες ημέρες απομένουν μέχρι τον γάμο;",
    },
    options: [
      { value: String(Math.max(0, daysUntilWedding - 2)), label: { fr: String(Math.max(0, daysUntilWedding - 2)), el: String(Math.max(0, daysUntilWedding - 2)) } },
      { value: String(daysUntilWedding + 5), label: { fr: String(daysUntilWedding + 5), el: String(daysUntilWedding + 5) } },
      { value: String(daysUntilWedding), label: { fr: String(daysUntilWedding), el: String(daysUntilWedding) } },
      { value: String(daysUntilWedding + 12), label: { fr: String(daysUntilWedding + 12), el: String(daysUntilWedding + 12) } },
    ],
  },
  {
    id: "hidden-hearts",
    category: "observation",
    kind: "choice",
    prompt: {
      fr: "Combien de cœurs sont dissimulés sur les différentes pages du site ?",
      el: "Πόσες καρδιές είναι κρυμμένες στις διαφορετικές σελίδες του ιστότοπου;",
    },
    options: [
      { value: "3", label: { fr: "3", el: "3" } },
      { value: "5", label: { fr: "5", el: "5" } },
      { value: "8", label: { fr: "8", el: "8" } },
      { value: "10", label: { fr: "10", el: "10" } },
    ],
  },
  {
    id: "groom-nipples",
    category: "fun",
    kind: "choice",
    prompt: {
      fr: "Combien de tétons possède le marié ?",
      el: "Πόσες θηλές έχει ο γαμπρός;",
    },
    options: [
      { value: "2", label: { fr: "2", el: "2" } },
      { value: "3", label: { fr: "3", el: "3" } },
      { value: "4", label: { fr: "4", el: "4" } },
      { value: "no-answer", label: { fr: "Alexandre refuse de répondre", el: "Ο Alexandre αρνείται να απαντήσει" } },
    ],
  },
  {
    id: "bride-height",
    category: "fun",
    kind: "choice",
    prompt: {
      fr: "Quelle est la taille de la mariée ?",
      el: "Ποιο είναι το ύψος της νύφης;",
    },
    options: [
      { value: "1.53", label: { fr: "1,53 m", el: "1,53 μ." } },
      { value: "1.58", label: { fr: "1,58 m", el: "1,58 μ." } },
      { value: "1.63", label: { fr: "1,63 m", el: "1,63 μ." } },
      { value: "1.68", label: { fr: "1,68 m", el: "1,68 μ." } },
    ],
  },
  {
    id: "donkey-impulse",
    category: "fun",
    kind: "choice",
    prompt: {
      fr: "Qui serait le plus susceptible d'acheter un âne en Grèce sur un coup de tête ?",
      el: "Ποιος θα ήταν πιο πιθανό να αγοράσει έναν γάιδαρο στην Ελλάδα αυθόρμητα;",
    },
    options: [
      { value: "alexia", label: { fr: "Alexia", el: "Alexia" } },
      { value: "alexandre", label: { fr: "Alexandre", el: "Alexandre" } },
      { value: "both", label: { fr: "Les deux", el: "Και οι δύο" } },
      { value: "donkey-buys-alexandre", label: { fr: "L'âne achèterait Alexandre", el: "Ο γάιδαρος θα αγόραζε τον Alexandre" } },
    ],
  },
  {
    id: "weird-greek-purchase",
    category: "fun",
    kind: "choice",
    prompt: {
      fr: "Quelle est la chose la plus improbable qu'Alexandre ait achetée en Grèce pour la ramener en France ?",
      el: "Ποιο είναι το πιο απίθανο πράγμα που αγόρασε ο Alexandre στην Ελλάδα για να το φέρει στη Γαλλία;",
    },
    options: [
      { value: "goat-bell", label: { fr: "Une cloche de chèvre", el: "Ένα κουδούνι κατσίκας" } },
      { value: "traditional-costume", label: { fr: "Un costume traditionnel", el: "Μια παραδοσιακή φορεσιά" } },
      { value: "bull-testicle-nerve", label: { fr: "Un nerf de testicule de bœuf", el: "Ένα νεύρο από όρχι βοδιού" } },
      { value: "greek-god-portrait", label: { fr: "Un portrait de lui-même en dieu grec", el: "Ένα πορτρέτο του ως Έλληνας θεός" } },
    ],
  },
  {
    id: "alexia-greek-dish",
    category: "fun",
    kind: "choice",
    prompt: {
      fr: "Quel est le plat grec préféré d'Alexia ?",
      el: "Ποιο είναι το αγαπημένο ελληνικό φαγητό της Alexia;",
    },
    options: [
      { value: "papoutsakia", label: { fr: "Papoutsakia", el: "Παπουτσάκια" } },
      { value: "stuffed-tomatoes", label: { fr: "Tomates farcies", el: "Γεμιστά" } },
      { value: "gigantes", label: { fr: "Gigantes", el: "Γίγαντες" } },
      { value: "giouvetsi", label: { fr: "Giouvetsi", el: "Γιουβέτσι" } },
    ],
  },
];

const GameSection = () => {
  const { language } = useLanguage();
  const copy = labels[language];
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const questionsByCategory = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        questions: questions.filter((question) => question.category === category.id),
      })),
    [],
  );

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      if (!supabase) {
        setLeaderboard([]);
        setLeaderboardLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("wedding_quiz_results")
          .select("name, score, created_at")
          .order("score", { ascending: false })
          .order("created_at", { ascending: true })
          .limit(10);

        if (error) {
          throw error;
        }

        if (active && Array.isArray(data)) {
          setLeaderboard(data);
        }
      } catch {
        if (active) {
          setLeaderboard([]);
        }
      } finally {
        if (active) {
          setLeaderboardLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured");
      }

      const nextScore = calculateScore(answers);
      const normalizedEmail = playerEmail.trim().toLowerCase();
      const { error: insertError } = await supabase.from("wedding_quiz_results").insert({
        name: playerName.trim(),
        email: normalizedEmail,
        score: nextScore,
        answers,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setError(copy.duplicateEmail);
          return;
        }

        throw insertError;
      }

      setScore(nextScore);

      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("wedding_quiz_results")
        .select("name, score, created_at")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(10);

      if (leaderboardError) {
        throw leaderboardError;
      }

      setLeaderboard(leaderboardData || []);
    } catch {
      setError(copy.error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetGame = () => {
    setPlayerName("");
    setPlayerEmail("");
    setAnswers({});
    setScore(null);
  };

  const leaderboardPanel = (
    <div className="editorial-panel">
      <div className="mb-5 flex items-center gap-3">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="font-display text-2xl">{copy.ranking}</h3>
      </div>

      {leaderboardLoading ? (
        <p className="text-muted-foreground">{copy.loadingRanking}</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-muted-foreground">{copy.emptyRanking}</p>
      ) : (
        <ol className="space-y-3">
          {leaderboard.map((entry, index) => (
            <li
              key={`${entry.name}-${entry.created_at}`}
              className="flex items-center justify-between gap-4 rounded-sm border border-border/80 bg-white/50 px-3 py-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                  {index + 1}
                </span>
                <span className="truncate font-accent text-lg">{entry.name}</span>
              </span>
              <span className="flex items-center gap-1 font-display text-xl text-primary">
                {entry.score}
                {index === 0 && <CheckCircle2 className="h-4 w-4" />}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  return (
    <section id="jeu" className="wedding-section bg-secondary/30">
      <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-gold-light/35 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-sea-light/40 blur-3xl" />
      <HiddenHeart className="right-[14%] top-16 rotate-12" />

      <div className="wedding-container relative">
        <p className="section-eyebrow">{copy.eyebrow}</p>
        <h2 className="section-title">{copy.title}</h2>
        <div className="wedding-divider" />
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground md:text-lg">
          {copy.intro}
        </p>

        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="editorial-panel group block w-full text-center transition-transform duration-300 hover:-translate-y-1"
          >
            <Gift className="mx-auto mb-5 h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="block font-display text-4xl font-medium text-foreground md:text-6xl">
              {copy.title}
            </span>
            <span className="mt-4 block font-accent text-2xl italic text-primary md:text-3xl">
              {copy.reward}
            </span>
            <span className="btn-wedding mt-8">{copy.open}</span>
          </button>

          {leaderboardPanel}
        </div>

        {open && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/70 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wedding-game-title"
          >
            <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-background shadow-2xl shadow-foreground/30">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur md:px-8">
                <div>
                  <p className="font-accent text-sm uppercase tracking-[0.24em] text-primary/70">
                    {copy.eyebrow}
                  </p>
                  <h3 id="wedding-game-title" className="font-display text-2xl md:text-3xl">
                    {copy.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white/70 text-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label={copy.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[1fr_0.38fr]">
                <form onSubmit={handleSubmit} className="editorial-panel space-y-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-accent text-xl">{copy.teamName}</label>
                <input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  className="w-full rounded-sm border border-border bg-white/75 px-4 py-3 font-body transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={copy.teamPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-accent text-xl">{copy.email}</label>
                <input
                  type="email"
                  value={playerEmail}
                  onChange={(event) => setPlayerEmail(event.target.value)}
                  className="w-full rounded-sm border border-border bg-white/75 px-4 py-3 font-body transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={copy.emailPlaceholder}
                  required
                />
              </div>
            </div>

            {questionsByCategory.map((category) => (
              <div key={category.id} className="space-y-5 border-t border-border/80 pt-7 first:border-t-0 first:pt-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="font-display text-2xl text-foreground">
                    {copy.categories[category.id]}
                  </h3>
                  <span className="rounded-full border border-accent/70 bg-accent/20 px-3 py-1 text-sm text-primary">
                    {category.weight} pts
                  </span>
                </div>

                {copy.notes[category.id] && (
                  <p className="text-muted-foreground">{copy.notes[category.id]}</p>
                )}

                <div className="space-y-5">
                  {category.questions.map((question, index) => (
                    <fieldset key={question.id} className="rounded-md border border-white/70 bg-white/45 p-4">
                      <legend className="px-1 font-accent text-lg text-foreground">
                        {index + 1}. {question.prompt[language]}
                      </legend>

                      {question.kind === "choice" && question.options ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {question.options.map((option) => (
                            <label
                              key={option.value}
                              className={`cursor-pointer rounded-sm border px-4 py-3 transition-all ${
                                answers[question.id] === option.value
                                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                                  : "border-border bg-background/70 hover:border-primary/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option.value}
                                checked={answers[question.id] === option.value}
                                onChange={(event) =>
                                  setAnswers((current) => ({
                                    ...current,
                                    [question.id]: event.target.value,
                                  }))
                                }
                                className="sr-only"
                                required
                              />
                              <span className="font-accent text-lg">{option.label[language]}</span>
                            </label>
                          ))}
                        </div>
                      ) : question.kind === "ranking" && question.options ? (
                        <div className="mt-4 space-y-3">
                          {question.options.map((_, rankIndex) => {
                            const selectedValues = (answers[question.id] || "").split("|");

                            return (
                              <label key={rankIndex} className="grid gap-2 sm:grid-cols-[3rem_1fr] sm:items-center">
                                <span className="font-display text-2xl text-primary">
                                  {rankIndex + 1}.
                                </span>
                                <select
                                  value={selectedValues[rankIndex] || ""}
                                  onChange={(event) => {
                                    const nextValues = [...selectedValues];
                                    nextValues[rankIndex] = event.target.value;
                                    setAnswers((current) => ({
                                      ...current,
                                      [question.id]: nextValues.join("|"),
                                    }));
                                  }}
                                  className="w-full rounded-sm border border-border bg-background/75 px-4 py-3 font-body transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  required
                                >
                                  <option value="">{copy.rankPlaceholder}</option>
                                  {question.options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                      disabled={
                                        selectedValues.includes(option.value) &&
                                        selectedValues[rankIndex] !== option.value
                                      }
                                    >
                                      {option.label[language]}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          value={answers[question.id] || ""}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: event.target.value,
                            }))
                          }
                          className="mt-4 w-full rounded-sm border border-border bg-background/75 px-4 py-3 font-body transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder={copy.answerPlaceholder}
                          required
                        />
                      )}
                    </fieldset>
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-5 border-t border-border/80 pt-7">
              <h3 className="font-display text-2xl text-foreground">{copy.bonusTitle}</h3>
              <fieldset className="rounded-md border border-white/70 bg-white/45 p-4">
                <legend className="px-1 font-accent text-lg text-foreground">
                  {bonusQuestion.prompt[language]}
                </legend>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {bonusQuestion.options.map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-sm border px-4 py-3 transition-all ${
                        answers[bonusQuestion.id] === option.value
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                          : "border-border bg-background/70 hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={bonusQuestion.id}
                        value={option.value}
                        checked={answers[bonusQuestion.id] === option.value}
                        onChange={(event) =>
                          setAnswers((current) => ({
                            ...current,
                            [bonusQuestion.id]: event.target.value,
                          }))
                        }
                        className="sr-only"
                        required
                      />
                      <span className="font-accent text-lg">{option.label[language]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="btn-wedding flex-1 gap-2">
                <Send className="h-4 w-4" />
                {submitting ? copy.sending : copy.submit}
              </button>
              {score !== null && (
                <button type="button" onClick={resetGame} className="btn-wedding-outline gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {copy.replay}
                </button>
              )}
            </div>

            {error && (
              <p className="rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
                </form>

                <aside className="space-y-6">
            <div className="editorial-panel text-center">
              <Sparkles className="mx-auto mb-4 h-9 w-9 text-primary" />
              <p className="font-accent text-xl text-muted-foreground">{copy.score}</p>
              <p className="font-display text-6xl text-foreground">
                {score === null ? "--" : score}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-primary/70">
                {score === null ? "100 pts" : copy.saved}
              </p>
            </div>

            {leaderboardPanel}
                </aside>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GameSection;
