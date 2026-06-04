const fs = require("fs");
const path = require("path");

// Ton CareerApp.jsx est à la racine du projet.
const filePath = path.join(process.cwd(), "CareerApp.jsx");

if (!fs.existsSync(filePath)) {
  console.error("ERREUR : CareerApp.jsx introuvable.");
  console.error("Tu dois lancer ce script depuis le dossier où se trouve CareerApp.jsx et package.json.");
  process.exit(1);
}

const backupPath = `${filePath}.bak-v17`;
let text = fs.readFileSync(filePath, "utf8");
const original = text;

fs.writeFileSync(backupPath, text, "utf8");

function replaceOnce(source, search, replacement) {
  if (!source.includes(search)) {
    console.log("Motif non trouvé, ignoré :", search.slice(0, 90));
    return source;
  }

  return source.replace(search, replacement);
}

// ======================================================
// 1. VERSION V17
// ======================================================

text = text.replace(
  /const STORAGE_KEY = "[^"]+";/,
  'const STORAGE_KEY = "fifa-career-overhaul-v17-live-editor-ui";'
);

text = text.replace(
  /const BUILD_LABEL = "[^"]+";/,
  'const BUILD_LABEL = "V17_LIVE_EDITOR_UI_ACTIVE";'
);

text = text.replace(
  "const FORCE_TRANSFER_OFFERS = true;",
  "const FORCE_TRANSFER_OFFERS = false;"
);

// ======================================================
// 2. ÉQUILIBRAGE
// ======================================================

// Blessures
text = text.replace(
  "target.fatigue > 75 ? 0.16 : target.fatigue > 60 ? 0.09 : 0.04;",
  "target.fatigue > 80 ? 0.13 : target.fatigue > 65 ? 0.07 : 0.025;"
);

// Mercato
text = text.replace(
  "if (!FORCE_TRANSFER_OFFERS && roll > 0.42) return null;",
  "if (!FORCE_TRANSFER_OFFERS && roll > 0.35) return null;"
);

// Conférences presse
text = text.replace(
  "Math.random() < 0.65",
  "Math.random() < 0.55"
);

// ======================================================
// 3. NETTOYAGE CONSOLE.LOG
// ======================================================

text = text.replace(
  /\n\s*console\.log\("TRY TRANSFER OFFER", \{[\s\S]*?\n\s*\}\);/g,
  ""
);

text = text.replace(
  /\n\s*console\.log\("TRANSFER OFFER CREATED", \{[\s\S]*?\n\s*\}\);/g,
  ""
);

