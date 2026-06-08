"use client";

import { useState } from "react";

import {
  DEFAULT_PLAYER_CAREER,
  PLAYER_ARCHETYPES,
  PLAYER_CAREER_GOALS,
  PLAYER_ORIGINS,
  PLAYER_PERSONALITIES,
  PLAYER_POSITIONS,
  normalizePlayerCareer,
} from "./playerCareerDefaults";

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          color: "#94a3b8",
          fontSize: 12,
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

function inputStyle() {
  return {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(2,6,23,.68)",
    color: "white",
    padding: "12px 13px",
    outline: "none",
  };
}

function selectStyle() {
  return {
    ...inputStyle(),
    cursor: "pointer",
  };
}

export default function PlayerCreator({ career = {}, onCreate }) {
  const base = normalizePlayerCareer(career.playerCareer);

  const [form, setForm] = useState({
  firstName: base.identity.firstName,
  lastName: base.identity.lastName,
  age: base.identity.age,
  nationality: base.identity.nationality,
  club: base.identity.club,
  position: base.identity.position,
  strongFoot: base.identity.strongFoot,
  avatarUrl: base.identity.avatarUrl || "",
  clubLogoUrl: base.identity.clubLogoUrl || "",
  clubCity: base.identity.clubCity || "",
  stadiumName: base.identity.stadiumName || "",
  stadiumImageUrl: base.identity.stadiumImageUrl || "",
  primaryColor: base.identity.primaryColor || "#22d3ee",
  secondaryColor: base.identity.secondaryColor || "#a78bfa",

  overall: base.profile.overall,
  potential: base.profile.potential,
  archetype: base.profile.archetype,
  personality: base.profile.personality,
  origin: base.profile.origin,
  careerGoal: base.profile.careerGoal,
});

  function update(field, value) {
  setForm((current) => ({
    ...current,
    [field]: value,
  }));
}

  function submit(event) {
    event.preventDefault();

    const nextPlayerCareer = normalizePlayerCareer({
      ...DEFAULT_PLAYER_CAREER,
      created: true,

      identity: {
  ...DEFAULT_PLAYER_CAREER.identity,
  firstName: form.firstName,
  lastName: form.lastName,
  age: Number(form.age) || 18,
  nationality: form.nationality,
  club: form.club,
  position: form.position,
  strongFoot: form.strongFoot,
  avatarUrl: form.avatarUrl,
  clubLogoUrl: form.clubLogoUrl,
  clubCity: form.clubCity,
  stadiumName: form.stadiumName,
  stadiumImageUrl: form.stadiumImageUrl,
  primaryColor: form.primaryColor,
  secondaryColor: form.secondary
},

      profile: {
        ...DEFAULT_PLAYER_CAREER.profile,
        overall: Number(form.overall) || 68,
        potential: Number(form.potential) || 88,
        hiddenPotential: Math.max(
          Number(form.potential) || 88,
          Number(form.potential) + 3 || 91
        ),
        archetype: form.archetype,
        personality: form.personality,
        origin: form.origin,
        careerGoal: form.careerGoal,
      },

      world: {
        ...DEFAULT_PLAYER_CAREER.world,
        timeline: [
          {
            id: "player-created-" + Date.now(),
            date: new Date().toISOString(),
            label: "Création du joueur",
            detail:
              form.firstName +
              " " +
              form.lastName +
              " commence sa carrière à " +
              form.club +
              ".",
          },
        ],
      },
    });

    onCreate(nextPlayerCareer);
  }

  const selectedArchetype = PLAYER_ARCHETYPES.find(
    (item) => item.id === form.archetype
  );

  const selectedPersonality = PLAYER_PERSONALITIES.find(
    (item) => item.id === form.personality
  );

  const selectedOrigin = PLAYER_ORIGINS.find(
    (item) => item.id === form.origin
  );

  return (
    <section className="panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              color: "#22d3ee",
              fontWeight: 1000,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Player Career Universe V1
          </p>

          <h2 style={{ fontSize: 34, margin: "6px 0" }}>
            Créer mon joueur
          </h2>

          <p className="muted" style={{ maxWidth: 820 }}>
            Construis ton pro avant de commencer sa carrière RPG :
            identité, profil, personnalité, origine et objectif de légende.
          </p>
        </div>

        <div
          className="card"
          style={{
            minWidth: 220,
            background:
              "linear-gradient(135deg, rgba(34,211,238,.16), rgba(167,139,250,.12))",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Aperçu</h3>
          <p>
            <b>
              {form.firstName} {form.lastName}
            </b>
          </p>
          <p className="muted">
            {form.position} · {form.nationality}
          </p>
          <p className="muted">
            GEN {form.overall} / POT {form.potential}
          </p>
        </div>
      </div>

      <form onSubmit={submit} style={{ marginTop: 22 }}>
        <div className="grid-4">
          <Field label="Prénom">
            <input
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Nom">
            <input
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Âge">
            <input
              type="number"
              min="15"
              max="45"
              value={form.age}
              onChange={(event) => update("age", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Nationalité">
            <input
              value={form.nationality}
              onChange={(event) => update("nationality", event.target.value)}
              style={inputStyle()}
            />
          </Field>
        </div>

        <div className="grid-4" style={{ marginTop: 14 }}>
          <Field label="Club actuel">
            <input
              value={form.club}
              onChange={(event) => update("club", event.target.value)}
              style={inputStyle()}
            />
          </Field>
<Field label="Image joueur URL">
  <input
    value={form.avatarUrl}
    onChange={(event) => update("avatarUrl", event.target.value)}
    placeholder="https://..."
    style={inputStyle()}
  />
</Field>

<Field label="Logo club URL">
  <input
    value={form.clubLogoUrl}
    onChange={(event) => update("clubLogoUrl", event.target.value)}
    placeholder="https://..."
    style={inputStyle()}
  />
</Field>
<div className="grid-4" style={{ marginTop: 14 }}>
  <Field label="Ville du club">
    <input
      value={form.clubCity}
      onChange={(event) => update("clubCity", event.target.value)}
      placeholder="Bordeaux, Paris, Madrid..."
      style={inputStyle()}
    />
  </Field>

  <Field label="Stade">
    <input
      value={form.stadiumName}
      onChange={(event) => update("stadiumName", event.target.value)}
      placeholder="Matmut Atlantique, Parc des Princes..."
      style={inputStyle()}
    />
  </Field>

  <Field label="Image stade / ville URL">
    <input
      value={form.stadiumImageUrl}
      onChange={(event) => update("stadiumImageUrl", event.target.value)}
      placeholder="https://..."
      style={inputStyle()}
    />
  </Field>

  <Field label="Couleur principale">
    <input
      type="color"
      value={form.primaryColor}
      onChange={(event) => update("primaryColor", event.target.value)}
      style={{
        ...inputStyle(),
        height: 46,
        padding: 6,
      }}
    />
  </Field>
</div>

<div className="grid-4" style={{ marginTop: 14 }}>
  <Field label="Couleur secondaire">
    <input
      type="color"
      value={form.secondaryColor}
      onChange={(event) => update("secondaryColor", event.target.value)}
      style={{
        ...inputStyle(),
        height: 46,
        padding: 6,
      }}
    />
  </Field>
</div>
          <Field label="Poste">
            <select
              value={form.position}
              onChange={(event) => update("position", event.target.value)}
              style={selectStyle()}
            >
              {PLAYER_POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pied fort">
            <select
              value={form.strongFoot}
              onChange={(event) => update("strongFoot", event.target.value)}
              style={selectStyle()}
            >
              <option value="Droit">Droit</option>
              <option value="Gauche">Gauche</option>
            </select>
          </Field>

          <Field label="Objectif">
            <select
              value={form.careerGoal}
              onChange={(event) => update("careerGoal", event.target.value)}
              style={selectStyle()}
            >
              {PLAYER_CAREER_GOALS.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid-4" style={{ marginTop: 14 }}>
          <Field label="GEN initial">
            <input
              type="number"
              min="40"
              max="99"
              value={form.overall}
              onChange={(event) => update("overall", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="POT">
            <input
              type="number"
              min="40"
              max="99"
              value={form.potential}
              onChange={(event) => update("potential", event.target.value)}
              style={inputStyle()}
            />
          </Field>

          <Field label="Archétype">
            <select
              value={form.archetype}
              onChange={(event) => update("archetype", event.target.value)}
              style={selectStyle()}
            >
              {PLAYER_ARCHETYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Personnalité">
            <select
              value={form.personality}
              onChange={(event) => update("personality", event.target.value)}
              style={selectStyle()}
            >
              {PLAYER_PERSONALITIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid-3" style={{ marginTop: 14 }}>
          <Field label="Origine du joueur">
            <select
              value={form.origin}
              onChange={(event) => update("origin", event.target.value)}
              style={selectStyle()}
            >
              {PLAYER_ORIGINS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="card">
            <h3>Archétype</h3>
            <p className="muted">
              {selectedArchetype?.description || "Aucun archétype sélectionné."}
            </p>
          </div>

          <div className="card">
            <h3>Personnalité</h3>
            <p className="muted">
              {selectedPersonality?.description ||
                "Aucune personnalité sélectionnée."}
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h3>Origine</h3>
          <p className="muted">
            {selectedOrigin?.description || "Aucune origine sélectionnée."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 18,
          }}
        >
          <button
            type="submit"
            className="choice-btn"
            style={{
              maxWidth: 280,
              background:
                "linear-gradient(135deg, rgba(34,211,238,.24), rgba(190,242,100,.18))",
            }}
          >
            <b>Créer mon joueur</b>
            <span>Lancer ma carrière RPG</span>
          </button>
        </div>
      </form>
    </section>
  );
}