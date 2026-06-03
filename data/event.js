// Fonctions utilitaires
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
export const uid = (prefix = "id") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// Catégories d'événements avec métadonnées
export const CATEGORY_META = {
  Match: { icon: "⚽", gradient: "from-lime-300 via-emerald-300 to-cyan-300", accent: "lime" },
  Blessures: { icon: "🏥", gradient: "from-red-400 via-orange-300 to-amber-200", accent: "red" },
  Moral: { icon: "🧠", gradient: "from-sky-300 via-cyan-300 to-blue-400", accent: "cyan" },
  Vestiaire: { icon: "👥", gradient: "from-violet-300 via-fuchsia-300 to-pink-400", accent: "violet" },
  Médias: { icon: "📰", gradient: "from-amber-300 via-yellow-300 to-orange-400", accent: "amber" },
  Supporters: { icon: "🔥", gradient: "from-rose-300 via-pink-400 to-red-500", accent: "red" },
  Direction: { icon: "🏛️", gradient: "from-slate-200 via-slate-400 to-zinc-500", accent: "slate" },
  Finances: { icon: "💰", gradient: "from-emerald-300 via-teal-300 to-green-400", accent: "green" },
  Mercato: { icon: "✍️", gradient: "from-blue-300 via-indigo-300 to-violet-400", accent: "blue" },
  Formation: { icon: "🌱", gradient: "from-green-300 via-lime-300 to-emerald-400", accent: "green" },
  Staff: { icon: "📊", gradient: "from-purple-300 via-indigo-300 to-blue-300", accent: "violet" },
  Compétitions: { icon: "🏆", gradient: "from-orange-300 via-amber-300 to-yellow-300", accent: "amber" },
};

// Événements simplifiés (pour éviter les erreurs)
export const EVENT_TEMPLATES = {
  Match: [
    {
      title: "Victoire écrasante !",
      hook: "Ton équipe a dominé l'adversaire avec un score de 3-0 !",
      trigger: "victoire avec +3 buts d’écart",
      choices: ["Célébrer avec les joueurs", "Rester humble", "Revoir la vidéo", "Ignorer"],
      consequences: [
        { morale: 10, reputation: 5, popularity: 15 },
        { morale: 5, reputation: 10, popularity: 10 },
        { morale: 0, reputation: 0, popularity: 0 },
        { morale: -2, reputation: -1, popularity: -5 }
      ],
      illustration: CATEGORY_META.Match,
      getDynamicData: () => ({})
    }
  ],
  Blessures: [
    {
      title: "Blessure pour un joueur !",
      hook: "Un joueur s'est blessé à l'entraînement. Diagnostic : Entorse (2 semaines).",
      trigger: "joueur avec fatigue > 80",
      choices: ["Repos forcé", "Traitement accéléré", "Jouer malgré la blessure", "Recruter un remplaçant"],
      consequences: [
        { morale: -5, playerInjuryWeeks: 2 },
        { morale: -2, playerInjuryWeeks: 1, budget: -0.5 },
        { morale: -10, playerInjuryWeeks: 4 },
        { morale: +5, budget: -1 }
      ],
      illustration: CATEGORY_META.Blessures,
      getDynamicData: () => ({})
    }
  ]
};