"use client";

import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fifa-career-overhaul-final-clean-v1";

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

const MONTHS = ["Août", "Septembre", "Octobre", "Novembre", "Décembre", "Janvier", "Février", "Mars", "Avril", "Mai"];
const POSITIONS = ["GB", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];
const FIRST_NAMES = ["Nino", "Enzo", "Noah", "Ilyes", "Lucas", "Hugo", "Adam", "Yanis", "Rayan", "Nathan"];
const LAST_NAMES = ["Bernard", "Garcia", "Durand", "Morel", "Martin", "Dubois", "Lefèvre", "Silva", "Diallo", "Traoré"];

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
      choices: ["Le soutenir", "Le recadrer", "L’isoler", "Parler à la presse"],
    },
    {
      type: "media",
      title: "est annoncé mécontent par les journalistes",
      trigger: "rumeur de vestiaire",
      hook: "La presse affirme que le joueur ne comprend plus ton projet sportif.",
      choices: ["Répondre calmement", "Attaquer les médias", "Parler au joueur", "Laisser passer"],
    },
    {
      type: "rival",
      title: "est utilisé par un coach rival pour te provoquer",
      trigger: "déclaration adverse",
      hook: "Un coach rival glisse en conférence que tu ne sais pas gérer ton effectif.",
      choices: ["Répondre sèchement", "Ignorer", "Motiver le joueur", "Protéger le groupe"],
    },
  ],

  Mercato: [
    {
      type: "transfer",
      title: "demande officiellement à partir",
      trigger: "envie de transfert",
      hook: "Le joueur vient directement t’annoncer qu’il veut quitter le club.",
      choices: ["Refuser net", "Fixer un prix", "Le convaincre de rester", "Le placer sur la liste"],
    },
    {
      type: "agent",
      title: "voit son agent mettre la pression",
      trigger: "pression contractuelle",
      hook: "L’agent du joueur contacte la direction et réclame une décision rapide.",
      choices: ["Négocier", "Refuser", "Gagner du temps", "Rencontrer le joueur"],
    },
    {
      type: "star",
      title: "est approché par une star adverse",
      trigger: "séduction mercato",
      hook: "Une star d’un autre club parle publiquement du joueur et l’invite à viser plus haut.",
      choices: ["Le blinder", "Répondre publiquement", "Lui proposer un rôle clé", "Écouter les offres"],
    },
  ],

  Blessures: [
    {
      type: "medical",
      title: "cache une gêne physique",
      trigger: "fatigue et risque médical",
      hook: "Le staff médical découvre que le joueur joue avec une douleur depuis plusieurs jours.",
      choices: ["Le mettre au repos", "Réduire sa charge", "Le laisser décider", "Forcer les examens"],
    },
    {
      type: "medical",
      title: "veut jouer malgré l’alerte médicale",
      trigger: "match important",
      hook: "Le joueur insiste pour jouer alors que le staff recommande la prudence.",
      choices: ["Interdire le risque", "Le mettre sur le banc", "Le titulariser", "Adapter son rôle"],
    },
  ],

  Supporters: [
    {
      type: "fans",
      title: "devient le favori des supporters",
      trigger: "popularité en tribunes",
      hook: "Les supporters réclament son nom et commencent à critiquer tes choix.",
      choices: ["Le titulariser", "Expliquer ton choix", "Utiliser l’engouement", "Ne pas céder"],
    },
    {
      type: "fans",
      title: "est pris en grippe par une partie du public",
      trigger: "mauvaise prestation",
      hook: "Une partie des supporters perd patience et le joueur commence à le sentir.",
      choices: ["Le protéger", "Le sortir du onze", "Lui parler", "Répondre aux supporters"],
    },
  ],

  Direction: [
    {
      type: "board",
      title: "devient un dossier surveillé par la direction",
      trigger: "enjeu sportif et financier",
      hook: "La direction veut savoir si ce joueur fait encore partie du projet.",
      choices: ["Le défendre", "Préparer une vente", "Demander du temps", "Le valoriser sportivement"],
    },
  ],

  Staff: [
    {
      type: "staff",
      title: "fait débat dans le staff",
      trigger: "analyse tactique",
      hook: "Le staff n’est pas d’accord sur son utilisation. Certains veulent le relancer, d’autres non.",
      choices: ["Suivre la data", "Suivre ton instinct", "Tester en match", "Reporter"],
    },
  ],

  Moral: [
    {
      type: "direct",
      title: "vient demander une discussion privée",
      trigger: "moral personnel",
      hook: "Le joueur te demande cinq minutes loin du groupe. Il veut parler franchement.",
      choices: ["L’écouter calmement", "Lui promettre du temps de jeu", "Le recadrer", "Reporter la discussion"],
    },
    {
      type: "direct",
      title: "menace de décrocher mentalement",
      trigger: "frustration accumulée",
      hook: "Le joueur estime qu’il donne tout sans recevoir assez de confiance.",
      choices: ["Le rassurer", "Lui fixer un objectif", "Le mettre titulaire", "Ne rien changer"],
    },
    {
      type: "squad",
      title: "est défendu par un cadre du vestiaire",
      trigger: "solidarité interne",
      hook: "Un cadre vient te voir pour défendre la situation du joueur.",
      choices: ["Écouter le cadre", "Garder ton autorité", "Réunir le groupe", "Changer la rotation"],
    },
  ],

  Vestiaire: [
    {
      type: "squad",
      title: "crée une fracture dans le vestiaire",
      trigger: "tension entre joueurs",
      hook: "Deux groupes commencent à se former autour de la situation du joueur.",
      choices: ["Organiser une réunion", "Choisir un camp", "Écarter le problème", "Nommer un leader"],
    },
    {
      type: "direct",
      title: "demande plus de respect des cadres",
      trigger: "statut dans le groupe",
      hook: "Le joueur se sent ignoré par certains cadres du vestiaire.",
      choices: ["Le soutenir", "Parler aux cadres", "Lui demander de prouver", "Ignorer"],
    },
  ],

  Médias: [
    {
      type: "media",
      title: "fait l’objet d’une fuite dans la presse",
      trigger: "information sortie du vestiaire",
      hook: "Une info interne sort dans les médias et met le club sous pression.",
      choices: ["Démentir", "Rester silencieux", "Protéger le joueur", "Changer de stratégie"],
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
    goals: 0,
    appearances: 0,
    club: clubName,
  };
}

