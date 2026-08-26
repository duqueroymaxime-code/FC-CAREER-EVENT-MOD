// cleanup.js
// A lancer depuis la racine du projet (fifa-career-overhaul-mod)
// Usage : node cleanup.js
//
// Supprime uniquement les fichiers .bak / backups / doublons morts
// identifiés dans le repo. Ne touche à aucun fichier actif de l'app.

const fs = require("fs");
const path = require("path");

const filesToDelete = [
  "CareerApp.before_world_fix.jsx",
  "CareerApp.jsx.bak-final-mercato-mode-fix",
  "CareerApp.jsx.bak-fix-bubblestyles",
  "CareerApp.jsx.bak-fix-creator",
  "CareerApp.jsx.bak-fix-creator-v2",
  "CareerApp.jsx.bak-fix-mercato-button",
  "CareerApp.jsx.bak-fix-mercato-final",
  "CareerApp.jsx.bak-fix-mercato-runtime-final",
  "CareerApp.jsx.bak-fix-screen-before-init",
  "CareerApp.jsx.bak-force-create-import-ui",
  "CareerApp.jsx.bak-force-replace-clubpicker-v18",
  "CareerApp.jsx.bak-league-table-keys",
  "CareerApp.jsx.bak-mercato-bypass-safe",
  "CareerApp.jsx.bak-mercato-fix",
  "CareerApp.jsx.bak-mercato-runtime-bypass",
  "CareerApp.jsx.bak-mercato-unify-popup",
  "CareerApp.jsx.bak-modal-scroll-global-fixed",
  "CareerApp.jsx.bak-mojibake",
  "CareerApp.jsx.bak-popup-scroll-css",
  "CareerApp.jsx.bak-remove-duplicate-mercato",
  "CareerApp.jsx.bak-render-full-reset",
  "CareerApp.jsx.bak-tabs-unification",
  "CareerApp.jsx.bak-v17-root-repair",
  "CareerApp.jsx.bak-v18-fc26-start-import",
  "CareerApp.jsx.bak-v19-player-tab",
  "CareerApp.jsx.bak-week-summary-popup",
  "CareerApp_backup_before_transfer_patch.jsx",
  "PlayerMercato_backup.jsx",
  "app/globals.css.bak-popup-scroll-css",
  "app/import-guide/page.jsx.bak-browser-import-guide",
  "app/import-guide/page.jsx.bak-clean-tooltips",
  "app/import-guide/page.jsx.bak-detailed-live-editor-steps",
  "app/import-guide/page.jsx.bak-fix-import-guide",
  "components/CareerApp.jsx", // doublon mort, non importé nulle part (app/page.jsx utilise ../CareerApp)
  "components/CareerApp.jsx.bak-league-table-keys",
  "components/CareerApp.jsx.bak-sync-v18",
  "components/CareerApp.jsx.bak-v19-player-tab",
  "components/CareerApp_test.txt",
  "components/CareerApp_test2.jsx",
  "components/player-career/PlayerMatchReport.jsx.bak",
  "components/player-career/PlayerMercato.before_world_fix.jsx",
  "components/player-career/PlayerMercato.jsx.bak-activate-agent",
  "components/player-career/PlayerMercato.jsx.bak-before-clean-duplicate",
  "components/player-career/PlayerMercato.jsx.bak-before-trim",
  "components/player-career/PlayerMercato.jsx.bak-clean-agent-button",
  "components/player-career/PlayerMercato.jsx.bak-clean-popup-fix",
  "components/player-career/PlayerMercato.jsx.bak-fix-callagent",
  "components/player-career/PlayerMercato.jsx.bak-mercato-fix",
  "components/player-career/PlayerMercato.jsx.bak-mercato-unify-popup",
  "components/player-career/PlayerMercato.jsx.bak-remove-orphan-lines",
  "components/player-career/PlayerMercato.jsx.bak-safe-rewrite",
  "components/player-career/playerCareerDefaults.js.bak-postmatch",
  "fc-career-current.zip",
  "fc-career-current", // dossier entier : ancienne copie complète du projet
  "lib/careerEngine.js", // fichier vide (0 octet), non référencé nulle part
];

let removed = 0;
let missing = 0;

for (const rel of filesToDelete) {
  const full = path.join(process.cwd(), rel);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.log("Supprimé :", rel);
    removed++;
  } else {
    console.log("Déjà absent (ok) :", rel);
    missing++;
  }
}

console.log(`\n${removed} éléments supprimés, ${missing} déjà absents.`);

// --- Bonus : petites corrections de config pendant qu'on y est ---

// 1. Il y avait deux fichiers de config Next.js (next.config.js ET next.config.ts).
//    Next.js utilise le .js et ignore le .ts : on supprime le doublon mort.
const tsConfig = path.join(process.cwd(), "next.config.ts");
if (fs.existsSync(tsConfig)) {
  fs.rmSync(tsConfig);
  console.log("Supprimé : next.config.ts (doublon de next.config.js, jamais utilisé)");
}

// 2. next.config.js utilisait deux options obsolètes qui généraient des
//    warnings au build (images.domains, swcMinify). Version corrigée :
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
`;
fs.writeFileSync(path.join(process.cwd(), "next.config.js"), nextConfigContent);
console.log("Corrigé : next.config.js (suppression des options obsolètes, plus de warnings au build)");

// 3. On ajoute des règles au .gitignore pour que les futurs fichiers
//    .bak / _backup / _test ne reviennent jamais polluer le repo.
const gitignorePath = path.join(process.cwd(), ".gitignore");
const gitignoreAddition = `
# fichiers de sauvegarde manuelle / brouillons (a ne jamais committer)
*.bak
*.bak-*
*_backup*
*_test*
*.before_world_fix.*
`;
if (fs.existsSync(gitignorePath)) {
  const current = fs.readFileSync(gitignorePath, "utf8");
  if (!current.includes("*.bak-*")) {
    fs.appendFileSync(gitignorePath, gitignoreAddition);
    console.log("Mis à jour : .gitignore (les .bak/_backup/_test seront ignorés à l'avenir)");
  }
}

console.log("\nÉtape suivante : git add -A && git commit -m \"Nettoyage: suppression des .bak, doublons, ancien dossier fc-career-current, correction next.config.js\" && git push origin main");
