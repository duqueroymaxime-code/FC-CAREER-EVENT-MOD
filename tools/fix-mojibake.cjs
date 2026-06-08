const fs = require("fs");
const path = require("path");

const root = process.cwd();

const allowedExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".html",
  ".json",
]);

const ignoredDirs = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "dist",
]);

const replacements = [
  ["ï»¿", ""],

  ["Ã©", "é"],
  ["Ã¨", "è"],
  ["Ãª", "ê"],
  ["Ã«", "ë"],
  ["Ã ", "à"],
  ["Ã¢", "â"],
  ["Ã¤", "ä"],
  ["Ã¹", "ù"],
  ["Ã»", "û"],
  ["Ã¼", "ü"],
  ["Ã´", "ô"],
  ["Ã¶", "ö"],
  ["Ã®", "î"],
  ["Ã¯", "ï"],
  ["Ã§", "ç"],

  ["Ã‰", "É"],
  ["Ãˆ", "È"],
  ["ÃŠ", "Ê"],
  ["Ã€", "À"],
  ["Ã‡", "Ç"],

  ["Â·", "·"],
  ["Â«", "«"],
  ["Â»", "»"],
  ["Â ", " "],

  ["â‚¬", "€"],
  ["â†", "←"],
  ["â†’", "→"],
  ["â€“", "–"],
  ["â€”", "—"],
  ["â€¦", "…"],
  ["â€™", "’"],
  ["â€˜", "‘"],
  ["â€œ", "“"],
  ["â€ ", "”"],
  ["âœ…", "✅"],
  ["âŒ", "❌"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
      continue;
    }

    const filePath = path.join(dir, entry.name);
    const ext = path.extname(filePath);

    if (allowedExtensions.has(ext)) {
      files.push(filePath);
    }
  }

  return files;
}

let changedCount = 0;

for (const filePath of walk(root)) {
  let text = fs.readFileSync(filePath, "utf8");
  const original = text;

  for (const [bad, good] of replacements) {
    text = text.split(bad).join(good);
  }

  if (text !== original) {
    fs.writeFileSync(filePath + ".bak-mojibake", original, "utf8");
    fs.writeFileSync(filePath, text, "utf8");
    changedCount += 1;
    console.log("Corrigé :", path.relative(root, filePath));
  }
}

console.log("");
console.log("Correction terminée.");
console.log("Fichiers modifiés :", changedCount);
console.log("Des sauvegardes .bak-mojibake ont été créées pour les fichiers modifiés.");