text = text.replace(
  /\n\s*console\.log\("REAL FIXTURES USED",[^;]*;/g,
  ""
);

text = text.replace(
  /\n\s*console\.log\("MERCATO VIEW ACTIVE",[^;]*;/g,
  ""
);

// ======================================================
// 4. HELPERS UI : PORTRAITS, LIVE EDITOR, BUBBLES
// ======================================================

const helpers = `
function getInitials(name = "?") {
  return String(name || "?")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarGradient(seed = "career") {
  const source = String(seed || "career");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = source.charCodeAt(index) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return (
    "linear-gradient(135deg, hsl(" +
    hue +
    ", 82%, 52%), hsl(" +
    ((hue + 55) % 360) +
    ", 82%, 44%))"
  );
}

function PlayerPortrait({ player, size = 54 }) {
  const name = player?.name || "Joueur";
  const portraitUrl = player?.portraitUrl;

  if (portraitUrl) {
    return (
      <img
        src={portraitUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: 18,
          objectFit: "cover",
          border: "1px solid var(--border)",
          boxShadow: "0 16px 40px rgba(0,0,0,.26)",
        }}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        display: "grid",
        placeItems: "center",
        background: getAvatarGradient(player?.avatarSeed || name),
        color: "white",
        fontWeight: 1000,
        border: "1px solid rgba(255,255,255,.18)",
        boxShadow: "0 16px 40px rgba(0,0,0,.26)",
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function getLiveEditorActionPlan(event, choice = null) {
  const playerName =
    event?.playerContext?.name || event?.player || "joueur concerné";

  const category = event?.category || "Général";

  const actions = Array.isArray(event?.liveEditorEffects)
    ? event.liveEditorEffects
    : [];

  return [
    "Ouvrir FC Live Editor en mode carrière hors ligne.",
    "Chercher " +
      playerName +
      " dans Players Editor si l’événement concerne un joueur.",
    ...actions.map((action) => "Appliquer : " + action + "."),
    choice
      ? "Noter la décision narrative : " + choice + "."
      : "Choisir une décision dans FC Career Hub.",
    "Vérifier que la conséquence " +
      category +
      " est cohérente dans ta sauvegarde FC26.",
    "Sauvegarder dans FC26, puis revenir dans FC Career Hub.",
  ];
}

function BubbleStyles() {
  const css = [
    ".primary-btn,.secondary-btn,.choice-btn,.club-card,.event-card,.big-choice,.close-btn{position:relative;overflow:hidden;transform:translateZ(0);transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}",
    ".primary-btn:hover,.secondary-btn:hover,.choice-btn:hover,.club-card:hover,.event-card:hover,.big-choice:hover,.close-btn:hover{transform:translateY(-2px) scale(1.012);box-shadow:0 18px 44px rgba(34,211,238,.16),inset 0 0 0 1px rgba(255,255,255,.08);filter:saturate(1.08)}",
    ".primary-btn::after,.secondary-btn::after,.choice-btn::after,.club-card::after,.event-card::after,.big-choice::after,.close-btn::after{content:'';position:absolute;width:18px;height:18px;left:50%;top:50%;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.38),rgba(255,255,255,0));transform:translate(-50%,-50%) scale(0);opacity:0;pointer-events:none;transition:transform .48s ease,opacity .48s ease}",
    ".primary-btn:hover::after,.secondary-btn:hover::after,.choice-btn:hover::after,.club-card:hover::after,.event-card:hover::after,.big-choice:hover::after,.close-btn:hover::after{transform:translate(-50%,-50%) scale(18);opacity:.16}",
    ".modal-backdrop{overflow-y:auto!important;padding:18px!important;align-items:flex-start!important}",
    ".modal{width:min(1180px,96vw)!important;max-height:92vh!important;overflow-y:auto!important}",
    ".modal-grid{grid-template-columns:minmax(260px,410px) minmax(0,1fr)!important}",
    ".modal-actions-sticky{position:sticky;bottom:0;z-index:5;margin:18px -4px -4px;padding:16px;border-top:1px solid var(--border);border-radius:18px;background:rgba(15,23,42,.92);backdrop-filter:blur(18px)}",
    ".slide-row{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 14px}",
    ".slide-card{min-width:min(340px,82vw);scroll-snap-align:start}",
    "@media(max-width:900px){.modal-grid{grid-template-columns:1fr!important}.modal{max-height:none!important;width:96vw!important}}",
  ].join("\\n");

  return <style>{css}</style>;
}
`;

if (!text.includes("function PlayerPortrait")) {
  text = text.replace(
    "function ClubBadge({ club, size = \"\" }) {",
    helpers + "\nfunction ClubBadge({ club, size = \"\" }) {"
  );
}

// ======================================================
// 5. INJECTION BUBBLESTYLES DANS LES WRAPPERS APP
// ======================================================

text = text.replaceAll(
  '<div className={`app ${themeClass}`}>',
  '<div className={`app ${themeClass}`}>\n      <BubbleStyles />'
);

// ======================================================
// 6. NAVIGATION SCROLLABLE
// ======================================================

text = replaceOnce(
  text,
  '<nav className="nav">',
  '<nav className="nav" style={{ maxHeight: "48vh", overflowY: "auto", paddingRight: 4 }}>'
);

// ======================================================
// 7. FICHE FC LIVE EDITOR DANS EVENTMODAL
// ======================================================

if (!text.includes("Actions recommandées")) {
  text = replaceOnce(
    text,
    '{event.status === "resolved" ? (\n              <div className="card" style={{ marginTop: 14 }}>',
    `<div className="card" style={{ marginTop: 14 }}>
              <Kicker tone="cyan">FC Live Editor</Kicker>
              <h3>Actions recommandées</h3>
              <ol
                className="muted"
                style={{ display: "grid", gap: 6, paddingLeft: 20 }}
              >
                {getLiveEditorActionPlan(event).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </div>
            {event.status === "resolved" ? (
              <div className="card" style={{ marginTop: 14 }}>`
  );
}

// ======================================================
// 8. ZONE DE DÉCISION STICKY
// ======================================================

text = replaceOnce(
  text,
  '<div className="card" style={{ marginTop: 14 }}>\n                <h3>Décision narrative</h3>',
  '<div className="card modal-actions-sticky">\n                <h3>Décision narrative</h3>'
);

// ======================================================
// 9. IMAGE MINI DANS LES CARTES ÉVÉNEMENTS
// ======================================================

if (
  !text.includes(
    'alt={event.title} style={{ width: "100%", borderRadius: 18, marginBottom: 12 }}'
  )
) {
  text = replaceOnce(
    text,
    '<div className="event-body">\n                  <div',
    `<div className="event-body">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      style={{
                        width: "100%",
                        borderRadius: 18,
                        marginBottom: 12,
                      }}
                    />
                  ) : null}
                  <div`
  );
}

// ======================================================
// 10. PORTRAIT DANS SQUADVIEW
// ======================================================

text = replaceOnce(
  text,
  `<div
              className="club-row"
              style={{ justifyContent: "space-between" }}
            >
              <h3>{player.name}</h3>
              <Kicker>{player.position}</Kicker>
            </div>`,
  `<div
              className="club-row"
              style={{ justifyContent: "space-between" }}
            >
              <div className="club-row" style={{ gap: 12 }}>
                <PlayerPortrait player={player} size={52} />
                <div>
                  <h3>{player.name}</h3>
                  <p className="muted">{player.age} ans</p>
                </div>
              </div>
              <Kicker>{player.position}</Kicker>
            </div>`
);

text = replaceOnce(
  text,
  '<p className="muted">{player.age} ans</p>\n            {player.injury',
  '{player.injury'
);

// ======================================================
// 11. DONNÉES PORTRAIT DANS LES JOUEURS
// ======================================================

text = text.replace(
  "club: clubName,\n  };\n  return withContract(",
  "club: clubName,\n    portraitUrl: overrides.portraitUrl || null,\n    avatarSeed: overrides.avatarSeed || overrides.name || clubName,\n  };\n  return withContract("
);

text = text.replace(
  "club: clubName,\n    injury: null,",
  "club: clubName,\n    portraitUrl: null,\n    avatarSeed: name,\n    injury: null,"
);

text = text.replace(
  "club: clubName,\n      signedWeek: 1,",
  "club: clubName,\n      portraitUrl: player.portraitUrl || null,\n      avatarSeed: player.avatarSeed || player.name,\n      signedWeek: 1,"
);

text = text.replace(
  "transferListed: false,\n        ...player,",
  "transferListed: false,\n        portraitUrl: null,\n        avatarSeed: player?.name || club.name,\n        ...player,"
);

// ======================================================
// 12. SÉCURITÉ PENDING EVENTS
// ======================================================

text = text.replace(
  '() => career.events.filter((event) => event.status === "unread").length,',
  '() => (career.events || []).filter((event) => event.status === "unread").length,'
);

// ======================================================
// 13. ÉCRITURE FINALE
// ======================================================

if (text === original) {
  console.log("Aucune modification appliquée.");
  console.log("Le fichier ne correspond peut-être pas aux motifs attendus.");
} else {
  fs.writeFileSync(filePath, text, "utf8");
  console.log("Patch V17 basic appliqué avec succès.");
  console.log("Fichier modifié :", filePath);
  console.log("Sauvegarde créée :", backupPath);
  console.log("Prochaine étape : npm.cmd run build");
}