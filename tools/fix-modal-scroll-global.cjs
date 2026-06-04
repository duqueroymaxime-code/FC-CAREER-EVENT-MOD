const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "CareerApp.jsx");

if (!fs.existsSync(filePath)) {
  console.error("ERREUR : CareerApp.jsx introuvable.");
  console.error("Lance ce script depuis fifa-career-overhaul-mod.");
  process.exit(1);
}

let text = fs.readFileSync(filePath, "utf8");
const original = text;

const backupPath = `${filePath}.bak-modal-scroll-global-fixed`;
fs.writeFileSync(backupPath, text, "utf8");

function replaceBetween(source, startMarker, endMarker, replacement) {
  const start = source.indexOf(startMarker);

  if (start === -1) {
    console.log("Début introuvable :", startMarker);
    return source;
  }

  const end = source.indexOf(endMarker, start);

  if (end === -1) {
    console.log("Fin introuvable :", endMarker);
    return source;
  }

  return source.slice(0, start) + replacement + "\n" + source.slice(end);
}

const fixedPlayerPortrait = `
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
`;

const fixedBubbleStyles = `
function BubbleStyles() {
  const css = [
    "html,body{min-height:100%;overflow-x:hidden}",
    ".primary-btn,.secondary-btn,.choice-btn,.club-card,.event-card,.big-choice,.close-btn{position:relative;overflow:hidden;transform:translateZ(0);transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}",
    ".primary-btn:hover,.secondary-btn:hover,.choice-btn:hover,.club-card:hover,.event-card:hover,.big-choice:hover,.close-btn:hover{transform:translateY(-2px) scale(1.012);box-shadow:0 18px 44px rgba(34,211,238,.16),inset 0 0 0 1px rgba(255,255,255,.08);filter:saturate(1.08)}",
    ".primary-btn::after,.secondary-btn::after,.choice-btn::after,.club-card::after,.event-card::after,.big-choice::after,.close-btn::after{content:'';position:absolute;width:18px;height:18px;left:50%;top:50%;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.38),rgba(255,255,255,0));transform:translate(-50%,-50%) scale(0);opacity:0;pointer-events:none;transition:transform .48s ease,opacity .48s ease}",
    ".primary-btn:hover::after,.secondary-btn:hover::after,.choice-btn:hover::after,.club-card:hover::after,.event-card:hover::after,.big-choice:hover::after,.close-btn:hover::after{transform:translate(-50%,-50%) scale(18);opacity:.16}",
    ".modal-backdrop{position:fixed!important;inset:0!important;z-index:9999!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow:hidden!important;padding:18px!important;background:rgba(2,6,23,.76)!important;backdrop-filter:blur(12px)!important}",
    ".modal{width:min(1180px,96vw)!important;max-height:calc(100vh - 36px)!important;overflow:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important}",
    ".modal-grid{display:grid!important;grid-template-columns:minmax(260px,410px) minmax(0,1fr)!important;gap:22px!important}",
    ".modal-left,.modal-right{min-height:0!important}",
    ".modal-right{max-height:calc(100vh - 86px)!important;overflow:auto!important;padding-right:4px!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important}",
    ".modal-actions-sticky{position:sticky!important;bottom:0!important;z-index:50!important;margin:18px -4px -4px!important;padding:16px!important;border-top:1px solid var(--border)!important;border-radius:18px!important;background:rgba(15,23,42,.96)!important;backdrop-filter:blur(18px)!important}",
    ".slide-row{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 14px}",
    ".slide-card{min-width:min(340px,82vw);scroll-snap-align:start}",
    ".modal .primary-btn,.modal .secondary-btn{min-height:44px}",
    "@media(max-width:900px){.modal{width:96vw!important;max-height:calc(100vh - 24px)!important}.modal-grid{grid-template-columns:1fr!important}.modal-right{max-height:none!important;overflow:visible!important}.modal{overflow:auto!important}}",
    "@media(max-width:640px){.modal .primary-btn,.modal .secondary-btn{width:100%;justify-content:center}.modal-backdrop{padding:10px!important}.modal{width:98vw!important;max-height:calc(100vh - 20px)!important}}"
  ].join("\\\\n");

  return <style>{css}</style>;
}
`;

// 1. Réparer PlayerPortrait si présent.
if (text.includes("function PlayerPortrait") && text.includes("function getLiveEditorActionPlan")) {
  text = replaceBetween(
    text,
    "function PlayerPortrait",
    "function getLiveEditorActionPlan",
    fixedPlayerPortrait
  );
}

// 2. Réparer BubbleStyles si présent.
if (text.includes("function BubbleStyles()") && text.includes("function ClubBadge")) {
  text = replaceBetween(
    text,
    "function BubbleStyles()",
    "function ClubBadge",
    fixedBubbleStyles
  );
}

// 3. Rendre EventModal scrollable.
text = text.replace(
  '<div className="modal" style={{ background: UI_GRADIENTS.panel }}>',
  `<div
        className="modal"
        style={{
          background: UI_GRADIENTS.panel,
          maxHeight: "calc(100vh - 36px)",
          overflow: "auto",
        }}
      >`
);

// 4. Rendre WeekSummaryModal scrollable si ancienne version.
text = text.replace(
  '<div className="modal" style={{ maxWidth: 860 }}>',
  `<div
        className="modal"
        style={{
          maxWidth: 860,
          maxHeight: "calc(100vh - 36px)",
          overflow: "auto",
        }}
      >`
);

// 5. Rendre le footer simple sticky si présent.
text = text.replace(
  'style={{ marginTop: 18, justifyContent: "flex-end" }}',
  `style={{
              marginTop: 18,
              justifyContent: "flex-end",
              gap: 12,
              flexWrap: "wrap",
              position: "sticky",
              bottom: 0,
              zIndex: 50,
              padding: "18px 0 2px",
              background:
                "linear-gradient(180deg, rgba(15,23,42,0), rgba(15,23,42,.98) 42%)",
              backdropFilter: "blur(16px)",
            }}`
);

// 6. Supprimer les doublons BubbleStyles sans regex.
while (text.includes("<BubbleStyles />\n      <BubbleStyles />")) {
  text = text.replace("<BubbleStyles />\n      <BubbleStyles />", "<BubbleStyles />");
}

while (text.includes("<BubbleStyles />\n        <BubbleStyles />")) {
  text = text.replace("<BubbleStyles />\n        <BubbleStyles />", "<BubbleStyles />");
}

if (text === original) {
  console.log("Aucune modification appliquée.");
  console.log("Le fichier ne contenait peut-être plus les motifs attendus.");
} else {
  fs.writeFileSync(filePath, text, "utf8");
  console.log("Correctif scroll modal global appliqué.");
  console.log("Sauvegarde créée :", backupPath);
  console.log("Relance : npm.cmd run build");
}