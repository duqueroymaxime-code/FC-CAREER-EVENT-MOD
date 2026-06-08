export const PLAYER_POSITIONS = [
  "GB",
  "DD",
  "DC",
  "DG",
  "MDC",
  "MC",
  "MOC",
  "AD",
  "AG",
  "BU",
];

export const PLAYER_ARCHETYPES = [
  {
    id: "finisher",
    label: "Finisseur",
    description: "Attaquant froid devant le but, performant dans la surface.",
    bonuses: {
      finishing: 6,
      composure: 4,
      mediaPressure: 2,
    },
  },
  {
    id: "creator",
    label: "CrÃ©atif",
    description: "Joueur technique qui influence le jeu par la passe et la vision.",
    bonuses: {
      passing: 6,
      vision: 5,
      physical: -2,
    },
  },
  {
    id: "box_to_box",
    label: "Box-to-box",
    description: "Milieu complet, gros volume de jeu et activitÃ© constante.",
    bonuses: {
      stamina: 6,
      workRate: 5,
      fatigue: 4,
    },
  },
  {
    id: "winger",
    label: "Ailier rapide",
    description: "Joueur explosif, utile en un contre un et en transition.",
    bonuses: {
      pace: 7,
      dribbling: 4,
      strength: -2,
    },
  },
  {
    id: "sentinel",
    label: "Sentinelle",
    description: "Milieu dÃ©fensif disciplinÃ©, protecteur de la dÃ©fense.",
    bonuses: {
      defending: 6,
      leadership: 3,
      popularity: -1,
    },
  },
];

export const PLAYER_PERSONALITIES = [
  {
    id: "humble",
    label: "Humble",
    description: "RespectÃ© par le vestiaire et apprÃ©ciÃ© du coach.",
    effects: {
      coachTrust: 6,
      dressingRoom: 6,
      popularity: -2,
    },
  },
  {
    id: "ambitious",
    label: "Ambitieux",
    description: "Progresse vite mais pense rapidement Ã  lâ€™Ã©tape suivante.",
    effects: {
      progression: 6,
      agentTrust: 5,
      transferDesire: 4,
    },
  },
  {
    id: "star",
    label: "Star",
    description: "Attire la lumiÃ¨re, les sponsors et les mÃ©dias.",
    effects: {
      popularity: 8,
      followers: 20000,
      mediaPressure: 6,
    },
  },
  {
    id: "professional",
    label: "Professionnel",
    description: "RÃ©gulier, sÃ©rieux et fiable sur le long terme.",
    effects: {
      form: 5,
      morale: 4,
      mediaPressure: -2,
    },
  },
  {
    id: "rebel",
    label: "Rebelle",
    description: "Fort caractÃ¨re, imprÃ©visible, souvent mÃ©diatisÃ©.",
    effects: {
      popularity: 5,
      mediaPressure: 7,
      coachTrust: -5,
    },
  },
  {
    id: "loyal",
    label: "Loyal",
    description: "TrÃ¨s attachÃ© au club et aux supporters.",
    effects: {
      supporters: 8,
      dressingRoom: 4,
      transferDesire: -5,
    },
  },
];

export const PLAYER_ORIGINS = [
  {
    id: "academy",
    label: "Centre de formation",
    description: "FormÃ© dans un environnement structurÃ©.",
    effects: {
      coachTrust: 5,
      reputation: 3,
    },
  },
  {
    id: "street",
    label: "Rue",
    description: "Profil imprÃ©visible, technique et populaire.",
    effects: {
      dribbling: 5,
      popularity: 5,
      discipline: -2,
    },
  },
  {
    id: "university",
    label: "UniversitÃ©",
    description: "Parcours atypique, mental fort et image propre.",
    effects: {
      leadership: 4,
      reputation: 4,
    },
  },
  {
    id: "private_academy",
    label: "AcadÃ©mie privÃ©e",
    description: "TrÃ¨s bon environnement de progression, mais pression Ã©levÃ©e.",
    effects: {
      potential: 3,
      mediaPressure: 3,
    },
  },
  {
    id: "amateur_club",
    label: "Club amateur",
    description: "DÃ©part bas, potentiel narratif important.",
    effects: {
      morale: 5,
      reputation: -3,
    },
  },
];

