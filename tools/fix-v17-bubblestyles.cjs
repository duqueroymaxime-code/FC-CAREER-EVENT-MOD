const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "CareerApp.jsx");

if (!fs.existsSync(filePath)) {
  console.error("ERREUR : CareerApp.jsx introuvable à la racine.");
  console.error("Lance ce script depuis fifa-career-overhaul-mod.");
  process.exit(1);
}

let text = fs.readFileSync(filePath, "utf8");
const backupPath = `${filePath}.bak-fix-bubblestyles`;
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

const fixedBubbleStyles = `
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
    "@media(max-width:640px){.modal .primary-btn,.modal .secondary-btn{width:100%;justify-content:center}}",
    "@media(max-width:900px){.modal-grid{grid-template-columns:1fr!important}.modal{max-height:none!important;width:96vw!important}}"
  ].join("\\n");

  return <style>{css}</style>;
}
`;

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

// Remplace tout BubbleStyles jusqu’à ClubBadge.
text = replaceBetween(
  text,
  "function BubbleStyles()",
  "function ClubBadge",
  fixedBubbleStyles
);

// Remplace tout PlayerPortrait jusqu’à getLiveEditorActionPlan.
if (text.includes("function PlayerPortrait") && text.includes("function getLiveEditorActionPlan")) {
  text = replaceBetween(
    text,
    "function PlayerPortrait",
    "function getLiveEditorActionPlan",
    fixedPlayerPortrait
  );
}

// Supprime le dernier console.log REAL FIXTURES USED si encore présent.
text = text.replace(
  /\n\s*console\.log\("REAL FIXTURES USED", clubName, league, selectedOpponents\);/g,
  ""
);

// Sécurité : si BubbleStyles a été injecté plusieurs fois dans le JSX.
text = text.replace(
  /<BubbleStyles \/>\s*\n\s*<BubbleStyles \/>/g,
  "<BubbleStyles />"
);

fs.writeFileSync(filePath, text, "utf8");

console.log("Correctif BubbleStyles / PlayerPortrait appliqué.");
console.log("Sauvegarde créée :", backupPath);
console.log("Relance maintenant : npm.cmd run build");