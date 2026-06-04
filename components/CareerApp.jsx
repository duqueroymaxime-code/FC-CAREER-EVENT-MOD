"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fifa-career-overhaul-real-leagues-v6";
const DEFAULT_THEME = "dark";
const DEFAULT_SCREEN = "home";
const DEFAULT_TAB = "dashboard";
const DEFAULT_TYPE = "manager";
const EVENT_MEMORY_LIMIT = 12;

const CLUBS = [
  {
    name: "Girondins de Bordeaux",
    league: "National 2",
    budget: 4,
    reputation: 67,
    objectives: "Remontée sportive et reconstruction du statut pro",
    colors: ["#001b44", "#7f1734"],
  },
  {
    name: "Paris Saint-Germain",
    league: "Ligue 1",
    budget: 180,
    reputation: 93,
    objectives: "Titre national et parcours européen",
    colors: ["#001f5b", "#e30613"],
  },
  {
    name: "Olympique de Marseille",
    league: "Ligue 1",
    budget: 72,
    reputation: 82,
    objectives: "Top 4 et identité forte",
    colors: ["#0ea5e9", "#ffffff"],
  },
  {
    name: "Arsenal",
    league: "Premier League",
    budget: 130,
    reputation: 89,
    objectives: "Jouer le titre et développer les jeunes",
    colors: ["#dc2626", "#ffffff"],
  },
];

const LEAGUE_PRESETS = {
  "Ligue 1": [
    { name: "Paris Saint-Germain", strength: 91 },
    { name: "Olympique de Marseille", strength: 82 },
    { name: "AS Monaco", strength: 80 },
    { name: "Olympique Lyonnais", strength: 78 },
    { name: "LOSC Lille", strength: 77 },
    { name: "RC Lens", strength: 76 },
    { name: "Stade Rennais", strength: 75 },
    { name: "OGC Nice", strength: 75 },
    { name: "Toulouse FC", strength: 70 },
    { name: "FC Nantes", strength: 69 },
    { name: "Montpellier HSC", strength: 68 },
    { name: "RC Strasbourg", strength: 68 },
    { name: "Stade Brestois", strength: 68 },
    { name: "AJ Auxerre", strength: 66 },
    { name: "Angers SCO", strength: 64 },
    { name: "Le Havre AC", strength: 64 },
  ],

  "Premier League": [
    { name: "Manchester City", strength: 91 },
    { name: "Arsenal", strength: 89 },
    { name: "Liverpool", strength: 88 },
    { name: "Chelsea", strength: 84 },
    { name: "Manchester United", strength: 82 },
    { name: "Tottenham Hotspur", strength: 81 },
    { name: "Newcastle United", strength: 80 },
    { name: "Aston Villa", strength: 79 },
    { name: "Brighton", strength: 76 },
    { name: "West Ham United", strength: 75 },
    { name: "Crystal Palace", strength: 73 },
    { name: "Fulham", strength: 72 },
    { name: "Everton", strength: 71 },
    { name: "Brentford", strength: 71 },
    { name: "Wolverhampton", strength: 70 },
    { name: "Nottingham Forest", strength: 69 },
  ],

  "National 2": [
    { name: "Girondins de Bordeaux", strength: 67 },
    { name: "Les Herbiers VF", strength: 61 },
    { name: "Saumur OFC", strength: 58 },
    { name: "Stade Poitevin", strength: 57 },
    { name: "Blois Foot 41", strength: 56 },
    { name: "Bergerac Périgord FC", strength: 59 },
    { name: "Angoulême CFC", strength: 58 },
    { name: "Trélissac FC", strength: 56 },
    { name: "Romorantin", strength: 55 },
    { name: "Bourges Foot 18", strength: 57 },
    { name: "La Roche VF", strength: 56 },
    { name: "Saint-Pryvé Saint-Hilaire", strength: 56 },
    { name: "GOAL FC", strength: 60 },
    { name: "Andrézieux-Bouthéon", strength: 57 },
    { name: "Hyères FC", strength: 58 },
    { name: "Fréjus Saint-Raphaël", strength: 57 },
  ],
};

