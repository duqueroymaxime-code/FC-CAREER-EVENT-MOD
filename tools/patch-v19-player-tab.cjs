const fs = require("fs");
const path = require("path");

const root = process.cwd();

const files = [
  {
    file: path.join(root, "CareerApp.jsx"),
    importLine: 'import PlayerCareerProView from "./components/PlayerCareerProView";',
  },
  {
    file: path.join(root, "components", "CareerApp.jsx"),
    importLine: 'import PlayerCareerProView from "./PlayerCareerProView";',
  },
  {
    file: path.join(root, "fc-career-current", "CareerApp.jsx"),
    importLine: 'import PlayerCareerProView from "../components/PlayerCareerProView";',
  },
].filter((item) => fs.existsSync(item.file));

for (const item of files) {
  let text = fs.readFileSync(item.file, "utf8");
  const original = text;

  fs.writeFileSync(item.file + ".bak-v19-player-tab", text, "utf8");

  text = text.replace(
    /const STORAGE_KEY = "[^"]+";/,
    'const STORAGE_KEY = "fifa-career-overhaul-v19-player-mode-pro";'
  );

  text = text.replace(
    /const BUILD_LABEL = "[^"]+";/,
    'const BUILD_LABEL = "V19_PLAYER_MODE_PRO_ACTIVE";'
  );

  if (!text.includes("PlayerCareerProView")) {
    if (text.startsWith('"use client";')) {
      text = text.replace('"use client";', '"use client";\n\n' + item.importLine);
    } else {
      text = item.importLine + "\n" + text;
    }
  }

  if (!text.includes('["player-pro", "Mode Joueur Pro"]')) {
    text = text.replace(
      '["fc26", "Import FC26"],',
      '["fc26", "Import FC26"],\n      ["player-pro", "Mode Joueur Pro"],'
    );
  }

  if (!text.includes('case "player-pro"')) {
    text = text.replace(
      'case "fc26":\n        return (\n          <FC26ImportView',
      `case "player-pro":
        return (
          <PlayerCareerProView
            career={career}
            onApply={(patch) =>
              setCareers((list) =>
                list.map((item) =>
                  item.id === career.id
                    ? normalizeCareer({
                        ...item,
                        playerCareer: {
                          ...(item.playerCareer || {}),
                          ...(patch.playerCareer || {}),
                        },
                      })
                    : item,
                ),
              )
            }
          />
        );

      case "fc26":
        return (
          <FC26ImportView`
    );
  }

  if (text !== original) {
    fs.writeFileSync(item.file, text, "utf8");
    console.log("Patch V19 appliqué :", item.file);
  } else {
    console.log("Aucun changement :", item.file);
  }
}

console.log("Terminé. Lance : rmdir /s /q .next puis npm.cmd run build");