"use client";

import { useState } from "react";

import {
  clamp,
  createTimelineEvent,
  normalizePlayerCareer,
} from "./playerCareerDefaults";

function inputStyle() {
  return {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(2,6,23,.70)",
    color: "white",
    padding: "11px 12px",
    outline: "none",
  };
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span
        style={{
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createPostMatchDecision({ form, rating, goals, assists, resultDelta }) {
  const opponent = form.opponent || "l’adversaire";
  const decisive = goals > 0 || assists > 0;

  if (form.redCard) {
    return {
      id:
        "player-decision-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),
      type: "Discipline",
      tone: "danger",
      socialAuthor: "@InsideClub",
      title: "Le coach veut te voir après ton carton rouge",
      body:
        `Après le match contre ${opponent}, ton carton rouge crée une vraie tension. Le staff attend une réaction de ta part.`,
      choices: [
        {
          label: "Assumer devant le groupe",
          detail:
            "Tu reconnais ton erreur et tu promets de répondre sur le terrain.",
          social:
            "Le joueur assume son carton rouge en interne. Le vestiaire apprécie la réaction.",
          effects: {
            coachTrust: 2,
            morale: 1,
            mediaPressure: -2,
            supporters: 1,
          },
        },
        {
          label: "Contester la décision",
          detail:
            "Tu estimes que l’arbitre a été trop sévère. Le bruit médiatique augmente.",
          social:
            "Le joueur conteste son expulsion. La polémique continue autour du match.",
          effects: {
            coachTrust: -3,
            mediaPressure: 5,
            popularity: 1,
          },
        },
      ],
    };
  }

  if (form.injury) {
    return {
      id:
        "player-decision-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),
      type: "Staff médical",
      tone: "danger",
      socialAuthor: "@MedicalRoom",
      title: "Le staff médical veut gérer ton état physique",
      body:
        `Après le match contre ${opponent}, tu ressens une gêne. Le club veut éviter que ça devienne plus grave.`,
      choices: [
        {
          label: "Prendre du repos",
          detail:
            "Tu acceptes de réduire la charge pour revenir plus proprement.",
          social:
            "Le joueur choisit la prudence après une alerte physique.",
          effects: {
            fatigue: -10,
            form: -1,
            morale: 1,
            coachTrust: 1,
          },
        },
        {
          label: "Forcer pour rester disponible",
          detail:
            "Tu veux jouer coûte que coûte. Ça plaît au coach, mais ton corps prend un risque.",
          social:
            "Le joueur veut rester disponible malgré une alerte physique.",
          effects: {
            fatigue: 8,
            form: -3,
            coachTrust: 2,
            morale: -1,
          },
        },
      ],
    };
  }

  if (rating < 6.2) {
    return {
      id:
        "player-decision-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),
      type: "Coach",
      tone: "danger",
      socialAuthor: "@InsideClub",
      title: "Le coach attend une réaction",
      body:
        `Ton match contre ${opponent} n’a pas convaincu. Le staff veut savoir comment tu comptes répondre.`,
      choices: [
        {
          label: "Demander une séance vidéo",
          detail:
            "Tu veux comprendre ce qui n’a pas marché et montrer que tu prends ça au sérieux.",
          social:
            "Le joueur demande à analyser son match avec le staff.",
          effects: {
            coachTrust: 3,
            morale: 1,
            form: 1,
            mediaPressure: -1,
          },
        },
        {
          label: "Rester silencieux",
          detail:
            "Tu préfères ne rien dire et répondre seulement au prochain match.",
          social:
            "Le joueur reste discret après une prestation compliquée.",
          effects: {
            morale: -1,
            mediaPressure: 1,
          },
        },
      ],
    };
  }

  if (rating >= 8.3 && resultDelta >= 0) {
    return {
      id:
        "player-decision-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),
      type: "Agent",
      tone: "agent",
      socialAuthor: "@MercatoLive",
      title: "Ton agent t’appelle après ta grosse performance",
      body:
        `Après ton match contre ${opponent}, ton agent sent que ton nom peut commencer à circuler. Rien d’officiel, mais ce genre de performance compte.`,
      choices: [
        {
          label: "Lui demander de rester discret",
          detail:
            "Tu veux éviter de créer des tensions avec ton club actuel.",
          social:
            "Le joueur garde la tête froide malgré une performance remarquée.",
          effects: {
            agentTrust: 2,
            coachTrust: 2,
            transferDesire: -1,
            mediaPressure: -1,
          },
        },
        {
          label: "Lui demander de sonder le marché",
          detail:
            "Tu veux savoir si des clubs te suivent vraiment.",
          social:
            "L’agent commence à prendre la température autour du joueur.",
          effects: {
            agentTrust: 4,
            transferDesire: 4,
            mediaPressure: 3,
            reputation: 1,
          },
        },
      ],
    };
  }

  if (
    ["derby", "finale", "selection", "important"].includes(form.importance) &&
    resultDelta > 0 &&
    (decisive || rating >= 7.5)
  ) {
    return {
      id:
        "player-decision-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),
      type: "Médias",
      tone: "positive",
      socialAuthor: "@PlayerBuzz",
      title: "La presse veut ta réaction",
      body:
        `Tu as répondu présent dans un match important contre ${opponent}. Les médias veulent savoir si c’est un tournant dans ta saison.`,
      choices: [
        {
          label: "Rester humble",
          detail:
            "Tu rappelles que le collectif passe avant ta performance individuelle.",
          social:
            "Réaction sobre et mature après une grosse performance.",
          effects: {
            coachTrust: 2,
            supporters: 2,
            mediaPressure: -1,
            reputation: 1,
          },
        },
        {
          label: "Assumer ton ambition",
          detail:
            "Tu expliques que tu veux peser dans les grands matchs.",
          social:
            "Le joueur affiche ses ambitions après un match important.",
          effects: {
            popularity: 4,
            reputation: 2,
            mediaPressure: 3,
            transferDesire: 1,
          },
        },
      ],
    };
  }

  return null;
}
export default function PlayerMatchReport({
  playerCareer,
  onSave = () => {},
  onCancel = () => {},
}) {
  const career = normalizePlayerCareer(playerCareer);

  const [form, setForm] = useState({
    competition: "Championnat",
    opponent: "",
    result: "win",
    teamGoals: 2,
    opponentGoals: 1,
    minutes: 90,
    rating: 7.2,
    goals: 0,
    assists: 0,
    yellowCard: false,
    redCard: false,
    injury: false,
    importance: "normal",
    note: "",
    careerMomentType: "none",
    careerMoment: "",
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    const rating = toNumber(form.rating, 6.8);
    const goals = toNumber(form.goals, 0);
    const assists = toNumber(form.assists, 0);
    const minutes = toNumber(form.minutes, 90);
    const teamGoals = toNumber(form.teamGoals, 0);
    const opponentGoals = toNumber(form.opponentGoals, 0);

    const oldMatches = toNumber(career.stats.matches, 0);
    const oldAverage = toNumber(career.stats.averageRating, 6.8);

    const importanceMultiplier =
      form.importance === "finale"
        ? 1.8
        : form.importance === "derby"
        ? 1.5
        : form.importance === "selection"
        ? 1.6
        : form.importance === "important"
        ? 1.35
        : 1;

    const resultDelta =
      form.result === "win" ? 1 : form.result === "draw" ? 0 : -1;

    const performanceDelta = rating >= 7.5 ? 1 : rating < 6.2 ? -1 : 0;

    const moraleDelta = Math.round(
      (resultDelta * 4 + performanceDelta * 4) * importanceMultiplier
    );

    const coachDelta = Math.round(
      (rating >= 7.2 ? 4 : rating < 6.2 ? -5 : 1) * importanceMultiplier
    );

    const popularityDelta = Math.round(
      (goals * 4 + assists * 2 + (rating >= 8 ? 5 : 0)) *
        importanceMultiplier
    );

    const mediaDelta = Math.round(
      (form.importance === "normal" ? 1 : 4) +
        (rating < 6.2 ? 5 : 0) +
        (goals > 0 ? 2 : 0) +
        (form.redCard ? 7 : 0)
    );

    const nextAverage = Number(
      ((oldAverage * oldMatches + rating) / Math.max(1, oldMatches + 1)).toFixed(
        1
      )
    );

    const nextCareer = normalizePlayerCareer({
      ...career,
      needsMatchReport: false,

      state: {
        ...career.state,
        form: clamp(career.state.form + (rating >= 7 ? 4 : -2)),
        morale: clamp(career.state.morale + moraleDelta),
        fatigue: clamp(career.state.fatigue + Math.round(minutes / 10)),
        coachTrust: clamp(career.state.coachTrust + coachDelta),
        supporters: clamp(
          career.state.supporters + goals * 4 + assists * 2 + resultDelta * 2
        ),
        popularity: clamp(career.state.popularity + popularityDelta),
        reputation: clamp(
          career.state.reputation + (rating >= 7.5 ? 3 : rating < 6 ? -2 : 1)
        ),
        mediaPressure: clamp(career.state.mediaPressure + mediaDelta),
      },

      stats: {
        ...career.stats,
        matches: oldMatches + 1,
        goals: toNumber(career.stats.goals, 0) + goals,
        assists: toNumber(career.stats.assists, 0) + assists,
        averageRating: nextAverage,
      },

      world: {
        ...career.world,

        timeline: [
          createTimelineEvent(
            "Match FC26 saisi",
            `${form.competition} vs ${
              form.opponent || "adversaire"
            } : ${teamGoals}-${opponentGoals}. Note ${rating}, ${goals} but(s), ${assists} passe(s). ${
              form.note || ""
            }`
          ),
          ...(career.world.timeline || []),
        ].slice(0, 24),

        news: [
          {
            id: "match-news-" + Date.now(),
            type: "Après-match",
            title:
              rating >= 8
                ? "Grosse performance remarquée"
                : rating < 6.2
                ? "Match compliqué à digérer"
                : "Performance enregistrée",
            body:
              rating >= 8
                ? "Ta prestation fait parler. Les supporters, le coach et les médias commencent à regarder ton niveau autrement."
                : rating < 6.2
                ? "Le match laisse des traces. Le staff attend une réaction rapide."
                : "Le match est enregistré. Les conséquences sont appliquées à ta carrière.",
          },
          ...(career.world.news || []),
        ].slice(0, 20),
      },
    });

    const careerMomentText = String(form.careerMoment || "").trim();

    if (careerMomentText) {
      const momentLabels = {
        none: "Fait marquant",
        coach: "Discussion avec le coach",
        agent: "Contact avec l’agent",
        media: "Moment médiatique",
        transfer: "Signal mercato",
        selection: "Sélection nationale",
        training: "Entraînement important",
        injury: "Alerte physique",
        personal: "Vie personnelle",
      };

      const momentLabel =
        momentLabels[form.careerMomentType] || "Fait marquant";

      nextCareer.world.timeline = [
        createTimelineEvent(momentLabel, careerMomentText),
        ...(nextCareer.world.timeline || []),
      ].slice(0, 24);

      nextCareer.world.news = [
        {
          id: "career-moment-news-" + Date.now(),
          type: "Carrière joueur",
          title: momentLabel,
          body: careerMomentText,
        },
        ...(nextCareer.world.news || []),
      ].slice(0, 20);

      if (form.careerMomentType === "coach") {
        nextCareer.state.coachTrust = clamp(nextCareer.state.coachTrust + 3);
        nextCareer.state.morale = clamp(nextCareer.state.morale + 1);
      }

      if (form.careerMomentType === "agent") {
        nextCareer.state.agentTrust = clamp(nextCareer.state.agentTrust + 4);
        nextCareer.state.transferDesire = clamp(
          nextCareer.state.transferDesire + 2
        );
      }

      if (form.careerMomentType === "media") {
        nextCareer.state.popularity = clamp(nextCareer.state.popularity + 3);
        nextCareer.state.mediaPressure = clamp(
          nextCareer.state.mediaPressure + 4
        );
      }

      if (form.careerMomentType === "transfer") {
        nextCareer.state.transferDesire = clamp(
          nextCareer.state.transferDesire + 5
        );
        nextCareer.state.mediaPressure = clamp(
          nextCareer.state.mediaPressure + 3
        );
      }

      if (form.careerMomentType === "selection") {
        nextCareer.state.reputation = clamp(nextCareer.state.reputation + 4);
        nextCareer.state.popularity = clamp(nextCareer.state.popularity + 3);
        nextCareer.state.morale = clamp(nextCareer.state.morale + 3);
      }

      if (form.careerMomentType === "training") {
        nextCareer.state.form = clamp(nextCareer.state.form + 4);
        nextCareer.state.coachTrust = clamp(nextCareer.state.coachTrust + 2);
        nextCareer.state.fatigue = clamp(nextCareer.state.fatigue + 4);
      }

      if (form.careerMomentType === "injury") {
        nextCareer.state.fatigue = clamp(nextCareer.state.fatigue + 8);
        nextCareer.state.form = clamp(nextCareer.state.form - 3);
        nextCareer.state.morale = clamp(nextCareer.state.morale - 2);
      }

      if (form.careerMomentType === "personal") {
        nextCareer.state.morale = clamp(nextCareer.state.morale + 2);
        nextCareer.state.mediaPressure = clamp(
          nextCareer.state.mediaPressure - 1
        );
      }
    }

    if (form.redCard) {
      nextCareer.state.coachTrust = clamp(nextCareer.state.coachTrust - 6);
      nextCareer.state.mediaPressure = clamp(
        nextCareer.state.mediaPressure + 6
      );
    }

    if (form.injury) {
      nextCareer.state.fatigue = clamp(nextCareer.state.fatigue + 15);
      nextCareer.state.form = clamp(nextCareer.state.form - 6);
      nextCareer.state.morale = clamp(nextCareer.state.morale - 4);
    }

    const pendingDecision = createPostMatchDecision({
      form,
      rating,
      goals,
      assists,
      resultDelta,
    });

    if (pendingDecision) {
      nextCareer.pendingDecision = pendingDecision;
    }
    onSave(nextCareer);
  }

  return (
    <section className="panel">
      <p
        style={{
          color: "#22d3ee",
          fontWeight: 1000,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Match FC26
      </p>

      <h2 style={{ fontSize: 32, margin: "6px 0" }}>
        Saisir le dernier match
      </h2>

      <p className="muted" style={{ maxWidth: 900 }}>
        Joue ton match dans FC26, puis saisis ici le vrai score, ta note, tes
        statistiques et les faits importants de ta carrière.
      </p>

      <form onSubmit={submit} style={{ marginTop: 18 }}>
        <div className="grid-4">
          <Field label="Compétition">
            <select
              value={form.competition}
              onChange={(event) => update("competition", event.target.value)}
              style={inputStyle()}
            >
              <option>Championnat</option>
              <option>Coupe nationale</option>
              <option>Europe</option>
              <option>Sélection nationale</option>
              <option>Amical</option>
            </select>
          </Field>

          <Field label="Adversaire">
            <input
              value={form.opponent}
              onChange={(event) => update("opponent", event.target.value)}
              placeholder="PSG, OM, Arsenal..."
              style={inputStyle()}
            />
          </Field>

          <Field label="Résultat">
            <select
              value={form.result}
              onChange={(event) => update("result", event.target.value)}
              style={inputStyle()}
            >
              <option value="win">Victoire</option>
              <option value="draw">Nul</option>
              <option value="loss">Défaite</option>
            </select>
          </Field>

          <Field label="Importance">
            <select
              value={form.importance}
              onChange={(event) => update("importance", event.target.value)}
              style={inputStyle()}
            >
              <option value="normal">Normal</option>
              <option value="important">Match important</option>
              <option value="derby">Derby</option>
              <option value="finale">Finale</option>
              <option value="selection">Sélection nationale</option>
            </select>
          </Field>
        </div>

        <div className="grid-4" style={{ marginTop: 14 }}>
          <Field label="Buts équipe">
            <input
              type="number"
              value={form.teamGoals}
              onChange={(event) => update("teamGoals", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Buts adversaire">
            <input
              type="number"
              value={form.opponentGoals}
              onChange={(event) => update("opponentGoals", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Minutes jouées">
            <input
              type="number"
              value={form.minutes}
              onChange={(event) => update("minutes", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Note joueur">
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              value={form.rating}
              onChange={(event) => update("rating", event.target.value)}
              style={inputStyle()}
            />
          </Field>
        </div>

        <div className="grid-4" style={{ marginTop: 14 }}>
          <Field label="Buts joueur">
            <input
              type="number"
              value={form.goals}
              onChange={(event) => update("goals", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Passes joueur">
            <input
              type="number"
              value={form.assists}
              onChange={(event) => update("assists", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Carton">
            <select
              value={form.redCard ? "red" : form.yellowCard ? "yellow" : "none"}
              onChange={(event) => {
                update("yellowCard", event.target.value === "yellow");
                update("redCard", event.target.value === "red");
              }}
              style={inputStyle()}
            >
              <option value="none">Aucun</option>
              <option value="yellow">Jaune</option>
              <option value="red">Rouge</option>
            </select>
          </Field>

          <Field label="Blessure">
            <select
              value={form.injury ? "yes" : "no"}
              onChange={(event) =>
                update("injury", event.target.value === "yes")
              }
              style={inputStyle()}
            >
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field label="Note personnelle">
            <textarea
              value={form.note}
              onChange={(event) => update("note", event.target.value)}
              placeholder="Ex : but décisif, entrée moyenne, retour de blessure..."
              style={{
                ...inputStyle(),
                minHeight: 90,
                resize: "vertical",
              }}
            />
          </Field>
        </div>

        <div className="grid-2" style={{ marginTop: 14 }}>
          <Field label="Fait marquant carrière">
            <select
              value={form.careerMomentType}
              onChange={(event) =>
                update("careerMomentType", event.target.value)
              }
              style={inputStyle()}
            >
              <option value="none">Aucun</option>
              <option value="coach">Discussion coach</option>
              <option value="agent">Agent</option>
              <option value="media">Médias</option>
              <option value="transfer">Mercato</option>
              <option value="selection">Sélection nationale</option>
              <option value="training">Entraînement</option>
              <option value="injury">Alerte physique</option>
              <option value="personal">Vie personnelle</option>
            </select>
          </Field>

          <Field label="Description du fait marquant">
            <textarea
              value={form.careerMoment}
              onChange={(event) => update("careerMoment", event.target.value)}
              placeholder="Ex : le coach m’a annoncé que je serai remplaçant, mon agent m’a parlé d’un club, j’ai reçu une convocation..."
              style={{
                ...inputStyle(),
                minHeight: 90,
                resize: "vertical",
              }}
            />
          </Field>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 18,
          }}
        >
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Annuler
          </button>

          <button type="submit" className="primary-btn">
            Valider le match FC26
          </button>
        </div>
      </form>
    </section>
  );
}