const MONTHS = [
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
];
const POSITIONS = [
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
const FIRST_NAMES = [
  "Nino",
  "Enzo",
  "Noah",
  "Ilyes",
  "Lucas",
  "Hugo",
  "Adam",
  "Yanis",
  "Rayan",
  "Nathan",
];
const LAST_NAMES = [
  "Bernard",
  "Garcia",
  "Durand",
  "Morel",
  "Martin",
  "Dubois",
  "Lefèvre",
  "Silva",
  "Diallo",
  "Traoré",
];
const INJURY_TYPES = [
  {
    label: "Entorse légère",
    minWeeks: 2,
    maxWeeks: 3,
    formPenalty: 6,
  },
  {
    label: "Douleur musculaire",
    severity: "légère",
    minWeeks: 1,
    maxWeeks: 2,
    formPenalty: 4,
  },
  {
    label: "Élongation",
    severity: "sérieuse",
    minWeeks: 3,
    maxWeeks: 5,
    formPenalty: 9,
  },
  {
    label: "Blessure aux ischios",
    severity: "sérieuse",
    minWeeks: 4,
    maxWeeks: 7,
    formPenalty: 12,
  },
  {
    label: "Lésion ligamentaire",
    severity: "grave",
    minWeeks: 8,
    maxWeeks: 12,
    formPenalty: 18,
  },
];

const CATEGORY_META = {
  Match: { icon: "⚽", color: "linear-gradient(90deg,#bef264,#22d3ee)" },
  Moral: { icon: "🧠", color: "linear-gradient(90deg,#38bdf8,#22d3ee)" },
  Vestiaire: { icon: "👥", color: "linear-gradient(90deg,#c084fc,#f0abfc)" },
  Médias: { icon: "📰", color: "linear-gradient(90deg,#facc15,#fb923c)" },
  Mercato: { icon: "✍️", color: "linear-gradient(90deg,#60a5fa,#818cf8)" },
  Blessures: { icon: "🏥", color: "linear-gradient(90deg,#fb7185,#f97316)" },
  Supporters: { icon: "🔥", color: "linear-gradient(90deg,#fb7185,#f43f5e)" },
  Direction: { icon: "🏛️", color: "linear-gradient(90deg,#e2e8f0,#94a3b8)" },
  Staff: { icon: "📊", color: "linear-gradient(90deg,#a78bfa,#60a5fa)" },
};

const EVENT_TEMPLATES = {
  Match: [
    {
      type: "direct",
      title: "est dans une situation délicate",
      trigger: "situation critique",
      hook: "Un joueur se retrouve au cœur d’une situation sensible et demande ton intervention.",
      story:
        "Après le match, tout le vestiaire attend ta décision sur sa place dans le projet.",
      choices: ["Le soutenir", "Le recadrer", "L’isoler", "Parler à la presse"],
    },
    {
      type: "media",
      title: "est annoncé mécontent par les journalistes",
      trigger: "rumeur de vestiaire",
      hook: "La presse affirme que le joueur ne comprend plus ton projet sportif.",
      story:
        "Les commentaires s’emballent, et il faut gérer l’image du club tout en calmant le groupe.",
      choices: [
        "Répondre calmement",
        "Attaquer les médias",
        "Parler au joueur",
        "Laisser passer",
      ],
    },
    {
      type: "performance",
      title: "a livré une prestation controversée",
      trigger: "analyse du match",
      hook: "Ses performances oscillent trop, et le staff se pose des questions.",
      story:
        "Entre les supporters et le rapport du coach, ta crédibilité est en jeu.",
      choices: [
        "Changer sa position",
        "Lui donner du temps",
        "Le blâmer publiquement",
        "Expliquer ton plan",
      ],
    },
  ],
  Mercato: [
    {
      type: "transfer",
      title: "demande officiellement à partir",
      trigger: "envie de transfert",
      hook: "Le joueur vient directement t’annoncer qu’il veut quitter le club.",
      story:
        "C’est un dossier délicat qui peut affecter le groupe et le budget du club.",
      choices: [
        "Refuser net",
        "Fixer un prix",
        "Le convaincre de rester",
        "Le placer sur la liste",
      ],
    },
    {
      type: "offer",
      title: "reçoit une proposition inattendue",
      trigger: "intérêt étranger",
      hook: "Un club puissant a placé une offre sur sa table.",
      story:
        "Tu dois choisir entre ambition personnelle du joueur et stabilité de l’équipe.",
      choices: [
        "Laisser partir",
        "Négocier plus haut",
        "Le rassurer",
        "Garder le dossier secret",
      ],
    },
  ],
  Blessures: [
    {
      type: "medical",
      title: "cache une gêne physique",
      trigger: "fatigue élevée",
      hook: "Le staff découvre qu’il joue avec une douleur depuis plusieurs jours.",
      story:
        "Chaque minute sur le terrain pourrait aggraver sa condition et coûter un résultat.",
      choices: [
        "Le mettre au repos",
        "Réduire sa charge",
        "Le laisser décider",
        "Forcer les examens",
      ],
    },
    {
      type: "rehab",
      title: "relance un protocole de récupération",
      trigger: "douleur persistante",
      hook: "Il refuse de ralentir alors que le kiné reste inquiet.",
      story:
        "Il faut trouver le bon équilibre entre récupération et continuité du groupe.",
      choices: [
        "Insister sur le repos",
        "Lui donner une séance adaptée",
        "Changer le planning",
        "Prendre le risque",
      ],
    },
  ],
  Moral: [
    {
      type: "direct",
      title: "vient demander une discussion privée",
      trigger: "moral instable",
      hook: "Le joueur te demande cinq minutes loin du groupe.",
      story:
        "Sa confiance vacille et il veut savoir si tu comptes encore sur lui.",
      choices: [
        "L’écouter calmement",
        "Lui promettre plus de temps de jeu",
        "Lui rappeler la concurrence",
        "Reporter la discussion",
      ],
    },
    {
      type: "ambition",
      title: "se sent désengagé du projet",
      trigger: "niveaux de motivation",
      hook: "Il doute du sens de sa place dans l’équipe.",
      story:
        "Si tu ne regagnes pas sa confiance, la dynamique du vestiaire peut se briser.",
      choices: [
        "Réaffirmer le plan",
        "Changer son rôle",
        "Le vendre",
        "L’encourager",
      ],
    },
  ],
  Vestiaire: [
    {
      type: "squad",
      title: "divise le vestiaire",
      trigger: "tension collective",
      hook: "Deux groupes commencent à se former autour de sa situation.",
      story:
        "La cohésion du groupe est menacée et tu dois trancher avant que cela explose.",
      choices: [
        "Organiser une réunion fermée",
        "Choisir un leader fort",
        "Écarter le problème",
        "Changer la hiérarchie",
      ],
    },
    {
      type: "leadership",
      title: "conteste le capitaine",
      trigger: "autorité remise en cause",
      hook: "Il ne supporte plus certaines décisions de son capitaine.",
      story:
        "Ce conflit intérieur peut coûter cher si tu ne le règle pas rapidement.",
      choices: [
        "Médiatiser la confiance",
        "Protéger le capitaine",
        "Rééquilibrer le groupe",
        "Punis les deux",
      ],
    },
  ],
  Médias: [
    {
      type: "media",
      title: "fait l’objet d’une fuite dans la presse",
      trigger: "info sortie du vestiaire",
      hook: "Une information interne arrive dans les médias.",
      story: "Le climat médiatique devient toxique et le club doit réagir.",
      choices: [
        "Démentir publiquement",
        "Protéger le joueur",
        "Chercher la fuite",
        "Assumer la situation",
      ],
    },
    {
      type: "reputation",
      title: "a une interview tendue",
      trigger: "sortie médiatique",
      hook: "Il lâche des phrases qui enflamment les réseaux.",
      story: "Ta réponse doit contenir la crise sans l’aggraver.",
      choices: [
        "Le recadrer",
        "L’interviewer en interne",
        "Le soutenir",
        "Ignorer",
      ],
    },
  ],
  Supporters: [
    {
      type: "fans",
      title: "devient le favori des supporters",
      trigger: "popularité tribunes",
      hook: "Les supporters réclament son nom et critiquent tes choix.",
      story: "La pression des tribunes peut devenir un levier ou un piège.",
      choices: [
        "Le titulariser",
        "Expliquer ton choix",
        "Utiliser l’engouement",
        "Ne pas céder",
      ],
    },
    {
      type: "protest",
      title: "subit une campagne de banderoles",
      trigger: "flamme populaire",
      hook: "Les supporters brandissent son nom dans le stade.",
      story: "L’ambiance devient un enjeu politique et sportif.",
      choices: [
        "Jouer le jeu",
        "Calmer les supporters",
        "Changer de discours",
        "Le préserver",
      ],
    },
  ],
  Direction: [
    {
      type: "board",
      title: "devient un dossier surveillé par la direction",
      trigger: "enjeu financier",
      hook: "Le board veut savoir s'il fait encore partie du projet.",
      story: "Ta relation avec la direction est testée sur ce joueur.",
      choices: [
        "Le défendre",
        "Préparer une vente",
        "Demander du temps",
        "Le valoriser sportivement",
      ],
    },
    {
      type: "contract",
      title: "voit son contrat devenir un sujet de débat",
      trigger: "renouvellement proche",
      hook: "La direction surveille son rendement avant de trancher.",
      story:
        "Il représente un enjeu financier et un message pour le reste de l’effectif.",
      choices: [
        "Lui proposer une extension",
        "Le vendre",
        "Le faire patienter",
        "Relâcher la pression",
      ],
    },
  ],
  Staff: [
    {
      type: "staff",
      title: "fait débat dans le staff",
      trigger: "analyse tactique",
      hook: "Le staff n'est pas d'accord sur son utilisation.",
      story: "Les choix tactiques autour de lui créent une fracture interne.",
      choices: [
        "Suivre la data",
        "Suivre ton instinct",
        "Tester en match",
        "Reporter la décision",
      ],
    },
    {
      type: "training",
      title: "remet en question son plan d’entraînement",
      trigger: "capacité d’adaptation",
      hook: "Certains membres du staff veulent changer son programme.",
      story:
        "Il devient le symbole d’une préparation qui doit rester cohérente.",
      choices: [
        "Changer le plan",
        "Maintenir la feuille",
        "Individualiser le suivi",
        "Impliquer le joueur",
      ],
    },
  ],
};

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(Number(n) || 0)));
}

