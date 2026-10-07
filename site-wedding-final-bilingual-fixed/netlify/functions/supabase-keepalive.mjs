// Fonction planifiée Netlify : empêche la mise en pause du projet Supabase (plan Free).
// Supabase met un projet gratuit en pause après 7 jours sans activité ; cette fonction
// fait une lecture légère sur la table du quiz tous les 3 jours.

export default async () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("keepalive supabase : VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquante");
    return new Response("Supabase non configuré", { status: 500 });
  }

  const response = await fetch(`${url}/rest/v1/wedding_quiz_results?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  console.log(`keepalive supabase : HTTP ${response.status}`);

  return new Response(response.ok ? "ok" : `erreur ${response.status}`, {
    status: response.ok ? 200 : 502,
  });
};

export const config = {
  schedule: "0 6 */3 * *",
};
