"use client";

import { useEffect, useMemo, useState } from "react";

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampScore(value) {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, Math.round(safe)));
}

function makeId(prefix) {
  return (
    prefix +
    "-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

function getMarketLevel(score) {
  if (score >= 85) {
    return {
      label: "Très recherché",
      color: "#22d3ee",
      detail:
        "Ton profil attire des clubs importants. Une offre sérieuse peut tomber rapidement.",
    };
  }

  if (score >= 70) {
    return {
      label: "Courtisé",
      color: "#bef264",
      detail:
        "Plusieurs clubs suivent ta situation. Un bon timing peut déclencher une approche concrète.",
    };
  }

  if (score >= 55) {
    return {
      label: "Surveillance",
      color: "#fbbf24",
      detail:
        "Tu es observé par des recruteurs, mais le marché n’est pas encore totalement chaud.",
    };
  }

  return {
    label: "Peu suivi",
    color: "#94a3b8",
    detail:
      "Le marché reste calme autour de toi. Il faut encore faire monter ta cote.",
  };
}

function StatCard({ label, value, color = "white" }) {
  return (
    <div
      className="card"
      style={{
        background: "rgba(2,6,23,.45)",
        border: "1px solid rgba(255,255,255,.10)",
      }}
    >
      <p
        className="muted"
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </p>
      <h3 style={{ margin: "8px 0 0", color }}>{value}</h3>
    </div>
  );
}

function getCurrentWeek(career) {
  return Number(
    career?.week ??
      career?.currentWeek ??
      career?.meta?.week ??
      career?.world?.week ??
      1
  );
}

function getPosition(career) {
  return (
    career?.identity?.position ||
    career?.profile?.position ||
    career?.state?.position ||
    career?.position ||
    "ATT"
  );
}

function hashSeed(input) {
  const text = String(input || "");
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seededPick(list, count, seedBase) {
  const arr = [...list];
  const picked = [];

  let seed = hashSeed(seedBase);

  while (arr.length && picked.length < count) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const index = seed % arr.length;
    picked.push(arr[index]);
    arr.splice(index, 1);
  }

  return picked;
}

function getClubPools(position) {
  const attacking = [
    { name: "Arsenal", tier: "top", country: "Angleterre" },
    { name: "Napoli", tier: "high", country: "Italie" },
    { name: "Marseille", tier: "high", country: "France" },
    { name: "Real Betis", tier: "mid", country: "Espagne" },
    { name: "Lille", tier: "mid", country: "France" },
    { name: "Francfort", tier: "mid", country: "Allemagne" },
  ];

  const midfield = [
    { name: "Atalanta", tier: "high", country: "Italie" },
    { name: "Lyon", tier: "high", country: "France" },
    { name: "Séville", tier: "mid", country: "Espagne" },
    { name: "Villarreal", tier: "mid", country: "Espagne" },
    { name: "Monaco", tier: "high", country: "France" },
    { name: "Leverkusen", tier: "top", country: "Allemagne" },
  ];

  const defense = [
    { name: "Inter", tier: "top", country: "Italie" },
    { name: "Newcastle", tier: "high", country: "Angleterre" },
    { name: "Nice", tier: "mid", country: "France" },
    { name: "Valence", tier: "mid", country: "Espagne" },
    { name: "Leipzig", tier: "high", country: "Allemagne" },
    { name: "Bologne", tier: "mid", country: "Italie" },
  ];

  const gk = [
    { name: "Benfica", tier: "high", country: "Portugal" },
    { name: "Lazio", tier: "high", country: "Italie" },
    { name: "Rennes", tier: "mid", country: "France" },
    { name: "PSV", tier: "high", country: "Pays-Bas" },
    { name: "Real Sociedad", tier: "mid", country: "Espagne" },
    { name: "Porto", tier: "top", country: "Portugal" },
  ];

  if (position.includes("GK")) return gk;
  if (
    position.includes("CB") ||
    position.includes("RB") ||
    position.includes("LB")
  ) {
    return defense;
  }
  if (
    position.includes("CM") ||
    position.includes("CDM") ||
    position.includes("CAM")
  ) {
    return midfield;
  }

  return attacking;
}

function computeInterestedClubs(career, marketScore) {
  const position = getPosition(career);
  const pool = getClubPools(position);
  const week = getCurrentWeek(career);
  const nameSeed =
    career?.identity?.name ||
    career?.profile?.fullName ||
    career?.name ||
    "player";

  const count =
    marketScore >= 82 ? 4 : marketScore >= 68 ? 3 : marketScore >= 55 ? 2 : 0;

  const shortlist = seededPick(pool, count, nameSeed + "-" + week);

  return shortlist.map((club, index) => ({
    ...club,
    interest:
      marketScore >= 82
        ? index === 0
          ? "Très fort"
          : "Fort"
        : marketScore >= 68
        ? index === 0
          ? "Fort"
          : "Concret"
        : "Observation",
  }));
}

function computeOffer(career, marketScore, interestedClubs) {
  if (marketScore < 74 || interestedClubs.length === 0) return null;

  const primaryClub = interestedClubs[0];
  const base =
    marketScore * 850000 +
    safeNumber(career?.stats?.goals, 0) * 350000 +
    safeNumber(career?.stats?.assists, 0) * 250000;

  const rounded = Math.max(3000000, Math.round(base / 500000) * 500000);

  const role =
    marketScore >= 85
      ? "Titulaire important"
      : marketScore >= 78
      ? "Rotation forte"
      : "Projet à développer";

  return {
    id: makeId("offer"),
    club: primaryClub.name,
    country: primaryClub.country,
    tier: primaryClub.tier,
    amount: rounded,
    display:
      rounded >= 1000000
        ? "€" + (rounded / 1000000).toFixed(1).replace(".0", "") + "M"
        : "€" + rounded,
    role,
    contractYears: marketScore >= 82 ? 5 : 4,
    status: "open",
  };
}

function buildWorldUpdate(world, title, body, type, author, socialText) {
  const event = {
    id: makeId("mercato-event"),
    date: new Date().toISOString(),
    label: title,
    detail: body,
  };

  const news = {
    id: makeId("mercato-news"),
    type,
    title,
    body,
  };

  const social = {
    id: makeId("mercato-social"),
    author,
    text: socialText,
  };

  return {
    ...world,
    timeline: [event, ...(world.timeline || [])].slice(0, 30),
    news: [news, ...(world.news || [])].slice(0, 24),
    socialFeed: [social, ...(world.socialFeed || [])].slice(0, 24),
  };
}

function makePendingResponse(actionType, career, marketScore) {
  const week = getCurrentWeek(career);

  if (actionType === "agent") {
    if (marketScore >= 75) {
      return {
        id: makeId("pending-response"),
        type: "agent",
        availableWeek: week + 1,
        title: "Retour de l’agent",
        body:
          "Ton agent a reçu des signaux positifs. Plusieurs clubs veulent suivre ton dossier de plus près.",
      };
    }

    return {
      id: makeId("pending-response"),
      type: "agent",
      availableWeek: week + 1,
      title: "Retour de l’agent",
      body:
        "Ton agent estime que le marché reste prudent, mais ton nom reste dans plusieurs discussions.",
    };
  }

  if (actionType === "club") {
    if (safeNumber(career?.state?.coachTrust, 50) >= 65) {
      return {
        id: makeId("pending-response"),
        type: "club",
        availableWeek: week + 1,
        title: "Réponse du club",
        body:
          "Le club te voit comme un joueur important et veut continuer à te développer dans le projet.",
      };
    }

    return {
      id: makeId("pending-response"),
      type: "club",
      availableWeek: week + 1,
      title: "Réponse du club",
      body:
        "Le club reste attentif à ta situation, mais attend encore des garanties sportives avant de clarifier ton rôle.",
    };
  }

  if (actionType === "focus") {
    return {
      id: makeId("pending-response"),
      type: "mental",
      availableWeek: week + 1,
      title: "Réaction interne",
      body:
        "Ton message de concentration est bien perçu. Le vestiaire et le staff apprécient ton calme.",
    };
  }

  if (actionType === "ambition") {
    return {
      id: makeId("pending-response"),
      type: "media",
      availableWeek: week + 1,
      title: "Réaction des médias",
      body:
        "Tes déclarations ambitieuses relancent les débats. Des clubs commencent à s’intéresser à ton profil.",
    };
  }

  return null;
}

export default function PlayerMercato({
  playerCareer = {},
  onUpdate = () => {},
}) {
  const [localCareer, setLocalCareer] = useState(playerCareer || {});
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    setLocalCareer(playerCareer || {});
  }, [playerCareer]);

  const career = localCareer || {};
  const state = career.state || {};
  const stats = career.stats || {};
  const world = career.world || {};

  const reputation = safeNumber(state.reputation, 40);
  const popularity = safeNumber(state.popularity, 35);
  const agentTrust = safeNumber(state.agentTrust, 50);
  const transferDesire = safeNumber(state.transferDesire, 0);
  const morale = safeNumber(state.morale, 70);
  const coachTrust = safeNumber(state.coachTrust, 50);
  const mediaPressure = safeNumber(state.mediaPressure, 20);

  const goals = safeNumber(stats.goals, 0);
  const assists = safeNumber(stats.assists, 0);
  const matches = safeNumber(stats.matches, 0);
  const averageRating = safeNumber(stats.averageRating, 6.8);

  const currentWeek = getCurrentWeek(career);

  const marketScore = useMemo(
    () =>
      clampScore(
        reputation * 0.28 +
          popularity * 0.18 +
          agentTrust * 0.2 +
          transferDesire * 0.14 +
          goals * 1.3 +
          assists * 0.9 +
          averageRating * 3 -
          mediaPressure * 0.06
      ),
    [
      reputation,
      popularity,
      agentTrust,
      transferDesire,
      goals,
      assists,
      averageRating,
      mediaPressure,
    ]
  );

  const level = getMarketLevel(marketScore);

  const interestedClubs = useMemo(
    () => computeInterestedClubs(career, marketScore),
    [career, marketScore]
  );

  const generatedOffer = useMemo(
    () => computeOffer(career, marketScore, interestedClubs),
    [career, marketScore, interestedClubs]
  );

  useEffect(() => {
    const processedWeek = safeNumber(world.marketPulseWeek, 0);
    if (currentWeek <= processedWeek) return;

    const pulseTitle = "Point marché hebdomadaire";
    const pulseBody =
      interestedClubs.length > 0
        ? "Le marché réagit à tes dernières performances. Plusieurs clubs suivent le dossier."
        : "Le marché reste calme cette semaine. Il faut encore faire monter ta cote.";

    const nextWorld = buildWorldUpdate(
      world,
      pulseTitle,
      pulseBody,
      "Marché",
      "@MercatoPulse",
      interestedClubs.length > 0
        ? "Le marché continue de bouger autour du joueur."
        : "Peu de mouvements cette semaine autour du joueur."
    );

    const nextCareer = {
      ...career,
      world: {
        ...nextWorld,
        marketPulseWeek: currentWeek,
        interestedClubs,
        activeOffer:
          world.activeOffer && world.activeOffer.status === "negotiating"
            ? world.activeOffer
            : generatedOffer,
      },
    };

    setLocalCareer(nextCareer);
    onUpdate(nextCareer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]);

  useEffect(() => {
    const pending = world.pendingResponse;

    if (!pending) return;
    if (safeNumber(pending.availableWeek, 9999) > currentWeek) return;

    const resolvedNews = {
      id: makeId("resolved-response"),
      type: "Réponse",
      title: pending.title,
      body: pending.body,
    };

    const resolvedEvent = {
      id: makeId("resolved-event"),
      date: new Date().toISOString(),
      label: pending.title,
      detail: pending.body,
    };

    let nextCareer = {
      ...career,
      world: {
        ...world,
        pendingResponse: null,
        news: [resolvedNews, ...(world.news || [])].slice(0, 24),
        timeline: [resolvedEvent, ...(world.timeline || [])].slice(0, 30),
      },
    };

    if (pending.type === "agent" && marketScore >= 72 && !world.activeOffer) {
      nextCareer = {
        ...nextCareer,
        world: {
          ...nextCareer.world,
          activeOffer: {
            id: makeId("offer"),
            club: "Arsenal",
            country: "Angleterre",
            tier: "high",
            amount: 75000000,
            display: "€75M",
            role: "Rotation forte",
            contractYears: 4,
            status: "open",
          },
        },
      };
    }

    setLocalCareer(nextCareer);
    onUpdate(nextCareer);
    setPopup({
      title: pending.title,
      body: pending.body,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]);

  const activeOffer =
    (career.world && career.world.activeOffer) || generatedOffer || null;

  function commit(
    nextCareer,
    title,
    body,
    type,
    author,
    socialText,
    actionType = null
  ) {
    const nextWorld = buildWorldUpdate(world, title, body, type, author, socialText);

    const pendingResponse = actionType
      ? makePendingResponse(actionType, nextCareer, marketScore)
      : null;

    const finalCareer = {
      ...nextCareer,
      world: {
        ...nextWorld,
        interestedClubs,
        activeOffer:
          nextCareer.world &&
          Object.prototype.hasOwnProperty.call(nextCareer.world, "activeOffer")
            ? nextCareer.world.activeOffer
            : activeOffer,
        pendingResponse,
      },
    };

    setLocalCareer(finalCareer);
    onUpdate(finalCareer);
    setPopup({ title, body });
  }

  function callAgent() {
    const title = "Appel avec l’agent";
    const body =
      "Ton agent commence à activer discrètement son réseau sans provoquer ton club.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        agentTrust: clampScore(agentTrust + 4),
        transferDesire: clampScore(transferDesire + 2),
        morale: clampScore(morale + 1),
        mediaPressure: clampScore(mediaPressure + 1),
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Agent",
      "@AgentRoom",
      "L’entourage du joueur reste attentif au marché, sans mouvement officiel.",
      "agent"
    );
  }

  function askClub() {
    const title = "Position du club demandée";
    const body =
      "Tu demandes au club comment il voit ton avenir et ton temps de jeu.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        morale: clampScore(morale + 1),
        mediaPressure: clampScore(mediaPressure + 1),
        coachTrust: clampScore(coachTrust + 1),
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Club",
      "@InsideClub",
      "Le club discute du rôle du joueur dans le projet sportif.",
      "club"
    );
  }

  function stayFocused() {
    const title = "Message de concentration";
    const body =
      "Tu refuses de parler transfert et tu veux répondre sur le terrain.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        morale: clampScore(morale + 2),
        transferDesire: clampScore(transferDesire - 2),
        mediaPressure: clampScore(mediaPressure - 1),
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Mentalité",
      "@PlayerBuzz",
      "Le joueur veut rester concentré sur le terrain.",
      "focus"
    );
  }

  function showAmbition() {
    const title = "Ambition affichée";
    const body =
      "Tu laisses entendre que tu veux viser plus haut dans ta carrière.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        popularity: clampScore(popularity + 3),
        transferDesire: clampScore(transferDesire + 4),
        mediaPressure: clampScore(mediaPressure + 4),
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Médias",
      "@MercatoLive",
      "Une déclaration ambitieuse relance les discussions autour du joueur.",
      "ambition"
    );
  }

  function refuseOffer() {
    if (!activeOffer) return;

    const title = "Offre refusée";
    const body =
      "Tu refuses l’approche pour le moment et restes concentré sur ta situation actuelle.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        morale: clampScore(morale + 1),
        transferDesire: clampScore(transferDesire - 1),
      },
      world: {
        ...world,
        activeOffer: {
          ...activeOffer,
          status: "refused",
        },
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Décision",
      "@ClubWatch",
      "Le joueur décide de fermer la porte à cette offre."
    );
  }

  function negotiateOffer() {
    if (!activeOffer) return;

    const title = "Négociation ouverte";
    const increasedAmount = Math.round(activeOffer.amount * 1.12);

    const body =
      "Ton entourage demande de meilleures garanties sportives et une indemnité supérieure.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        mediaPressure: clampScore(mediaPressure + 2),
        transferDesire: clampScore(transferDesire + 1),
      },
      world: {
        ...world,
        activeOffer: {
          ...activeOffer,
          amount: increasedAmount,
          display:
            increasedAmount >= 1000000
              ? "€" +
                (increasedAmount / 1000000)
                  .toFixed(1)
                  .replace(".0", "") +
                "M"
              : "€" + increasedAmount,
          status: "negotiating",
        },
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Négociation",
      "@MercatoDesk",
      "Les discussions avancent autour d’une possible revalorisation de l’offre."
    );
  }

  function acceptOffer() {
    if (!activeOffer) return;

    const title = "Accord de transfert trouvé";
    const body =
      "Le joueur et le club trouvent un terrain d’entente. Le transfert est prêt à être finalisé.";

    const nextCareer = {
      ...career,
      state: {
        ...state,
        morale: clampScore(morale + 3),
        transferDesire: clampScore(transferDesire + 5),
      },
      world: {
        ...world,
        activeOffer: {
          ...activeOffer,
          status: "accepted",
        },
        transferOutcome: {
          accepted: true,
          newClub: activeOffer.club,
          amount: activeOffer.amount,
          role: activeOffer.role,
          contractYears: activeOffer.contractYears,
        },
      },
    };

    commit(
      nextCareer,
      title,
      body,
      "Transfert",
      "@TransferNews",
      "Accord trouvé : le joueur se rapproche d’un nouveau club."
    );
  }

  const recentNews = (world.news || []).slice(0, 3);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {popup && (
        <div
          className="panel"
          style={{
            border: "2px solid #22d3ee",
            marginBottom: 16,
            background: "rgba(15,23,42,.88)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{popup.title}</h3>
              <p style={{ margin: "8px 0 0" }}>{popup.body}</p>
            </div>

            <button
              type="button"
              className="choice-btn"
              onClick={() => setPopup(null)}
            >
              <b>Fermer</b>
            </button>
          </div>
        </div>
      )}

      <section className="panel">
        <p style={{ color: "#a78bfa", fontWeight: 900 }}>
          Mercato joueur avancé
        </p>

        <h2>Radar des clubs</h2>

        <div
          className="card"
          style={{
            border: "2px solid " + level.color,
            marginTop: 12,
          }}
        >
          <h3>
            {level.label} ({marketScore}/100)
          </h3>
          <p className="muted" style={{ margin: "8px 0 0" }}>
            {level.detail}
          </p>
        </div>

        <div className="grid-4" style={{ marginTop: 12 }}>
          <StatCard label="Réputation" value={reputation} color="#22d3ee" />
          <StatCard label="Popularité" value={popularity} color="#bef264" />
          <StatCard label="Agent" value={agentTrust} color="#a78bfa" />
          <StatCard
            label="Envie de départ"
            value={transferDesire}
            color="#fbbf24"
          />
        </div>

        {interestedClubs.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <p className="muted" style={{ marginBottom: 8 }}>
              Clubs intéressés
            </p>

            <div className="grid-4">
              {interestedClubs.map((club) => (
                <div key={club.name} className="card">
                  <b>{club.name}</b>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    {club.country} · {club.interest}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 16 }}>
            Aucun club n’affiche encore d’intérêt concret cette semaine.
          </p>
        )}
      </section>

      {world.pendingResponse ? (
        <section className="panel">
          <p style={{ color: "#22d3ee", fontWeight: 900 }}>
            Réponse attendue
          </p>
          <h2>{world.pendingResponse.title}</h2>
          <p className="muted">{world.pendingResponse.body}</p>
          <p className="muted" style={{ marginTop: 8 }}>
            Disponible semaine {world.pendingResponse.availableWeek}
          </p>
        </section>
      ) : null}

      <section className="panel">
        <h2>Actions joueur</h2>

        <div className="grid-4">
          <button className="choice-btn" onClick={callAgent}>
            <b>Appeler l’agent</b>
            <span>Activer le réseau de ton agent.</span>
          </button>

          <button className="choice-btn" onClick={askClub}>
            <b>Demander la position du club</b>
            <span>Clarifier ton rôle et ton avenir.</span>
          </button>

          <button className="choice-btn" onClick={stayFocused}>
            <b>Rester concentré</b>
            <span>Baisser la pression et répondre sur le terrain.</span>
          </button>

          <button className="choice-btn" onClick={showAmbition}>
            <b>Afficher ton ambition</b>
            <span>Faire monter ta cote, mais aussi la pression.</span>
          </button>
        </div>
      </section>

      {activeOffer ? (
        <section className="panel">
          <p style={{ color: "#22d3ee", fontWeight: 900 }}>Offre reçue</p>
          <h2>{activeOffer.club}</h2>
          <p className="muted">
            {activeOffer.display} · {activeOffer.role} ·{" "}
            {activeOffer.contractYears} ans
          </p>

          <div className="grid-4" style={{ marginTop: 12 }}>
            <button className="choice-btn" onClick={acceptOffer}>
              <b>Accepter</b>
              <span>Valider si l’accord club est OK.</span>
            </button>

            <button className="choice-btn" onClick={negotiateOffer}>
              <b>Négocier</b>
              <span>Demander plus et faire monter la pression.</span>
            </button>

            <button className="choice-btn" onClick={refuseOffer}>
              <b>Refuser</b>
              <span>Fermer la porte pour le moment.</span>
            </button>
          </div>

          {activeOffer.status === "accepted" ? (
            <p className="muted" style={{ marginTop: 12 }}>
              Accord trouvé. Si tu veux que le club change partout dans
              l’application, il faudra brancher aussi le club racine dans
              CareerApp.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="panel">
        <h2>Réactions récentes</h2>

        {recentNews.length === 0 ? (
          <p className="muted">Aucune réaction pour le moment.</p>
        ) : (
          recentNews.map((item) => (
            <div key={item.id} className="card" style={{ marginTop: 10 }}>
              <b>{item.title}</b>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {item.body}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="panel">
        <h2>Données utilisées</h2>

        <div className="grid-4">
          <StatCard label="Buts" value={goals} />
          <StatCard label="Passes" value={assists} />
          <StatCard label="Matchs" value={matches} />
          <StatCard label="Note moyenne" value={averageRating} />
        </div>
      </section>
    </div>
  );
}