function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function money(n) {
  return `${Number(n || 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M€`;
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function maybeCreateInjuryReport(squad, week) {
  const availablePlayers = squad.filter((player) => !isPlayerInjured(player));

  if (!availablePlayers.length) return null;

  const riskyPlayers = [...availablePlayers]
    .sort((a, b) => b.fatigue - a.fatigue)
    .slice(0, 8);

  const target = pick(riskyPlayers);

  const fatigueRisk =
    target.fatigue > 75 ? 0.16 : target.fatigue > 60 ? 0.09 : 0.04;
  const randomRisk = Math.random();

  if (randomRisk > fatigueRisk) return null;

  const injury = createPlayerInjury(target, week);

  return {
    playerId: target.id,
    playerName: target.name,
    position: target.position,
    injury,
  };
}

function isPlayerInjured(player) {
  return Boolean(player.injury && player.injury.weeksRemaining > 0);
}

function isPlayerAvailable(player) {
  return !isPlayerInjured(player);
}

function createPlayerInjury(player, week) {
  const injuryType = pick(INJURY_TYPES);
  const duration = randomInt(injuryType.minWeeks, injuryType.maxWeeks);

  return {
    id: uid("injury"),
    label: injuryType.label,
    severity: injuryType.severity,
    weeksRemaining: duration,
    totalWeeks: duration,
    formPenalty: injuryType.formPenalty,
    startedWeek: week,
    playerId: player.id,
    playerName: player.name,
  };
}

function tickPlayerInjury(player) {
  if (!isPlayerInjured(player)) return player;

  const remaining = Math.max(0, player.injury.weeksRemaining - 1);

  if (remaining <= 0) {
    return {
      ...player,
      injury: null,
      fatigue: clamp(player.fatigue - 12),
      form: clamp(player.form - 2),
    };
  }

  return {
    ...player,
    injury: {
      ...player.injury,
      weeksRemaining: remaining,
    },
    fatigue: clamp(player.fatigue + 1),
    form: clamp(player.form - 1),
  };
}

function getLeaguePreset(league) {
  return LEAGUE_PRESETS[league] || LEAGUE_PRESETS["Ligue 1"];
}

function getTeamStrength(teamName, league = "Ligue 1", fallback = 58) {
  const preset = getLeaguePreset(league);
  const found = preset.find((team) => team.name === teamName);
  return found ? found.strength : fallback;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function poisson(lambda) {
  const safeLambda = Math.max(0.05, Math.min(3.2, lambda));
  const limit = Math.exp(-safeLambda);
  let k = 0;
  let p = 1;

  do {
    k += 1;
    p *= Math.random();
  } while (p > limit);

  return Math.min(5, k - 1);
}

function getCareerStrength(career) {
  const availableSquad = career.squad.filter(isPlayerAvailable);
  const squadForCalculation =
    availableSquad.length >= 11 ? availableSquad : career.squad;

  const averageOverall =
    squadForCalculation.reduce((sum, player) => sum + player.overall, 0) /
    Math.max(1, squadForCalculation.length);

  const averageFatigue =
    squadForCalculation.reduce((sum, player) => sum + player.fatigue, 0) /
    Math.max(1, squadForCalculation.length);

  const injuryPenalty = Math.max(0, 11 - availableSquad.length) * 1.5;

  return clamp(
    averageOverall * 0.55 +
      career.reputation * 0.25 +
      career.morale * 0.15 +
      career.cohesion * 0.12 -
      averageFatigue * 0.12 -
      injuryPenalty,
    35,
    92,
  );
}

function simulateMatchScore(homeStrength, awayStrength) {
  const diff = homeStrength - awayStrength;

  const homeExpected = Math.max(
    0.15,
    Math.min(2.9, 1.15 + diff / 55 + 0.18 + randomBetween(-0.25, 0.25)),
  );

  const awayExpected = Math.max(
    0.12,
    Math.min(2.7, 1.05 - diff / 65 + randomBetween(-0.25, 0.25)),
  );

  let homeGoals = poisson(homeExpected);
  let awayGoals = poisson(awayExpected);

  if (homeGoals + awayGoals >= 6 && Math.random() < 0.65) {
    if (homeGoals > awayGoals) homeGoals -= 1;
    else if (awayGoals > homeGoals) awayGoals -= 1;
    else homeGoals -= 1;
  }

  if (Math.random() < 0.12) {
    homeGoals = Math.min(homeGoals, 1);
    awayGoals = Math.min(awayGoals, 1);
  }

  return {
    homeGoals: Math.max(0, homeGoals),
    awayGoals: Math.max(0, awayGoals),
  };
}

function createPlayer(index, clubName) {
  const overall = clamp(52 + Math.random() * 34, 45, 92);
  return {
    id: uid("player"),
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    age: clamp(17 + Math.random() * 18, 16, 39),
    position: pick(POSITIONS),
    overall,
    potential: clamp(overall + Math.random() * 12, overall, 96),
    value: Number(((overall * overall) / 120).toFixed(1)),
    morale: clamp(50 + Math.random() * 35),
    form: clamp(45 + Math.random() * 45),
    fatigue: clamp(Math.random() * 55),
    injury: null,
    injuryHistory: [],
    goals: 0,
    appearances: 0,
    club: clubName,
  };
}

function createRealFixtures(clubName, league = "Ligue 1") {
  const preset = getLeaguePreset(league);

  const opponents = preset
    .filter((team) => team.name !== clubName)
    .map((team) => team.name);

  const selectedOpponents = opponents.slice(0, 12);
  console.log("REAL FIXTURES USED", clubName, league, selectedOpponents);
  return selectedOpponents.map((opponent, index) => ({
    id: uid("fixture"),
    week: index + 1,
    competition: index % 5 === 0 ? "Coupe" : "Championnat",
    home: index % 2 === 0 ? clubName : opponent,
    away: index % 2 === 0 ? opponent : clubName,
    played: false,
    score: null,
  }));
}

function createLeagueTable(club) {
  const preset = getLeaguePreset(club.league);

  const userTeam = {
    name: club.name,
    strength: clamp(club.reputation, 45, 94),
    user: true,
  };

  const teams = [
    userTeam,
    ...preset.filter((team) => team.name !== club.name),
  ].slice(0, 16);

  return teams.map((team) => ({
    name: team.name,
    strength: team.strength,
    user: Boolean(team.user),
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    form: [],
  }));
}

function sortLeagueTable(table) {
  return [...table].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });
}

function applyTableResult(table, homeName, awayName, homeGoals, awayGoals) {
  return table.map((team) => {
    if (team.name !== homeName && team.name !== awayName) return team;

    const isHome = team.name === homeName;
    const gf = isHome ? homeGoals : awayGoals;
    const ga = isHome ? awayGoals : homeGoals;

    let points = 0;
    let result = "D";
    let wins = 0;
    let draws = 0;
    let losses = 0;

    if (gf > ga) {
      points = 3;
      result = "V";
      wins = 1;
    } else if (gf === ga) {
      points = 1;
      result = "N";
      draws = 1;
    } else {
      losses = 1;
    }

    return {
      ...team,
      played: team.played + 1,
      wins: team.wins + wins,
      draws: team.draws + draws,
      losses: team.losses + losses,
      gf: team.gf + gf,
      ga: team.ga + ga,
      gd: team.gd + gf - ga,
      points: team.points + points,
      form: [result, ...(team.form || [])].slice(0, 5),
    };
  });
}

function simulateLeagueWeek(table, userMatch) {
  let nextTable =
    table && table.length ? table.map((team) => ({ ...team })) : [];

  if (!nextTable.length) return nextTable;

  if (userMatch) {
    nextTable = applyTableResult(
      nextTable,
      userMatch.home,
      userMatch.away,
      userMatch.homeGoals,
      userMatch.awayGoals,
    );
  }

  const unavailable = new Set(
    userMatch ? [userMatch.home, userMatch.away] : [],
  );

  const availableTeams = nextTable
    .filter((team) => !unavailable.has(team.name))
    .map((team) => team.name)
    .sort(() => Math.random() - 0.5);

  for (let index = 0; index < availableTeams.length - 1; index += 2) {
    const home = availableTeams[index];
    const away = availableTeams[index + 1];

    const homeStrength =
      nextTable.find((team) => team.name === home)?.strength || 58;
    const awayStrength =
      nextTable.find((team) => team.name === away)?.strength || 58;

    const score = simulateMatchScore(homeStrength, awayStrength);

    nextTable = applyTableResult(
      nextTable,
      home,
      away,
      score.homeGoals,
      score.awayGoals,
    );
  }

  return sortLeagueTable(nextTable);
}
function createCareer(type = "manager", club = CLUBS[0], options = {}) {
  const squad = Array.from({ length: 22 }, (_, index) =>
    createPlayer(index, club.name),
  );
  return {
    id: uid("career"),
    type,
    managerName: options.managerName || "Coach",
    customObjective: options.objective || club.objectives,
    season: 1,
    week: 1,
    month: "Août",
    club: { ...club },
    squad,
    budget: club.budget,
    reputation: club.reputation,
    popularity: 55,
    boardTrust: 55,
    morale: 58,
    cohesion: 55,
    media: 50,
    pressure: 35,
    development: 50,
    transferTension: 20,
    fixtures: createRealFixtures(club.name, club.league),
    leagueTable: createLeagueTable(club),
    events: [],
    news: [],
    decisions: [],
    eventMemory: [],
    activeStorylines: [],
  };
}