function createFixtures(clubName) {
  const opponents = ["Rival FC", "Athletic Club", "United 26", "Olympique Nord", "Sporting Sud", "Real Capital", "City Academy", "Dynamo Est"];
  return opponents.map((opponent, index) => ({
    id: uid("fixture"),
    week: index + 1,
    competition: index % 5 === 0 ? "Coupe" : "Championnat",
    home: index % 2 === 0 ? clubName : opponent,
    away: index % 2 === 0 ? opponent : clubName,
    played: false,
    score: null,
  }));
}

function createCareer(type = "manager", club = CLUBS[0], options = {}) {
  const squad = Array.from({ length: 22 }, (_, index) => createPlayer(index, club.name));
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
    fixtures: createFixtures(club.name),
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
    return { fixtures, squad: career.squad, resultDelta: 0, summary: "Aucun match cette semaine", scorerName: null };
  }

  const power = clamp((career.morale + career.cohesion + career.reputation - career.pressure) / 3);
  const ownGoals = Math.max(0, Math.floor(Math.random() * 4 * (power / 100) + Math.random()));
  const oppGoals = Math.max(0, Math.floor(Math.random() * 4 * ((100 - power) / 100) + Math.random()));

  fixture.played = true;
  fixture.score = `${ownGoals}-${oppGoals}`;

  const squad = career.squad.map((player) => ({ ...player }));
  let scorerName = null;

  if (ownGoals > 0) {
    const attackers = squad.filter((player) => ["BU", "AD", "AG", "MOC", "MC"].includes(player.position));
    const scorer = pick(attackers.length ? attackers : squad);
    scorer.goals += 1;
    scorer.appearances += 1;
    scorerName = scorer.name;
  }

  squad.forEach((player) => {
    if (Math.random() < 0.25) player.appearances += 1;
    player.fatigue = clamp(player.fatigue + Math.random() * 12);
  });

  const resultDelta = ownGoals > oppGoals ? 1 : ownGoals === oppGoals ? 0 : -1;
  return { fixtures, squad, resultDelta, summary: `${fixture.home} ${fixture.score} ${fixture.away}`, scorerName };
}