export const PLAYER_CAREER_GOALS = [
  "Gagner le Ballon dâ€™Or",
  "Devenir capitaine",
  "Gagner la Ligue des Champions",
  "Devenir une icÃ´ne du club",
  "Porter la sÃ©lection nationale",
  "Battre des records",
  "Devenir une lÃ©gende mondiale",
];

export const DEFAULT_PLAYER_CAREER = {
  created: false,

  identity: {
  firstName: "Max",
  lastName: "Legend",
  age: 18,
  nationality: "France",
  club: "Real Sociedad",
  position: "BU",
  secondaryPositions: [],
  strongFoot: "Droit",
  height: 180,
  weight: 75,
  avatarUrl: "",
  clubLogoUrl: "",
  clubCity: "",
  stadiumName: "",
  stadiumImageUrl: "",
  primaryColor: "#22d3ee",
  secondaryColor: "#a78bfa",
},

  profile: {
    overall: 68,
    potential: 88,
    hiddenPotential: 91,
    archetype: "finisher",
    personality: "ambitious",
    origin: "academy",
    careerGoal: "Gagner le Ballon dâ€™Or",
    traits: [],
    level: 1,
    xp: 0,
    skillPoints: 0,
  },

  state: {
    form: 60,
    morale: 70,
    fatigue: 20,
    coachTrust: 50,
    dressingRoom: 50,
    agentTrust: 50,
    supporters: 50,
    reputation: 40,
    popularity: 35,
    mediaPressure: 20,
    transferDesire: 10,
  },

  stats: {
    matches: 0,
    goals: 0,
    assists: 0,
    averageRating: 6.8,
    trophies: [],
    awards: [],
    records: [],
  },

  contract: {
    salary: 12000,
    yearsLeft: 3,
    status: "Rotation",
    releaseClause: null,
    promises: [],
  },

  world: {
    followers: 10000,
    sponsors: [],
    news: [],
    socialFeed: [],
    storylines: [],
    timeline: [],
  },
};

export function clamp(value, min = 0, max = 100) {
  const parsed = Number(value);
  const safe = Number.isFinite(parsed) ? parsed : 0;
  return Math.max(min, Math.min(max, Math.round(safe)));
}

export function createTimelineEvent(label, detail = "") {
  return {
    id: "player-event-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    date: new Date().toISOString(),
    label,
    detail,
  };
}

export function normalizePlayerCareer(playerCareer) {
  const source = playerCareer || {};

  return {
    ...DEFAULT_PLAYER_CAREER,
    ...source,

    identity: {
      ...DEFAULT_PLAYER_CAREER.identity,
      ...(source.identity || {}),
    },

    profile: {
      ...DEFAULT_PLAYER_CAREER.profile,
      ...(source.profile || {}),
    },

    state: {
      ...DEFAULT_PLAYER_CAREER.state,
      ...(source.state || {}),
    },

    stats: {
      ...DEFAULT_PLAYER_CAREER.stats,
      ...(source.stats || {}),
    },

    contract: {
      ...DEFAULT_PLAYER_CAREER.contract,
      ...(source.contract || {}),
    },

    world: {
      ...DEFAULT_PLAYER_CAREER.world,
      ...(source.world || {}),
      timeline: Array.isArray(source.world?.timeline)
        ? source.world.timeline
        : [],
      news: Array.isArray(source.world?.news) ? source.world.news : [],
      socialFeed: Array.isArray(source.world?.socialFeed)
        ? source.world.socialFeed
        : [],
      storylines: Array.isArray(source.world?.storylines)
        ? source.world.storylines
        : [],
    },
  };
}