function simulateResult(career) {
  const fixtures = career.fixtures.map((fixture) => ({ ...fixture }));
  const fixture = fixtures.find((item) => !item.played);

  if (!fixture) {
    return {
      fixtures,
      squad: career.squad,
      resultDelta: 0,
      summary: "Aucun match cette semaine",
      scorerName: null,
      matchRecord: null,
      injuryReport: null,
    };
  }

  const userStrength = getCareerStrength(career);
  const opponentName =
    fixture.home === career.club.name ? fixture.away : fixture.home;

  const opponentStrength = getTeamStrength(
    opponentName,
    career.club.league,
    58,
  );

  const isHome = fixture.home === career.club.name;

  const score = isHome
    ? simulateMatchScore(userStrength, opponentStrength)
    : simulateMatchScore(opponentStrength, userStrength);

  const ownGoals = isHome ? score.homeGoals : score.awayGoals;
  const oppGoals = isHome ? score.awayGoals : score.homeGoals;

  fixture.played = true;
  fixture.score = `${score.homeGoals}-${score.awayGoals}`;

  let squad = career.squad.map((player) => ({ ...player }));
  let scorerName = null;

  const availablePlayers = squad.filter(isPlayerAvailable);

  if (ownGoals > 0) {
    const attackers = availablePlayers.filter((player) =>
      ["BU", "AD", "AG", "MOC", "MC"].includes(player.position),
    );

    const scorer = pick(
      attackers.length
        ? attackers
        : availablePlayers.length
          ? availablePlayers
          : squad,
    );

    squad = squad.map((player) => {
      if (player.id !== scorer.id) return player;

      return {
        ...player,
        goals: player.goals + 1,
        appearances: player.appearances + 1,
        form: clamp(player.form + 3),
      };
    });

    scorerName = scorer.name;
  }

  squad = squad.map((player) => {
    if (isPlayerInjured(player)) {
      return {
        ...player,
        fatigue: clamp(player.fatigue - 6),
      };
    }

    return {
      ...player,
      appearances:
        Math.random() < 0.25 ? player.appearances + 1 : player.appearances,
      fatigue: clamp(player.fatigue + randomBetween(4, 13)),
      form: clamp(player.form + randomBetween(-3, 3)),
    };
  });

  const injuryReport = maybeCreateInjuryReport(squad, career.week);

  if (injuryReport) {
    squad = squad.map((player) => {
      if (player.id !== injuryReport.playerId) return player;

      return {
        ...player,
        injury: injuryReport.injury,
        form: clamp(player.form - injuryReport.injury.formPenalty),
        fatigue: clamp(player.fatigue - 15),
        injuryHistory: [
          {
            id: injuryReport.injury.id,
            label: injuryReport.injury.label,
            severity: injuryReport.injury.severity,
            totalWeeks: injuryReport.injury.totalWeeks,
            startedWeek: career.week,
          },
          ...(player.injuryHistory || []),
        ],
      };
    });
  }

  const resultDelta = ownGoals > oppGoals ? 1 : ownGoals === oppGoals ? 0 : -1;

  return {
    fixtures,
    squad,
    resultDelta,
    summary: `${fixture.home} ${fixture.score} ${fixture.away}`,
    scorerName,
    injuryReport,
    matchRecord: {
      home: fixture.home,
      away: fixture.away,
      homeGoals: score.homeGoals,
      awayGoals: score.awayGoals,
    },
  };
}

function chooseEventCategory(career, resultDelta) {
  const categories = [
    "Match",
    "Moral",
    "Vestiaire",
    "Médias",
    "Mercato",
    "Staff",
    "Supporters",
    "Direction",
  ];
  if (career.squad.some((player) => player.fatigue > 72))
    categories.push("Blessures");
  if (resultDelta < 0) categories.push("Direction", "Médias", "Moral");
  if (resultDelta > 0) categories.push("Supporters", "Match");

  const recent = career.eventMemory || [];
  const filtered = categories.filter(
    (category) =>
      !recent.slice(0, 4).some((item) => item.category === category),
  );
  return pick(filtered.length ? filtered : categories);
}

function consequencesFor(category, resultDelta, career) {
  const sign = resultDelta > 0 ? 1 : resultDelta < 0 ? -1 : 0;
  const map = {
    Match: { morale: 4 * sign, reputation: 2 * sign, popularity: 2 * sign },
    Blessures: { morale: -3, pressure: 5, cohesion: -2 },
    Moral: { morale: career.morale < 50 ? 7 : -2, cohesion: 2 },
    Vestiaire: { cohesion: career.cohesion < 50 ? 7 : -3, morale: -1 },
    Médias: { media: 7, pressure: 3, reputation: sign },
    Supporters: { popularity: 6, pressure: resultDelta < 0 ? 4 : -1 },
    Direction: { boardTrust: resultDelta < 0 ? -4 : 3, pressure: 3 },
    Mercato: { transferTension: 8, morale: -2, reputation: 1 },
    Staff: { development: 5, cohesion: 1 },
  };
  return map[category] || { morale: 1 };
}

function getEventRarity(resultDelta) {
  const roll = Math.random() * 100;
  if (roll > 97) return "Légendaire";
  if (roll > 88) return "Épique";
  if (roll > 68 || resultDelta < 0) return "Rare";
  return "Commun";
}

function getMonthName(week) {
  return MONTHS[Math.floor((week - 1) / 4)] || "Mai";
}

function getThemeClass(theme) {
  return theme === "light" ? "light" : "";
}

function createSvgImage(category, title, playerName, clubName) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Match;
  const safeTitle = String(title).replaceAll("<", "").replaceAll(">", "");
  const safePlayer = String(playerName).replaceAll("<", "").replaceAll(">", "");
  const safeClub = String(clubName).replaceAll("<", "").replaceAll(">", "");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bef264"/>
      <stop offset="50%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#07111f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#bg)"/>
  <text x="80" y="140" font-family="Arial" font-size="40" font-weight="900" fill="white">${meta.icon} ${safeClub}</text>
  <text x="80" y="220" font-family="Arial" font-size="46" font-weight="900" fill="white">${safeTitle}</text>
  <text x="80" y="620" font-family="Arial" font-size="32" fill="white">Joueur : ${safePlayer}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createLiveEditorEffects(category, consequences, playerName) {
  const clubEffects = Object.entries(consequences || {}).map(([key, value]) => {
    const formatted = value > 0 ? `+${value}` : `${value}`;
    return `Club : ${key} ${formatted}`;
  });

  const playerEffects = {
    Match: [
      `Augmenter la forme de ${playerName}`,
      `Donner plus de temps de jeu à ${playerName}`,
    ],
    Blessures: [
      `Mettre ${playerName} au repos 1 match`,
      `Réduire son intensité d'entraînement`,
    ],
    Moral: [
      `Ajuster son rôle dans l'effectif`,
      `Changer son temps de jeu prévu`,
    ],
    Vestiaire: [
      `Modifier l'importance de ${playerName} dans l'effectif`,
      `Surveiller sa relation avec les cadres`,
    ],
    Médias: [
      `Augmenter la pression médiatique autour de ${playerName}`,
      `Modifier légèrement sa réputation`,
    ],
    Mercato: [
      `Ajouter ${playerName} à une shortlist transfert`,
      `Modifier son statut`,
    ],
    Supporters: [
      `Augmenter la popularité de ${playerName}`,
      `Créer une storyline supporters`,
    ],
    Direction: [
      `Noter ${playerName} comme dossier board`,
      `Demander un objectif sportif sur 3 matchs`,
    ],
    Staff: [
      `Changer le plan d'entraînement de ${playerName}`,
      `Tester ${playerName} à un nouveau poste`,
    ],
  };

  return [...clubEffects, ...(playerEffects[category] || [])];
}

