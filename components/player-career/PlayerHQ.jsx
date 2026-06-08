"use client";

import { useState } from "react";

import {
  createTimelineEvent,
  normalizePlayerCareer,
} from "./playerCareerDefaults";

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function StatCard({ label, value, accent = "#22d3ee" }) {
  return (
    <div className="card">
      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: 12,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </p>

      <h3 style={{ margin: "8px 0 0", fontSize: 28, color: accent }}>
        {value}
      </h3>
    </div>
  );
}

function Gauge({ label, value, color = "#22d3ee" }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

  return (
    <div className="card" style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
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

        <b>{safeValue}/100</b>
      </div>

      <div
        style={{
          height: 9,
          borderRadius: 999,
          background: "rgba(255,255,255,.10)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: safeValue + "%",
            height: "100%",
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function ImageBubble({ src, fallback, size = 92, radius = 26 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={fallback}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,.18)",
          background: "rgba(2,6,23,.65)",
          boxShadow: "0 18px 50px rgba(0,0,0,.32)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        display: "grid",
        placeItems: "center",
        border: "1px solid rgba(255,255,255,.18)",
        background:
          "linear-gradient(135deg, rgba(34,211,238,.26), rgba(167,139,250,.20))",
        color: "white",
        fontWeight: 1000,
        fontSize: Math.max(18, size / 3),
        boxShadow: "0 18px 50px rgba(0,0,0,.32)",
      }}
    >
      {fallback}
    </div>
  );
}

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

export default function PlayerHQ({ playerCareer, onUpdate = () => {} }) {
  const career = normalizePlayerCareer(playerCareer);
  const identity = career.identity;
  const state = career.state;
  const stats = career.stats;
  const world = career.world;

  const fullName = `${identity.firstName || "Mon"} ${
    identity.lastName || "Pro"
  }`.trim();

  const initials =
    `${identity.firstName || "P"}`.slice(0, 1).toUpperCase() +
    `${identity.lastName || "C"}`.slice(0, 1).toUpperCase();

  const clubInitials =
    String(identity.club || "FC")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.slice(0, 1))
      .join("")
      .slice(0, 3)
      .toUpperCase() || "FC";

  const primary = identity.primaryColor || "#22d3ee";
  const secondary = identity.secondaryColor || "#a78bfa";

  const [editing, setEditing] = useState(false);
  const [visuals, setVisuals] = useState({
    avatarUrl: identity.avatarUrl || "",
    clubLogoUrl: identity.clubLogoUrl || "",
    clubCity: identity.clubCity || "",
    stadiumName: identity.stadiumName || "",
    stadiumImageUrl: identity.stadiumImageUrl || "",
    primaryColor: primary,
    secondaryColor: secondary,
  });

  function updateVisual(field, value) {
    setVisuals((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveVisuals() {
    const nextCareer = normalizePlayerCareer({
      ...career,
      identity: {
        ...career.identity,
        avatarUrl: visuals.avatarUrl,
        clubLogoUrl: visuals.clubLogoUrl,
        clubCity: visuals.clubCity,
        stadiumName: visuals.stadiumName,
        stadiumImageUrl: visuals.stadiumImageUrl,
        primaryColor: visuals.primaryColor,
        secondaryColor: visuals.secondaryColor,
      },
      world: {
        ...career.world,
        timeline: [
          createTimelineEvent(
            "Identité visuelle mise à jour",
            "Photo joueur, logo club ou ambiance visuelle modifiés."
          ),
          ...(career.world.timeline || []),
        ].slice(0, 20),
      },
    });

    onUpdate(nextCareer);
    setEditing(false);
  }

  const heroBackground = visuals.stadiumImageUrl
    ? `linear-gradient(135deg, rgba(2,6,23,.92), rgba(2,6,23,.58)), url("${visuals.stadiumImageUrl}")`
    : `radial-gradient(circle at 15% 0%, ${primary}44, transparent 34%),
       radial-gradient(circle at 90% 20%, ${secondary}44, transparent 34%),
       linear-gradient(135deg, rgba(15,23,42,.96), rgba(15,23,42,.72))`;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        className="panel"
        style={{
          overflow: "hidden",
          position: "relative",
          background: heroBackground,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(255,255,255,.13)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 22,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <ImageBubble
              src={identity.avatarUrl}
              fallback={initials}
              size={112}
              radius={30}
            />

            <div>
              <p
                style={{
                  color: primary,
                  fontWeight: 1000,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                Player HQ
              </p>

              <h1 style={{ fontSize: 44, margin: "4px 0", lineHeight: 1 }}>
                {fullName}
              </h1>

              <p className="muted">
                {identity.club} · {identity.position} · {identity.nationality} ·{" "}
                {identity.age} ans
              </p>

              <p className="muted">
                {identity.clubCity ? identity.clubCity + " · " : ""}
                {identity.stadiumName ? identity.stadiumName + " · " : ""}
                Objectif : <b>{career.profile.careerGoal}</b>
              </p>
            </div>
          </div>

          <div
            className="card"
            style={{
              minWidth: 270,
              display: "flex",
              gap: 14,
              alignItems: "center",
              background: `linear-gradient(135deg, ${primary}28, ${secondary}22)`,
            }}
          >
            <ImageBubble
              src={identity.clubLogoUrl}
              fallback={clubInitials}
              size={70}
              radius={22}
            />

            <div>
              <h3 style={{ margin: 0 }}>{identity.club}</h3>
              <p className="muted">
                GEN <b>{career.profile.overall}</b> / POT{" "}
                <b>{career.profile.potential}</b>
              </p>
              <p className="muted">
                Niveau {career.profile.level} · {career.profile.xp} XP
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? "Fermer l’édition visuelle" : "Modifier images / club"}
          </button>
        </div>

        {editing ? (
          <div className="card" style={{ marginTop: 18 }}>
            <h3>Identité visuelle</h3>

            <div className="grid-3" style={{ marginTop: 14 }}>
              <Field label="Photo joueur URL">
                <input
                  value={visuals.avatarUrl}
                  onChange={(event) => updateVisual("avatarUrl", event.target.value)}
                  placeholder="https://..."
                  style={inputStyle()}
                />
              </Field>

              <Field label="Logo club URL">
                <input
                  value={visuals.clubLogoUrl}
                  onChange={(event) => updateVisual("clubLogoUrl", event.target.value)}
                  placeholder="https://..."
                  style={inputStyle()}
                />
              </Field>

              <Field label="Image stade / ville URL">
                <input
                  value={visuals.stadiumImageUrl}
                  onChange={(event) =>
                    updateVisual("stadiumImageUrl", event.target.value)
                  }
                  placeholder="https://..."
                  style={inputStyle()}
                />
              </Field>
            </div>

            <div className="grid-4" style={{ marginTop: 14 }}>
              <Field label="Ville">
                <input
                  value={visuals.clubCity}
                  onChange={(event) => updateVisual("clubCity", event.target.value)}
                  style={inputStyle()}
                />
              </Field>

              <Field label="Stade">
                <input
                  value={visuals.stadiumName}
                  onChange={(event) =>
                    updateVisual("stadiumName", event.target.value)
                  }
                  style={inputStyle()}
                />
              </Field>

              <Field label="Couleur principale">
                <input
                  type="color"
                  value={visuals.primaryColor}
                  onChange={(event) =>
                    updateVisual("primaryColor", event.target.value)
                  }
                  style={{ ...inputStyle(), height: 44, padding: 6 }}
                />
              </Field>

              <Field label="Couleur secondaire">
                <input
                  type="color"
                  value={visuals.secondaryColor}
                  onChange={(event) =>
                    updateVisual("secondaryColor", event.target.value)
                  }
                  style={{ ...inputStyle(), height: 44, padding: 6 }}
                />
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button type="button" className="primary-btn" onClick={saveVisuals}>
                Sauvegarder l’identité visuelle
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>État du joueur</h2>

        <div className="grid-4">
          <Gauge label="Forme" value={state.form} color={primary} />
          <Gauge label="Moral" value={state.morale} color="#bef264" />
          <Gauge label="Fatigue" value={state.fatigue} color="#fb7185" />
          <Gauge label="Pression média" value={state.mediaPressure} color="#fbbf24" />
        </div>
      </section>

      <section className="panel">
        <h2>Relations</h2>

        <div className="grid-4">
          <Gauge label="Coach" value={state.coachTrust} color={primary} />
          <Gauge label="Vestiaire" value={state.dressingRoom} color={secondary} />
          <Gauge label="Agent" value={state.agentTrust} color="#fbbf24" />
          <Gauge label="Supporters" value={state.supporters} color="#bef264" />
        </div>
      </section>

      <section className="panel">
        <h2>Réputation & carrière</h2>

        <div className="grid-4">
          <Gauge label="Réputation" value={state.reputation} color="#60a5fa" />
          <Gauge label="Popularité" value={state.popularity} color="#f472b6" />
          <Gauge label="Envie transfert" value={state.transferDesire} color="#fb7185" />
          <StatCard
            label="Followers"
            value={safeNumber(world.followers).toLocaleString("fr-FR")}
            accent="#bef264"
          />
        </div>
      </section>

      <section className="panel">
        <h2>Statistiques</h2>

        <div className="grid-4">
          <StatCard label="Matchs" value={stats.matches} accent={primary} />
          <StatCard label="Buts" value={stats.goals} accent="#bef264" />
          <StatCard label="Passes" value={stats.assists} accent={secondary} />
          <StatCard label="Note moyenne" value={stats.averageRating} accent="#fbbf24" />
        </div>
      </section>

      <section className="panel">
        <h2>Journal joueur</h2>

        {world.timeline?.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            {world.timeline.map((item) => (
              <div className="card" key={item.id} style={{ padding: 14 }}>
                <b>{item.label}</b>
                {item.detail ? <p className="muted">{item.detail}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Aucun événement enregistré.</p>
        )}
      </section>
    </div>
  );
}