function chooseEventCategory(career, resultDelta) {
  const categories = ["Match", "Moral", "Vestiaire", "Médias", "Mercato", "Staff", "Supporters", "Direction"];
  if (career.squad.some((player) => player.fatigue > 72)) categories.push("Blessures", "Blessures");
  if (resultDelta < 0) categories.push("Direction", "Médias", "Moral");
  if (resultDelta > 0) categories.push("Supporters", "Match");

  const recent = career.eventMemory || [];
  const filtered = categories.filter((category) => !recent.slice(0, 4).some((item) => item.category === category));
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
    <g opacity="0.18">
      <rect x="80" y="90" width="1040" height="520" rx="48" fill="none" stroke="white" stroke-width="8"/>
      <line x1="600" y1="90" x2="600" y2="610" stroke="white" stroke-width="6"/>
      <circle cx="600" cy="350" r="110" fill="none" stroke="white" stroke-width="6"/>
    </g>
    <rect x="70" y="70" width="1060" height="170" rx="42" fill="rgba(0,0,0,.35)"/>
    <text x="110" y="145" font-family="Arial" font-size="38" font-weight="900" fill="white">${meta.icon} ${safeClub}</text>
    <text x="110" y="205" font-family="Arial" font-size="42" font-weight="900" fill="white">${safeTitle}</text>
    <rect x="70" y="520" width="1060" height="120" rx="38" fill="rgba(0,0,0,.38)"/>
    <text x="110" y="595" font-family="Arial" font-size="34" font-weight="900" fill="white">Joueur concerné : ${safePlayer}</text>
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
      `Modifier son statut : rotation importante ou titulaire provisoire`,
    ],
    Blessures: [
      `Baisser l’endurance de ${playerName}`,
      `Mettre ${playerName} au repos 1 match`,
      `Réduire son intensité d’entraînement`,
    ],
    Moral: [
      `Augmenter ou baisser le moral de ${playerName}`,
      `Modifier son rôle dans l’effectif`,
      `Changer son temps de jeu prévu`,
    ],
    Vestiaire: [
      `Modifier l’importance de ${playerName} dans le groupe`,
      `Surveiller sa relation avec les cadres`,
      `Ajuster son statut de leadership`,
    ],
    Médias: [
      `Augmenter la pression médiatique autour de ${playerName}`,
      `Modifier légèrement sa réputation`,
      `Créer une storyline presse pendant 2 semaines`,
    ],
    Mercato: [
      `Ajouter ${playerName} à une shortlist transfert`,
      `Modifier son statut : ouvert aux offres ou intransférable`,
      `Ajuster sa valeur ou son salaire demandé`,
    ],
    Supporters: [
      `Augmenter la popularité de ${playerName}`,
      `Le faire démarrer le prochain match si tu cèdes à la pression`,
      `Créer une storyline supporters`,
    ],
    Direction: [
      `Noter ${playerName} comme dossier board`,
      `Préparer une vente si la situation empire`,
      `Demander un objectif sportif sur 3 matchs`,
    ],
    Staff: [
      `Changer le plan d’entraînement de ${playerName}`,
      `Tester ${playerName} à un nouveau poste`,
      `Modifier son rôle tactique`,
    ],
  };

  return [...clubEffects, ...(playerEffects[category] || [])];
}

function getEventRarity(resultDelta) {
  const roll = Math.random() * 100;
  if (roll > 97) return "Légendaire";
  if (roll > 88) return "Épique";
  if (roll > 68 || resultDelta < 0) return "Rare";
  return "Commun";
}