function buildContextualEvent(career, result) {
  const category = result.injuryReport
    ? "Blessures"
    : chooseEventCategory(career, result.resultDelta);
  const templates = EVENT_TEMPLATES[category] || EVENT_TEMPLATES.Match;
  const recent = career.eventMemory || [];
  const available = templates.filter(
    (template) =>
      !recent
        .slice(0, 4)
        .some(
          (item) =>
            item.category === category && item.templateTitle === template.title,
        ),
  );
  const template = pick(available.length ? available : templates);

  const injuredPlayer = result.injuryReport
    ? career.squad.find((player) => player.id === result.injuryReport.playerId)
    : null;

  const players = [...career.squad]
    .sort((a, b) => {
      const scoreA =
        a.overall + a.form * 0.35 - a.fatigue * 0.2 + a.morale * 0.15;
      const scoreB =
        b.overall + b.form * 0.35 - b.fatigue * 0.2 + b.morale * 0.15;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  const player = injuredPlayer || pick(players.length ? players : career.squad);
  const fixtureText = result.summary || "semaine sans match officiel";
  const consequences = consequencesFor(category, result.resultDelta, career);
  const impact = Object.entries(consequences)
    .map(([key, value]) => `${key} ${value > 0 ? "+" : ""}${value}`)
    .join(" · ");
  const rarity = getEventRarity(result.resultDelta);
  const title = `${player.name} ${template.title} — ${career.club.name}`;

  let description = "";
  let detail = "";

  if (result.injuryReport) {
    description = `${result.injuryReport.playerName} est touché physiquement. Le staff médical confirme une blessure : ${result.injuryReport.injury.label}.`;
    detail = `Durée estimée : ${result.injuryReport.injury.weeksRemaining} semaine(s). Gravité : ${result.injuryReport.injury.severity}. Le joueur va perdre en forme et devra revenir progressivement. Contexte : ${fixtureText}.`;
  }

  if (template.type === "direct") {
    description = `${player.name} veut une réponse claire sur son rôle, son temps de jeu et sa place dans le projet.`;
    detail = `${template.story || "La situation demande une décision rapide."} Contexte : ${fixtureText}. Profil : ${player.position}, OVR ${player.overall}, forme ${player.form}, moral ${player.morale}, fatigue ${player.fatigue}.`;
  } else if (template.type === "media" || template.type === "reputation") {
    description = `Une histoire autour de ${player.name} sort dans les médias. Le club doit réagir avant que la situation ne prenne trop d'ampleur.`;
    detail = `${template.hook} ${template.story || ""} Contexte : ${fixtureText}.`;
  } else if (template.type === "transfer" || template.type === "offer") {
    description = `${player.name} devient un vrai dossier mercato. Son avenir au club n'est plus totalement verrouillé.`;
    detail = `${template.hook} Valeur estimée : ${money(player.value)}. Poste : ${player.position}. OVR ${player.overall}. Contexte : ${fixtureText}.`;
  } else if (template.type === "medical" || template.type === "rehab") {
    description = `${player.name} est au centre d'une alerte physique. Le staff médical demande une décision prudente.`;
    detail = `${template.hook} Fatigue actuelle : ${player.fatigue}. Forme : ${player.form}. Contexte : ${fixtureText}.`;
  } else if (template.type === "fans" || template.type === "protest") {
    description = `${player.name} devient un sujet fort chez les supporters. La pression populaire influence désormais tes choix.`;
    detail = `${template.story || template.hook} Contexte : ${fixtureText}.`;
  } else if (template.type === "board" || template.type === "contract") {
    description = `${player.name} devient un dossier suivi par la direction. Le board veut une décision claire.`;
    detail = `${template.story || template.hook} Valeur : ${money(player.value)}. Contexte : ${fixtureText}.`;
  } else if (
    template.type === "staff" ||
    template.type === "training" ||
    template.type === "performance"
  ) {
    description = `${player.name} fait débat en interne. Le staff attend une décision sportive cohérente.`;
    detail = `${template.hook} ${template.story || ""} Profil : ${player.position}, OVR ${player.overall}, forme ${player.form}. Contexte : ${fixtureText}.`;
  } else {
    description = `${player.name} devient un sujet important de la semaine.`;
    detail = `${template.hook} ${template.story || ""} Contexte : ${fixtureText}.`;
  }

  return {
    id: uid("event"),
    title,
    category,
    rarity,
    week: career.week,
    fixture: fixtureText,
    player: player.name,
    playerContext: {
      id: player.id,
      name: player.name,
      position: player.position,
      overall: player.overall,
      form: player.form,
      morale: player.morale,
      fatigue: player.fatigue,
      value: player.value,
    },
    club: career.club,
    imageUrl: createSvgImage(category, title, player.name, career.club.name),
    description,
    detail,
    impact,
    consequences,
    liveEditorEffects: createLiveEditorEffects(
      category,
      consequences,
      player.name,
    ),
    status: "unread",
    choices: template.choices,
    templateTitle: template.title,
    eventType: template.type,
  };
}

function applyConsequences(career, event) {
  const next = { ...career };
  const cons = event.consequences || {};
  next.morale = clamp(next.morale + (cons.morale || 0));
  next.cohesion = clamp(next.cohesion + (cons.cohesion || 0));
  next.reputation = clamp(next.reputation + (cons.reputation || 0));
  next.popularity = clamp(next.popularity + (cons.popularity || 0));
  next.boardTrust = clamp(next.boardTrust + (cons.boardTrust || 0));
  next.media = clamp(next.media + (cons.media || 0));
  next.pressure = clamp(next.pressure + (cons.pressure || 0));
  next.development = clamp(next.development + (cons.development || 0));
  next.transferTension = clamp(
    next.transferTension + (cons.transferTension || 0),
  );
  return next;
}

function generateArticle(career, event) {
  return {
    id: uid("news"),
    week: career.week,
    type: event.category,
    title: event.title,
    body: `${event.description} Impact prévu : ${event.impact}.`,
  };
}

function ClubBadge({ club, size = "" }) {
  const initials = club.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 3)
    .join("");
  return (
    <div
      className={`badge ${size}`}
      style={{
        background: `linear-gradient(135deg, ${club.colors[0]}, ${club.colors[1]})`,
      }}
    >
      {initials}
    </div>
  );
}

function Kicker({ children, tone = "" }) {
  return <span className={`kicker ${tone}`}>{children}</span>;
}

function Stat({ label, value, tone = "" }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${tone}`}>{value}</div>
    </div>
  );
}

function HomeScreen({ onChoose }) {
  return (
    <main className="hero">
      <section>
        <Kicker tone="lime">FC Career Hub</Kicker>
        <h1 className="hero-title">
          FIFA Career
          <br />
          <span className="gradient-text">Overhaul Mod</span>
        </h1>
        <p className="hero-subtitle">
          Un mode carrière premium pour FC26 : événements roleplay, vestiaire,
          médias, mercato, board, live editor et suivi de joueurs.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="big-choice manager"
            onClick={() => onChoose("manager")}
          >
            <div className="stat-label">Kick-off</div>
            <h2>Manager Career</h2>
            <p>
              Contrôle le club, les décisions, la pression, les finances et les
              storylines.
            </p>
          </button>
          <button
            type="button"
            className="big-choice player"
            onClick={() => onChoose("player")}
          >
            <div className="stat-label">Player Path</div>
            <h2>Player Career</h2>
            <p>
              Suis un joueur, sa forme, son coach, sa réputation et ses choix.
            </p>
          </button>
        </div>
      </section>
    </main>
  );
}

function ClubPicker({ type, onBack, onConfirm }) {
  const [selectedName, setSelectedName] = useState(CLUBS[0].name);
  const [managerName, setManagerName] = useState(
    type === "player" ? "Mon Pro" : "Coach",
  );
  const [objective, setObjective] = useState(CLUBS[0].objectives);

  const selected = CLUBS.find((club) => club.name === selectedName) || CLUBS[0];

  function selectClub(club) {
    setSelectedName(club.name);
    setObjective(club.objectives);
  }

  return (
    <main className="club-picker">
      <div className="bg-grid" />
      <div className="club-picker-inner">
        <button type="button" className="secondary-btn" onClick={onBack}>
          ← Retour
        </button>
        <div
          className="club-row"
          style={{ marginTop: 30, justifyContent: "space-between" }}
        >
          <div>
            <Kicker tone="lime">Club Select</Kicker>
            <h1 className="title-xl">
              Créer une carrière {type === "player" ? "Joueur" : "Manager"}
            </h1>
            <p className="muted">Choisis un club, un nom et un objectif.</p>
          </div>
          <ClubBadge club={selected} size="large" />
        </div>
        <div className="grid-3" style={{ marginTop: 28 }}>
          {CLUBS.map((club) => (
            <button
              key={club.name}
              type="button"
              className={`club-card ${selected.name === club.name ? "selected" : ""}`}
              onClick={() => selectClub(club)}
            >
              <ClubBadge club={club} size="small" />
              <h2>{club.name}</h2>
              <p className="muted">{club.league}</p>
              <p>
                Budget <b>{money(club.budget)}</b> · Rép.{" "}
                <b>{club.reputation}</b>
              </p>
            </button>
          ))}
        </div>
        <div className="panel" style={{ marginTop: 22 }}>
          <div className="grid-2">
            <label>
              <div className="stat-label">
                {type === "player" ? "Nom du joueur" : "Nom du coach"}
              </div>
              <input
                className="input"
                value={managerName}
                onChange={(event) => setManagerName(event.target.value)}
              />
            </label>
            <label>
              <div className="stat-label">Objectif personnalisé</div>
              <input
                className="input"
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: 18 }}
            onClick={() =>
              onConfirm(type, selected, { managerName, objective })
            }
          >
            Commencer avec {selected.name}
          </button>
        </div>
      </div>
    </main>
  );
}

function Dashboard({ career }) {
  return (
    <div className="grid-2">
      <div className="card pitch">
        <div className="club-row" style={{ justifyContent: "space-between" }}>
          <h2>Central Hub</h2>
          <Kicker tone="lime">Semaine {career.week}</Kicker>
        </div>
        <div className="stat-grid">
          <Stat label="Moral" value={career.morale} tone="lime" />
          <Stat label="Réputation" value={career.reputation} tone="cyan" />
          <Stat label="Pression" value={career.pressure} tone="amber" />
          <Stat label="Cohésion" value={career.cohesion} tone="violet" />
        </div>
      </div>
      <div className="card">
        <div className="club-row">
          <ClubBadge club={career.club} />
          <div>
            <h2>{career.club.name}</h2>
            <p className="muted">{career.club.league}</p>
          </div>
        </div>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <Stat label="Budget" value={money(career.budget)} tone="cyan" />
          <Stat label="Board" value={career.boardTrust} tone="violet" />
        </div>
        <p className="muted" style={{ marginTop: 18 }}>
          Objectif : <b className="soft">{career.customObjective}</b>
        </p>
      </div>
    </div>
  );
}

function EventsView({ career, onOpen }) {
  const [filter, setFilter] = useState("all");
  const visibleEvents = useMemo(
    () =>
      career.events.filter((event) =>
        filter === "all" ? true : event.status === filter,
      ),
    [career.events, filter],
  );

  return (
    <div>
      <div
        className="club-row"
        style={{ justifyContent: "space-between", marginBottom: 16 }}
      >
        <h2>Inbox événements</h2>
        <div className="club-row">
          <button
            type="button"
            className={`secondary-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tous
          </button>
          <button
            type="button"
            className={`secondary-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Nouveau
          </button>
          <button
            type="button"
            className={`secondary-btn ${filter === "resolved" ? "active" : ""}`}
            onClick={() => setFilter("resolved")}
          >
            Résolu
          </button>
        </div>
      </div>
      <div className="grid-3">
        {visibleEvents.length ? (
          visibleEvents.map((event) => {
            const meta = CATEGORY_META[event.category] || CATEGORY_META.Match;
            const resolved = event.status === "resolved";
            return (
              <button
                key={event.id}
                type="button"
                className="event-card"
                style={{ opacity: resolved ? 0.62 : 1 }}
                onClick={() => onOpen(event)}
              >
                <div
                  className="event-strip"
                  style={{ background: meta.color }}
                />
                <div className="event-body">
                  <div
                    className="club-row"
                    style={{ justifyContent: "space-between" }}
                  >
                    <Kicker>
                      {meta.icon} {event.category}
                    </Kicker>
                    <Kicker tone={resolved ? "green" : "amber"}>
                      {resolved ? "Résolu" : "Nouveau"}
                    </Kicker>
                  </div>
                  <h3>{event.title}</h3>
                  <p className="muted">{event.description}</p>
                  <p className="soft">{event.impact}</p>
                  {resolved && event.choice ? (
                    <p className="muted">
                      Choix effectué : <b>{event.choice}</b>
                    </p>
                  ) : null}
                </div>
              </button>
            );
          })
        ) : (
          <div className="card">Aucun événement dans ce filtre.</div>
        )}
      </div>
    </div>
  );
}

function EventModal({ event, onClose, onDecision }) {
  if (!event) return null;

  const meta = CATEGORY_META[event.category] || CATEGORY_META.Match;
  const playerName =
    event.playerContext?.name || event.player || "Joueur concerné";
  const playerPosition = event.playerContext?.position || "Poste inconnu";
  const playerOverall = event.playerContext?.overall || "?";
  const playerForm = event.playerContext?.form || "?";
  const playerMorale = event.playerContext?.morale || "?";
  const playerFatigue = event.playerContext?.fatigue || "?";

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="event-strip" style={{ background: meta.color }} />
        <div className="modal-grid">
          <aside className="modal-left">
            <img
              className="event-image"
              src={event.imageUrl}
              alt={event.title}
            />
            <div className="stat-grid" style={{ marginTop: 18 }}>
              <Stat label="Rareté" value={event.rarity} tone="amber" />
              <Stat label="Semaine" value={event.week} tone="cyan" />
              <Stat label="Joueur" value={playerName} tone="lime" />
              <Stat label="OVR" value={playerOverall} tone="violet" />
            </div>
            <div className="card" style={{ marginTop: 18 }}>
              <h3>Profil joueur</h3>
              <p>
                Nom : <b>{playerName}</b>
              </p>
              <p>
                Poste : <b>{playerPosition}</b>
              </p>
              <p>
                OVR : <b>{playerOverall}</b>
              </p>
              <p>
                Forme : <b>{playerForm}</b>
              </p>
              <p>
                Moral : <b>{playerMorale}</b>
              </p>
              <p>
                Fatigue : <b>{playerFatigue}</b>
              </p>
            </div>
          </aside>
          <section className="modal-right">
            <div
              className="club-row"
              style={{ justifyContent: "space-between" }}
            >
              <div className="club-row">
                <Kicker>
                  {meta.icon} {event.category}
                </Kicker>
                <Kicker tone="amber">{event.rarity}</Kicker>
                <Kicker tone={event.status === "resolved" ? "green" : "red"}>
                  {event.status === "resolved" ? "Résolu" : "Décision requise"}
                </Kicker>
              </div>
              <button type="button" className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>
            <h1>{event.title}</h1>
            <p className="soft">{event.description}</p>
            <div className="card media">
              <h3>Analyse roleplay</h3>
              <p className="muted">{event.detail}</p>
            </div>
            <div className="grid-2" style={{ marginTop: 14 }}>
              <div className="card pitch">
                <h3>Impact club</h3>
                <p>{event.impact}</p>
              </div>
              <div className="card media">
                <h3>Contexte match</h3>
                <p>{event.fixture}</p>
              </div>
            </div>
            {event.status === "resolved" ? (
              <div className="card" style={{ marginTop: 14 }}>
                <h3>Décision déjà prise</h3>
                <p className="muted">
                  Choix effectué : <b>{event.choice || "non précisé"}</b>
                </p>
              </div>
            ) : (
              <div className="card" style={{ marginTop: 14 }}>
                <h3>Décision narrative</h3>
                <div className="choice-grid">
                  {(event.choices || []).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      className="choice-btn"
                      onClick={() => onDecision(event, choice)}
                    >
                      {choice}
                      <br />
                      <small>Appliquer cette décision à la storyline.</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SquadView({ career }) {
  const [query, setQuery] = useState("");
  const squad = useMemo(() => {
    return career.squad
      .filter(
        (player) =>
          player.name.toLowerCase().includes(query.toLowerCase()) ||
          player.position.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => b.overall - a.overall);
  }, [career.squad, query]);

  return (
    <div>
      <input
        className="input"
        placeholder="Filtrer par nom ou poste"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="grid-3" style={{ marginTop: 18 }}>
        {squad.map((player) => (
          <div key={player.id} className="card">
            <div
              className="club-row"
              style={{ justifyContent: "space-between" }}
            >
              <h3>{player.name}</h3>
              <Kicker>{player.position}</Kicker>
            </div>
            <p className="muted">{player.age} ans</p>
            {player.injury ? (
              <p className="red">
                🏥 {player.injury.label} — retour dans{" "}
                {player.injury.weeksRemaining} semaine(s)
              </p>
            ) : null}

            <div className="stat-grid">
              <Stat label="OVR" value={player.overall} tone="lime" />
              <Stat label="POT" value={player.potential} tone="cyan" />
              <Stat label="Forme" value={player.form} tone="amber" />
              <Stat label="Fatigue" value={player.fatigue} tone="red" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarView({ career }) {
  return (
    <div className="grid-2">
      {career.fixtures.map((fixture) => (
        <div key={fixture.id} className="card">
          <div className="fixture">
            <Kicker tone={fixture.played ? "green" : "cyan"}>
              Semaine {fixture.week}
            </Kicker>
            <span className="muted">{fixture.competition}</span>
          </div>
          <h3>
            {fixture.home} {fixture.score || "-"} {fixture.away}
          </h3>
        </div>
      ))}
    </div>
  );
}

function NewsView({ career }) {
  return (
    <div className="grid-2">
      {career.news.length ? (
        career.news.map((item) => (
          <div key={item.id} className="card">
            <Kicker>{item.type}</Kicker>
            <h3>{item.title}</h3>
            <p className="muted">{item.body}</p>
          </div>
        ))
      ) : (
        <div className="card">Aucune news pour l’instant.</div>
      )}
    </div>
  );
}

function HistoryView({ career }) {
  return (
    <div className="grid-2">
      <div className="card">
        <h2>Décisions</h2>
        {career.decisions.length ? (
          career.decisions.map((decision) => (
            <p key={decision.id}>
              S{decision.week} · {decision.event} → <b>{decision.choice}</b>
            </p>
          ))
        ) : (
          <p className="muted">Aucune décision.</p>
        )}
      </div>
      <div className="card">
        <h2>Storylines</h2>
        {career.activeStorylines.length ? (
          career.activeStorylines.map((story) => (
            <p key={story.id}>
              {story.title} · Dernier choix : <b>{story.lastChoice}</b>
            </p>
          ))
        ) : (
          <p className="muted">Aucune storyline active.</p>
        )}
      </div>
    </div>
  );
}
function LeagueTableView({ career }) {
  const table = sortLeagueTable(
    career.leagueTable && career.leagueTable.length
      ? career.leagueTable
      : createLeagueTable(career.club),
  );

  return (
    <div className="card">
      <div
        className="club-row"
        style={{ justifyContent: "space-between", marginBottom: 18 }}
      >
        <div>
          <Kicker tone="cyan">Championnat</Kicker>
          <h2>Classement simulé</h2>
        </div>
        <span className="muted">Semaine {career.week}</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="muted" style={{ textAlign: "left" }}>
              <th style={{ padding: 10 }}>#</th>
              <th style={{ padding: 10 }}>Club</th>
              <th style={{ padding: 10 }}>Pts</th>
              <th style={{ padding: 10 }}>J</th>
              <th style={{ padding: 10 }}>V</th>
              <th style={{ padding: 10 }}>N</th>
              <th style={{ padding: 10 }}>D</th>
              <th style={{ padding: 10 }}>BP</th>
              <th style={{ padding: 10 }}>BC</th>
              <th style={{ padding: 10 }}>Diff</th>
              <th style={{ padding: 10 }}>Forme</th>
            </tr>
          </thead>

          <tbody>
            {table.map((team, index) => {
              const isUser = team.name === career.club.name;

              return (
                <tr
                  key={team.name}
                  style={{
                    background: isUser
                      ? "rgba(190,242,100,.14)"
                      : "transparent",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <td style={{ padding: 10, fontWeight: 900 }}>{index + 1}</td>
                  <td style={{ padding: 10, fontWeight: isUser ? 1000 : 700 }}>
                    {team.name}
                  </td>
                  <td style={{ padding: 10, fontWeight: 1000 }}>
                    {team.points}
                  </td>
                  <td style={{ padding: 10 }}>{team.played}</td>
                  <td style={{ padding: 10 }}>{team.wins}</td>
                  <td style={{ padding: 10 }}>{team.draws}</td>
                  <td style={{ padding: 10 }}>{team.losses}</td>
                  <td style={{ padding: 10 }}>{team.gf}</td>
                  <td style={{ padding: 10 }}>{team.ga}</td>
                  <td style={{ padding: 10 }}>{team.gd}</td>
                  <td style={{ padding: 10 }}>
                    {(team.form || []).length ? team.form.join(" ") : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeltaLine({ label, before, after }) {
  const delta = Number(after || 0) - Number(before || 0);
  const positive = delta > 0;
  const negative = delta < 0;
  return (
    <div className="fixture">
      <span>{label}</span>
      <strong className={positive ? "lime" : negative ? "red" : "muted"}>
        {before} → {after}{" "}
        {delta !== 0 ? `(${delta > 0 ? "+" : ""}${delta})` : "(=)"}
      </strong>
    </div>
  );
}

function WeekSummaryModal({ summary, onClose, onOpenEvent }) {
  if (!summary) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 860 }}>
        <div
          className="event-strip"
          style={{
            background: "linear-gradient(90deg, var(--lime), var(--cyan))",
          }}
        />
        <div style={{ padding: 28 }}>
          <Kicker tone="lime">Résumé de semaine</Kicker>
          <h1 style={{ marginTop: 14 }}>Semaine {summary.week}</h1>
          <div className="card pitch" style={{ marginTop: 16 }}>
            {summary.injuryReport ? (
              <div className="card" style={{ marginTop: 16 }}>
                <Kicker tone="red">Alerte médicale</Kicker>
                <h3>{summary.injuryReport.playerName} est blessé</h3>
                <p className="muted">
                  Blessure : <b>{summary.injuryReport.injury.label}</b>
                </p>
                <p className="muted">
                  Durée estimée :{" "}
                  <b>{summary.injuryReport.injury.weeksRemaining} semaine(s)</b>
                </p>
                <p className="muted">
                  Gravité : <b>{summary.injuryReport.injury.severity}</b>
                </p>
              </div>
            ) : null}
            <h2>Résultat</h2>
            <p className="soft" style={{ fontSize: 22, fontWeight: 900 }}>
              {summary.result}
            </p>
            <p className="muted">
              Buteur notable : <b>{summary.scorerName || "aucun"}</b>
            </p>
          </div>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="card">
              <h3>Variations du club</h3>
              <DeltaLine
                label="Moral"
                before={summary.before.morale}
                after={summary.after.morale}
              />
              <DeltaLine
                label="Réputation"
                before={summary.before.reputation}
                after={summary.after.reputation}
              />
              <DeltaLine
                label="Popularité"
                before={summary.before.popularity}
                after={summary.after.popularity}
              />
              <DeltaLine
                label="Pression"
                before={summary.before.pressure}
                after={summary.after.pressure}
              />
              <DeltaLine
                label="Board"
                before={summary.before.boardTrust}
                after={summary.after.boardTrust}
              />
            </div>
            <div className="card media">
              <h3>Événement tiré</h3>
              <Kicker>{summary.eventCategory}</Kicker>
              <h2>{summary.eventTitle}</h2>
              <p className="muted">{summary.eventDescription}</p>
            </div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <h3>Article de presse</h3>
            <p className="muted">{summary.article}</p>
          </div>
          <div
            className="club-row"
            style={{ marginTop: 18, justifyContent: "flex-end" }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={onOpenEvent}
            >
              Voir l’événement
            </button>
            <button type="button" className="primary-btn" onClick={onClose}>
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareerApp() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [screen, setScreen] = useState(DEFAULT_SCREEN);
  const [pendingType, setPendingType] = useState(DEFAULT_TYPE);
  const [careers, setCareers] = useState(() => [
    createCareer(DEFAULT_TYPE, CLUBS[0]),
  ]);
  const [activeId, setActiveId] = useState("");
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [activeEvent, setActiveEvent] = useState(null);
  const [weekSummary, setWeekSummary] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const career = useMemo(
    () => careers.find((item) => item.id === activeId) || careers[0],
    [careers, activeId],
  );
  const tabs = useMemo(
    () => [
      ["dashboard", "Hub"],
      ["events", "Événements"],
      ["squad", "Effectif"],
      ["calendar", "Calendrier"],
      ["table", "Classement"],
      ["news", "News"],
      ["history", "Historique"],
    ],
    [],
  );
  const pendingEvents = useMemo(
    () => career.events.filter((event) => event.status === "unread").length,
    [career.events],
  );
  const themeClass = useMemo(() => getThemeClass(theme), [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const selectCareer = useCallback((event) => {
    setActiveId(event.target.value);
  }, []);

  const replaceCareer = useCallback((nextCareer) => {
    setCareers((list) =>
      list.map((item) => (item.id === nextCareer.id ? nextCareer : item)),
    );
  }, []);

  const createNewCareer = useCallback((type, club, options) => {
    const next = createCareer(type, club, options);
    setCareers((list) => [next, ...list]);
    setActiveId(next.id);
    setScreen("career");
    setTab(DEFAULT_TAB);
  }, []);

  const advanceWeek = useCallback(() => {
    const before = {
      morale: career.morale,
      reputation: career.reputation,
      popularity: career.popularity,
      pressure: career.pressure,
      boardTrust: career.boardTrust,
    };

    let nextCareer = {
      ...career,
      squad: career.squad.map((player) => ({ ...player })),
      fixtures: career.fixtures.map((fixture) => ({ ...fixture })),
    };

    const result = simulateResult(nextCareer);

    nextCareer.fixtures = result.fixtures;
    nextCareer.squad = result.squad;
    const baseTable =
      nextCareer.leagueTable && nextCareer.leagueTable.length
        ? nextCareer.leagueTable
        : createLeagueTable(nextCareer.club);

    nextCareer.leagueTable = simulateLeagueWeek(baseTable, result.matchRecord);
    nextCareer.week += 1;
    nextCareer.month = getMonthName(nextCareer.week);

    nextCareer.morale = clamp(nextCareer.morale + result.resultDelta * 5);
    nextCareer.reputation = clamp(
      nextCareer.reputation + result.resultDelta * 2,
    );
    nextCareer.popularity = clamp(
      nextCareer.popularity + result.resultDelta * 3,
    );

    const event = buildContextualEvent(nextCareer, result);
    nextCareer = applyConsequences(nextCareer, event);
    const article = generateArticle(nextCareer, event);

    nextCareer.events = [event, ...nextCareer.events];
    nextCareer.eventMemory = [
      {
        id: event.id,
        category: event.category,
        templateTitle: event.templateTitle,
        player: event.player,
        week: event.week,
      },
      ...(nextCareer.eventMemory || []),
    ].slice(0, EVENT_MEMORY_LIMIT);
    nextCareer.news = [article, ...nextCareer.news];

    replaceCareer(nextCareer);
    setTab("events");
    setActiveEvent(null);

    setWeekSummary({
      week: nextCareer.week,
      result: result.summary,
      scorerName: result.scorerName,
      before,
      after: {
        morale: nextCareer.morale,
        injuryReport: result.injuryReport,
        reputation: nextCareer.reputation,
        popularity: nextCareer.popularity,
        pressure: nextCareer.pressure,
        boardTrust: nextCareer.boardTrust,
      },
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDescription: event.description,
      article: article.body,
    });
  }, [career, replaceCareer]);

  const handleDecision = useCallback(
    (event, choice) => {
      if (!event || event.status === "resolved") {
        setActiveEvent(null);
        return;
      }

      setCareers((list) =>
        list.map((item) => {
          if (item.id !== activeId) return item;

          const updatedEvents = item.events.map((existingEvent) => {
            if (existingEvent.id !== event.id) return existingEvent;

            return {
              ...existingEvent,
              status: "resolved",
              choice,
              resolvedWeek: item.week,
            };
          });

          return {
            ...item,
            events: updatedEvents,
            decisions: [
              {
                id: uid("decision"),
                week: item.week,
                event: event.title,
                choice,
              },
              ...(item.decisions || []),
            ],
            activeStorylines: [
              {
                id: uid("story"),
                title: event.title,
                category: event.category,
                lastChoice: choice,
              },
              ...(item.activeStorylines || []),
            ].slice(0, 8),
          };
        }),
      );

      setActiveEvent(null);
    },
    [activeId],
  );

  const openWeekEvent = useCallback(() => {
    const found = career.events.find(
      (event) => event.id === weekSummary?.eventId,
    );
    if (found) {
      setActiveEvent(found);
    }
    setWeekSummary(null);
  }, [career.events, weekSummary]);

  function renderTabContent() {
    switch (tab) {
      case "events":
        return <EventsView career={career} onOpen={setActiveEvent} />;
      case "squad":
        return <SquadView career={career} />;
      case "calendar":
        return <CalendarView career={career} />;
      case "table":
        return <LeagueTableView career={career} />;
      case "news":
        return <NewsView career={career} />;
      case "history":
        return <HistoryView career={career} />;
      default:
        return <Dashboard career={career} />;
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setCareers(parsed);
          setActiveId(parsed[0].id);
        }
      } else {
        setActiveId(careers[0]?.id || "");
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setActiveId(careers[0]?.id || "");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(careers));
    }
  }, [careers, loaded]);

  if (!loaded) {
    return (
      <main className="app">
        <div className="hero">
          <h1>Chargement du Career Hub...</h1>
        </div>
      </main>
    );
  }

  if (screen === "home") {
    return (
      <div className={`app ${themeClass}`}>
        <div className="bg-grid" />
        <HomeScreen
          onChoose={(type) => {
            setPendingType(type);
            setScreen("create");
          }}
        />
      </div>
    );
  }

  if (screen === "create") {
    return (
      <div className={`app ${themeClass}`}>
        <ClubPicker
          type={pendingType}
          onBack={() => setScreen("home")}
          onConfirm={createNewCareer}
        />
      </div>
    );
  }

  return (
    <div className={`app ${themeClass}`}>
      <div className="bg-grid" />
      <div className="shell">
        <div className="layout">
          <aside className="sidebar panel">
            <div className="club-row">
              <ClubBadge club={career.club} />
              <div>
                <Kicker tone="cyan">Career OS</Kicker>
                <h2>{career.club.name}</h2>
              </div>
            </div>
            <p className="muted">
              Saison {career.season} · Semaine {career.week} · {career.month}
            </p>
            <select className="select" value={activeId} onChange={selectCareer}>
              {careers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.club.name} — {item.type}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setScreen("home")}
            >
              Accueil
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={toggleTheme}
            >
              Mode {theme === "dark" ? "clair" : "sombre"}
            </button>
            <nav className="nav">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={tab === id ? "active" : ""}
                  onClick={() => setTab(id)}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{label}</span>
                    {id === "events" && pendingEvents > 0 ? (
                      <span
                        style={{
                          minWidth: 22,
                          height: 22,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          background: "var(--red)",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 1000,
                        }}
                      >
                        {pendingEvents}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </nav>
            <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
              <button
                type="button"
                className="primary-btn"
                onClick={advanceWeek}
              >
                ▶ Avancer d’une semaine
              </button>
            </div>
          </aside>
          <main className="main">
            <header className="panel header-grid">
              <div>
                <Kicker tone="lime">
                  {career.type === "player" ? "Mode Joueur" : "Mode Manager"}
                </Kicker>
                <h1 className="title-xl">{career.club.name}</h1>
                <p className="muted">{career.customObjective}</p>
              </div>
              <div className="stat-grid">
                <Stat label="Budget" value={money(career.budget)} tone="cyan" />
                <Stat label="Moral" value={career.morale} tone="lime" />
                <Stat
                  label="Réputation"
                  value={career.reputation}
                  tone="cyan"
                />
                <Stat
                  label="Direction"
                  value={career.boardTrust}
                  tone="violet"
                />
              </div>
            </header>
            {renderTabContent()}
          </main>
        </div>
      </div>
      <EventModal
        event={activeEvent}
        onClose={() => setActiveEvent(null)}
        onDecision={handleDecision}
      />
      <WeekSummaryModal
        summary={weekSummary}
        onClose={() => setWeekSummary(null)}
        onOpenEvent={openWeekEvent}
      />
    </div>
  );
}
