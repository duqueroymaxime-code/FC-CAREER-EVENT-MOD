const fs = require("fs");
const path = require("path");

const root = process.cwd();

const targets = [
  path.join(root, "CareerApp.jsx"),
  path.join(root, "components", "CareerApp.jsx"),
  path.join(root, "fc-career-current", "CareerApp.jsx"),
].filter((file) => fs.existsSync(file));

if (!targets.length) {
  console.error("ERREUR : aucun CareerApp.jsx trouvé.");
  process.exit(1);
}

function replaceBetween(source, startMarker, endMarker, replacement) {
  const start = source.indexOf(startMarker);

  if (start === -1) {
    return source;
  }

  const end = source.indexOf(endMarker, start);

  if (end === -1) {
    return source;
  }

  return source.slice(0, start) + replacement + "\n" + source.slice(end);
}

const fixedCreateImportedLeagueTable = `function createImportedLeagueTable(rows = [], clubName) {
  return (rows || [])
    .filter((row) => row && (row.name || row.team))
    .map((row, index) => {
      const name = row.name || row.team;

      return {
        id: row.id || uid("table"),
        position: Number(row.position || index + 1),
        name,
        team: name,
        played: Number(row.played || row.p || 0),
        wins: Number(row.wins || row.won || row.w || 0),
        won: Number(row.won || row.wins || row.w || 0),
        draws: Number(row.draws || row.drawn || row.d || 0),
        drawn: Number(row.drawn || row.draws || row.d || 0),
        losses: Number(row.losses || row.lost || row.l || 0),
        lost: Number(row.lost || row.losses || row.l || 0),
        gf: Number(row.gf || row.goalsFor || row.goalsfor || 0),
        ga: Number(row.ga || row.goalsAgainst || row.goalsagainst || 0),
        gd: Number(row.gd || row.goalDifference || row.goaldifference || 0),
        goalsFor: Number(row.goalsFor || row.gf || row.goalsfor || 0),
        goalsAgainst: Number(row.goalsAgainst || row.ga || row.goalsagainst || 0),
        goalDifference: Number(row.goalDifference || row.gd || row.goaldifference || 0),
        points: Number(row.points || row.pts || row.pt || 0),
        form: row.form || [],
      };
    })
    .sort((a, b) => a.position - b.position);
}
`;

for (const filePath of targets) {
  let text = fs.readFileSync(filePath, "utf8");
  const original = text;

  const backupPath = `${filePath}.bak-league-table-keys`;
  fs.writeFileSync(backupPath, text, "utf8");

  // 1. Remplacer createImportedLeagueTable pour normaliser name + team.
  text = replaceBetween(
    text,
    "function createImportedLeagueTable",
    "function convertMarketPlayerToSquadPlayer",
    fixedCreateImportedLeagueTable
  );

  // 2. Rendre getUserLeaguePosition robuste si certaines lignes anciennes ont seulement team.
  text = text.replace(
    "const index = table.findIndex((team) => team.name === career.club.name);",
    "const index = table.findIndex((team) => (team.name || team.team) === career.club.name);"
  );

  // 3. Rendre sortLeagueTable robuste sur name/team.
  text = text.replace(
    "return a.name.localeCompare(b.name);",
    'return String(a.name || a.team || "").localeCompare(String(b.name || b.team || ""));'
  );

  // 4. Corriger la key React dans LeagueTableView.
  text = text.replace(
    'key={team.name}',
    'key={`${team.name || team.team || "team"}-${index}`}'
  );

  // 5. Corriger la détection du club utilisateur dans LeagueTableView.
  text = text.replace(
    "const isUser = team.name === career.club.name;",
    "const isUser = (team.name || team.team) === career.club.name;"
  );

  // 6. Corriger l’affichage du nom dans la cellule Club.
  text = text.replace(
    "{team.name}\n                  </td>",
    "{team.name || team.team}\n                  </td>"
  );

  if (text !== original) {
    fs.writeFileSync(filePath, text, "utf8");
    console.log("Corrigé :", filePath);
    console.log("Sauvegarde :", backupPath);
  } else {
    console.log("Aucun changement nécessaire :", filePath);
  }
}

console.log("Correctif LeagueTableView terminé.");
console.log("Relance : npm.cmd run build");