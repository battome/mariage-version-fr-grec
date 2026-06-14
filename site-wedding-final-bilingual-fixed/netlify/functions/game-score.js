import { getStore } from "@netlify/blobs";

const leaderboardKey = "leaderboard";

const categories = [
  { id: "couple", weight: 40 },
  { id: "observation", weight: 30 },
  { id: "fun", weight: 30 },
];

const defaultQuestions = [
  { id: "first-island", category: "couple", answers: ["agistri"] },
  { id: "alexia-birth-city", category: "couple", answers: ["athens"] },
  { id: "alexandre-birth-city", category: "couple", answers: ["paris"] },
  { id: "meeting-month", category: "couple", answers: ["june"] },
  { id: "favorite-series", category: "couple", answers: ["game-of-thrones"] },
  {
    id: "mamma-mia-ranking",
    category: "couple",
    answers: ["lay-all-your-love-on-me|super-trouper|dancing-queen|our-last-summer"],
  },
  { id: "alexandre-greek-song", category: "couple", answers: ["athina-mou"] },
  { id: "rsvp-deadline", category: "observation", answers: ["2027-01-30"] },
  { id: "ceremony-time", category: "observation", answers: ["17h00"] },
  { id: "days-left", category: "observation", answers: ["__DAYS_UNTIL_WEDDING__"] },
  { id: "hidden-hearts", category: "observation", answers: ["8"] },
  { id: "groom-nipples", category: "fun", answers: ["4"] },
  { id: "bride-height", category: "fun", answers: ["1.58"] },
  { id: "donkey-impulse", category: "fun", answers: ["alexandre"] },
  { id: "weird-greek-purchase", category: "fun", answers: ["bull-testicle-nerve"] },
  { id: "alexia-greek-dish", category: "fun", answers: ["papoutsakia"] },
];

const headers = {
  "content-type": "application/json",
  "cache-control": "no-store",
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getDaysUntilWedding = () => {
  const weddingDate = new Date("2027-07-17T14:00:00");
  const diff = weddingDate.getTime() - Date.now();
  return String(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
};

const resolveAnswers = (answers) =>
  answers.map((answer) => (answer === "__DAYS_UNTIL_WEDDING__" ? getDaysUntilWedding() : answer));

const getQuestions = () => {
  if (!process.env.WEDDING_GAME_ANSWERS_JSON) {
    return defaultQuestions;
  }

  try {
    const parsed = JSON.parse(process.env.WEDDING_GAME_ANSWERS_JSON);
    return Array.isArray(parsed) ? parsed : defaultQuestions;
  } catch {
    return defaultQuestions;
  }
};

const toPublicEntry = ({ name, score, date }) => ({
  name,
  score,
  date,
});

const getLeaderboard = async () => {
  const store = getStore("wedding-game");
  const leaderboard = await store.get(leaderboardKey, { type: "json" });
  return Array.isArray(leaderboard) ? leaderboard : [];
};

const saveLeaderboard = async (leaderboard) => {
  const store = getStore("wedding-game");
  await store.setJSON(leaderboardKey, leaderboard);
};

const calculateScore = (answers) => {
  const questions = getQuestions();

  return categories.reduce((total, category) => {
    const categoryQuestions = questions.filter((question) => question.category === category.id);
    const pointsPerQuestion = category.weight / categoryQuestions.length;
    const categoryScore = categoryQuestions.reduce((sum, question) => {
      const givenAnswer = normalize(answers[question.id]);
      const isCorrect = resolveAnswers(question.answers).map(normalize).includes(givenAnswer);
      return isCorrect ? sum + pointsPerQuestion : sum;
    }, 0);

    return total + categoryScore;
  }, 0);
};

export const handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const leaderboard = await getLeaderboard();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ leaderboard: leaderboard.slice(0, 10).map(toPublicEntry) }),
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const name = String(body.name || "").trim();
    const answers = body.answers && typeof body.answers === "object" ? body.answers : {};

    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing player name" }),
      };
    }

    const score = Math.round(calculateScore(answers));
    const entry = {
      name: name.slice(0, 80),
      score,
      answers,
      date: new Date().toISOString(),
    };
    const leaderboard = await getLeaderboard();
    const nextLeaderboard = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    await saveLeaderboard(nextLeaderboard);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        score,
        leaderboard: nextLeaderboard.slice(0, 10).map(toPublicEntry),
      }),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Unable to access game scores" }),
    };
  }
};