function buildContextualEvent(career, result) {
  const category = chooseEventCategory(career, result.resultDelta);
  const templates = EVENT_TEMPLATES[category] || EVENT_TEMPLATES.Match;
  const recent = career.eventMemory || [];
  const available = templates.filter((template) => {
    return !recent.some(
      (item) => item.category === category && item.templateTitle === template.title
    );
  });
  const template = pick(available.length ? available : templates);

  const players = [...career.squad]
    .sort((a, b) => {
      const scoreA = a.overall + a.form * 0.35 - a.fatigue * 0.2 + a.morale * 0.15;
      const scoreB = b.overall + b.form * 0.35 - b.fatigue * 0.2 + b.morale * 0.15;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  const player = pick(players.length ? players : career.squad);
  const fixtureText = result.summary || "semaine sans match officiel";
  const consequences = consequencesFor(category, result.resultDelta, career);
  const impact = Object.entries(consequences)
    .map(([key, value]) => `${key} ${value > 0 ? "+" : ""}${value}`)
    .join(" · ");
  const rarity = getEventRarity(result.resultDelta);
  const title = `${player.name} ${template.title} — ${career.club.name}`;

  let description = "";
  let detail = "";

  if (template.type === "direct") {
    description = `${player.name} vient te voir pour parler de sa situation dans l'équipe.`;
    detail = `${player.name} veut savoir si tu comptes vraiment sur lui. Performance : ${player.form}, moral : ${player.morale}, fatigue : ${player.fatigue}.`;
  } else if (template.type === "media") {
    description = `Une fuite dans la presse évoque ${player.name} et met le club sous pression.`;
    detail = `Les journalistes parlent déjà de malaise interne. Contexte : ${fixtureText}.`;
  } else if (template.type === "transfer") {
    description = `${player.name} envisage un départ si sa situation ne change pas.`;
    detail = `Valeur estimée : ${money(player.value)}. Poste : ${player.position}, OVR ${player.overall}.`;
  } else if (template.type === "agent") {
    description = `L’agent de ${player.name} met la pression sur la direction.`;
    detail = `Le dossier peut devenir sensible si tu ne clarifies pas rapidement la situation du joueur.`;
  } else if (template.type === "rival") {
    description = `Un coach rival te provoque en mentionnant ${player.name}.`;
    detail = `Cette déclaration peut motiver ou démoraliser le joueur selon ta réponse.`;
  } else if (template.type === "star") {
    description = `Une star adverse évoque ${player.name} comme un talent à surveiller.`;
    detail = `Cette comparaison peut influencer son moral et sa valeur de mercato.`;
  } else if (template.type === "medical") {
    description = `${player.name} est sous surveillance médicale.`;
    detail = `Fatigue : ${player.fatigue}, forme : ${player.form}. Le staff recommande prudence.`;
  } else if (template.type === "fans") {
    description = `Les supporters parlent beaucoup de ${player.name}.`;
    detail = `La pression populaire monte et le club attend ta réaction.`;
  } else if (template.type === "board") {
    description = `La direction veut un point clair sur ${player.name}.`;
    detail = `Le joueur devient un dossier stratégique pour le board.`;
  } else {
    description = `${player.name} est au centre d’une situation importante.`;
    detail = `Déclencheur : ${template.trigger}.`;
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
    liveEditorEffects: createLiveEditorEffects(category, consequences, player.name),
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
  next.transferTension = clamp(next.transferTension + (cons.transferTension || 0));
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
  const initials = club.name.split(" ").map((word) => word[0]).slice(0, 3).join("");
  return (
    <div className={`badge ${size}`} style={{ background: `linear-gradient(135deg, ${club.colors[0]}, ${club.colors[1]})` }}>
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
          <button type="button" className="big-choice manager" onClick={() => onChoose("manager")}>
            <div className="stat-label">Kick-off</div>
            <h2>Manager Career</h2>
            <p>Contrôle le club, les décisions, la pression, les finances et les storylines.</p>
          </button>

          <button type="button" className="big-choice player" onClick={() => onChoose("player")}>
            <div className="stat-label">Player Path</div>
            <h2>Player Career</h2>
            <p>Suis un joueur, sa forme, son coach, sa réputation et ses choix.</p>
          </button>
        </div>
      </section>

      <section className="preview">
        <div className="preview-inner">
          <div className="club-row">
            <ClubBadge club={CLUBS[0]} size="large" />
            <div>
              <Kicker tone="cyan">Career Central</Kicker>
              <h2>Girondins de Bordeaux</h2>
              <p className="muted">Saison 1 · Semaine 1</p>
            </div>
          </div>

          <div className="stat-grid" style={{ marginTop: 22 }}>
            <Stat label="Moral" value="78" tone="lime" />
            <Stat label="Board" value="64" tone="violet" />
            <Stat label="Budget" value="42 M€" tone="cyan" />
            <Stat label="Pression" value="31" tone="amber" />
          </div>

          <div className="card pitch" style={{ marginTop: 20 }}>
            <Kicker tone="lime">New Event</Kicker>
            <h3>Nino Bernard bouscule la hiérarchie</h3>
            <p className="muted">Le staff doit choisir entre continuité et récompense sportive.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ClubPicker({ type, onBack, onConfirm }) {
  const [selectedName, setSelectedName] = useState(CLUBS[0].name);
  const [managerName, setManagerName] = useState(type === "player" ? "Mon Pro" : "Coach");
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
        <button type="button" className="secondary-btn" onClick={onBack}>← Retour</button>

        <div className="club-row" style={{ marginTop: 30, justifyContent: "space-between" }}>
          <div>
            <Kicker tone="lime">Club Select</Kicker>
            <h1 className="title-xl">Créer une carrière {type === "player" ? "Joueur" : "Manager"}</h1>
            <p className="muted">Choisis un club, un nom et un objectif.</p>
          </div>
          <ClubBadge club={selected} size="large" />
        </div>

        <div className="grid-3" style={{ marginTop: 28 }}>
          {CLUBS.map((club) => (
            <button key={club.name} type="button" className={`club-card ${selected.name === club.name ? "selected" : ""}`} onClick={() => selectClub(club)}>
              <ClubBadge club={club} size="small" />
              <h2>{club.name}</h2>
              <p className="muted">{club.league}</p>
              <p>Budget <b>{money(club.budget)}</b> · Rép. <b>{club.reputation}</b></p>
            </button>
          ))}
        </div>

        <div className="panel" style={{ marginTop: 22 }}>
          <div className="grid-2">
            <label>
              <div className="stat-label">{type === "player" ? "Nom du joueur" : "Nom du coach"}</div>
              <input className="input" value={managerName} onChange={(event) => setManagerName(event.target.value)} />
            </label>

            <label>
              <div className="stat-label">Objectif personnalisé</div>
              <input className="input" value={objective} onChange={(event) => setObjective(event.target.value)} />
            </label>
          </div>

          <button type="button" className="primary-btn" style={{ marginTop: 18 }} onClick={() => onConfirm(type, selected, { managerName, objective })}>
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
          <Kicker tone="cyan">Semaine {career.week}</Kicker>
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
  return (
    <div>
      <h2>Inbox événements</h2>
      <div className="grid-3">
        {career.events.length ? (
          career.events.map((event) => {
            const meta = CATEGORY_META[event.category] || CATEGORY_META.Match;
            return (
              <button key={event.id} type="button" className="event-card" onClick={() => onOpen(event)}>
                <div className="event-strip" style={{ background: meta.color }} />
                <div className="event-body">
                  <div className="club-row" style={{ justifyContent: "space-between" }}>
                    <Kicker>{meta.icon} {event.category}</Kicker>
                    <Kicker tone={event.status === "resolved" ? "green" : "amber"}>
                      {event.status === "resolved" ? "Résolu" : "Nouveau"}
                    </Kicker>
                  </div>
                  <h3>{event.title}</h3>
                  <p className="muted">{event.description}</p>
                  <p className="soft">{event.impact}</p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="card">Aucun événement. Avance d’une semaine pour générer une storyline.</div>
        )}
      </div>
    </div>
  );
}

function EventModal({ event, onClose, onDecision }) {
  if (!event) return null;

  const meta = CATEGORY_META[event.category] || CATEGORY_META.Match;
  const playerName = event.playerContext?.name || event.player || "Joueur concerné";
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
            <img className="event-image" src={event.imageUrl} alt={event.title} />

            <div className="stat-grid" style={{ marginTop: 18 }}>
              <Stat label="Rareté" value={event.rarity} tone="amber" />
              <Stat label="Semaine" value={event.week} tone="cyan" />
              <Stat label="Joueur" value={playerName} tone="lime" />
              <Stat label="OVR" value={playerOverall} tone="violet" />
            </div>

            <div className="card" style={{ marginTop: 18 }}>
              <h3>Profil joueur</h3>
              <p>Nom : <b>{playerName}</b></p>
              <p>Poste : <b>{playerPosition}</b></p>
              <p>OVR : <b>{playerOverall}</b></p>
              <p>Forme : <b>{playerForm}</b></p>
              <p>Moral : <b>{playerMorale}</b></p>
              <p>Fatigue : <b>{playerFatigue}</b></p>
            </div>
          </aside>

          <section className="modal-right">
            <div className="club-row" style={{ justifyContent: "space-between" }}>
              <div className="club-row">
                <Kicker>{meta.icon} {event.category}</Kicker>
                <Kicker tone="amber">{event.rarity}</Kicker>
                <Kicker tone={event.status === "resolved" ? "green" : "red"}>
                  {event.status === "resolved" ? "Résolu" : "Décision requise"}
                </Kicker>
              </div>
              <button type="button" className="close-btn" onClick={onClose}>×</button>
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

            <div className="card" style={{ marginTop: 14 }}>
              <h3>Effets à appliquer dans Live Editor</h3>
              <ul className="effect-list">
                {(event.liveEditorEffects || []).map((effect, index) => (
                  <li key={`${effect}-${index}`}>
                    <span style={{ color: "var(--amber)" }}>▸</span>
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <h3>Décision narrative</h3>
              <div className="choice-grid">
                {(event.choices || []).map((choice) => (
                  <button key={choice} type="button" className="choice-btn" onClick={() => onDecision(event, choice)}>
                    {choice}
                    <br />
                    <small>Appliquer cette décision à la storyline.</small>
                  </button>
                ))}
              </div>
            </div>
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
      .filter((player) => player.name.toLowerCase().includes(query.toLowerCase()) || player.position.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.overall - a.overall);
  }, [career.squad, query]);

  return (
    <div>
      <input className="input" placeholder="Filtrer par nom ou poste" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="grid-3" style={{ marginTop: 18 }}>
        {squad.map((player) => (
          <div key={player.id} className="card">
            <div className="club-row" style={{ justifyContent: "space-between" }}>
              <h3>{player.name}</h3>
              <Kicker>{player.position}</Kicker>
            </div>
            <p className="muted">{player.age} ans</p>
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
            <Kicker tone={fixture.played ? "green" : "cyan"}>Semaine {fixture.week}</Kicker>
            <span className="muted">{fixture.competition}</span>
          </div>
          <h3>{fixture.home} {fixture.score || "-"} {fixture.away}</h3>
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
            <p key={decision.id}>S{decision.week} · {decision.event} → <b>{decision.choice}</b></p>
          ))
        ) : (
          <p className="muted">Aucune décision.</p>
        )}
      </div>

      <div className="card">
        <h2>Storylines</h2>
        {career.activeStorylines.length ? (
          career.activeStorylines.map((story) => (
            <p key={story.id}>{story.title} · Dernier choix : <b>{story.lastChoice}</b></p>
          ))
        ) : (
          <p className="muted">Aucune storyline active.</p>
        )}
      </div>
    </div>
  );
}

export default function CareerApp() {
  const [theme, setTheme] = useState("dark");
  const [screen, setScreen] = useState("home");
  const [pendingType, setPendingType] = useState("manager");
  const [careers, setCareers] = useState(() => [createCareer("manager", CLUBS[0])]);
  const [activeId, setActiveId] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [activeEvent, setActiveEvent] = useState(null);
  const [loaded, setLoaded] = useState(false);

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
        setActiveId(careers[0].id);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setActiveId(careers[0].id);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(careers));
    }
  }, [careers, loaded]);

  const career = careers.find((item) => item.id === activeId) || careers[0];

  function replaceCareer(nextCareer) {
    setCareers((list) => list.map((item) => (item.id === nextCareer.id ? nextCareer : item)));
  }

  function createNewCareer(type, club, options) {
    const next = createCareer(type, club, options);
    setCareers((list) => [next, ...list]);
    setActiveId(next.id);
    setScreen("career");
    setTab("dashboard");
  }

  function advanceWeek() {
    let next = {
      ...career,
      squad: career.squad.map((player) => ({ ...player })),
      fixtures: career.fixtures.map((fixture) => ({ ...fixture })),
    };

    const result = simulateResult(next);
    next.fixtures = result.fixtures;
    next.squad = result.squad;
    next.week += 1;
    next.month = MONTHS[Math.floor(next.week / 4)] || "Mai";
    next.morale = clamp(next.morale + result.resultDelta * 5);
    next.reputation = clamp(next.reputation + result.resultDelta * 2);
    next.popularity = clamp(next.popularity + result.resultDelta * 3);

    const event = buildContextualEvent(next, result);
    next = applyConsequences(next, event);
    next.events = [event, ...next.events];
    next.eventMemory = [
      { id: event.id, category: event.category, templateTitle: event.templateTitle, player: event.player, week: event.week },
      ...(next.eventMemory || []),
    ].slice(0, 12);
    next.news = [generateArticle(next, event), ...next.news];

    replaceCareer(next);
    setTab("events");
    setActiveEvent(event);
  }

  function handleDecision(event, choice) {
    let next = { ...career };
    next.decisions = [{ id: uid("decision"), week: next.week, event: event.title, choice }, ...next.decisions];
    next.events = next.events.map((item) => (item.id === event.id ? { ...item, status: "resolved", choice } : item));
    next.activeStorylines = [{ id: uid("story"), title: event.title, category: event.category, lastChoice: choice }, ...next.activeStorylines].slice(0, 8);
    replaceCareer(next);
    setActiveEvent(null);
  }

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
      <div className={`app ${theme === "light" ? "light" : ""}`}>
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
      <div className={`app ${theme === "light" ? "light" : ""}`}>
        <ClubPicker type={pendingType} onBack={() => setScreen("home")} onConfirm={createNewCareer} />
      </div>
    );
  }

  const tabs = [
    ["dashboard", "Hub"],
    ["events", "Événements"],
    ["squad", "Effectif"],
    ["calendar", "Calendrier"],
    ["news", "News"],
    ["history", "Historique"],
  ];

  return (
    <div className={`app ${theme === "light" ? "light" : ""}`}>
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

            <p className="muted">Saison {career.season} · Semaine {career.week} · {career.month}</p>

            <select className="select" value={activeId} onChange={(event) => setActiveId(event.target.value)}>
              {careers.map((item) => (
                <option key={item.id} value={item.id}>{item.club.name} — {item.type}</option>
              ))}
            </select>

            <button type="button" className="secondary-btn" onClick={() => setScreen("home")}>Accueil</button>
            <button type="button" className="secondary-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              Mode {theme === "dark" ? "clair" : "sombre"}
            </button>

            <nav className="nav">
              {tabs.map(([id, label]) => (
                <button key={id} type="button" className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
                  {label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
              <button type="button" className="primary-btn" onClick={advanceWeek}>▶ Avancer d’une semaine</button>
            </div>
          </aside>

          <main className="main">
            <header className="panel header-grid">
              <div>
                <Kicker tone="lime">{career.type === "player" ? "Mode Joueur" : "Mode Manager"}</Kicker>
                <h1 className="title-xl">{career.club.name}</h1>
                <p className="muted">{career.customObjective}</p>
              </div>

              <div className="stat-grid">
                <Stat label="Budget" value={money(career.budget)} tone="cyan" />
                <Stat label="Moral" value={career.morale} tone="lime" />
                <Stat label="Réputation" value={career.reputation} tone="cyan" />
                <Stat label="Direction" value={career.boardTrust} tone="violet" />
              </div>
            </header>

            {tab === "dashboard" ? <Dashboard career={career} /> : null}
            {tab === "events" ? <EventsView career={career} onOpen={setActiveEvent} /> : null}
            {tab === "squad" ? <SquadView career={career} /> : null}
            {tab === "calendar" ? <CalendarView career={career} /> : null}
            {tab === "news" ? <NewsView career={career} /> : null}
            {tab === "history" ? <HistoryView career={career} /> : null}
          </main>
        </div>
      </div>

      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} onDecision={handleDecision} />
    </div>
  );
}

