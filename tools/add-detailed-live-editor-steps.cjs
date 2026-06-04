const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pagePath = path.join(root, "app", "import-guide", "page.jsx");

if (!fs.existsSync(pagePath)) {
  console.error("ERREUR : app/import-guide/page.jsx introuvable.");
  process.exit(1);
}

let text = fs.readFileSync(pagePath, "utf8");
const backupPath = pagePath + ".bak-detailed-live-editor-steps";

fs.writeFileSync(backupPath, text, "utf8");

const marker = '<div style={{ display: "grid", gap: 18, marginTop: 18 }}>';

const detailedBlock = String.raw`
          <Card>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                display: "inline-flex",
                background: "rgba(34,211,238,.12)",
                color: "#67e8f9",
                fontWeight: 1000,
                marginBottom: 12,
              }}
            >
              MODE_EMPLOI_LIVE_EDITOR_DETAILLE_V4
            </div>

            <h2>Mode d’emploi détaillé Live Editor étape par étape</h2>

            <p style={{ color: "#cbd5e1", fontSize: 16 }}>
              Cette méthode est pensée pour les joueurs PC qui veulent récupérer leurs vraies données FC26.
              Si tu ne trouves pas une donnée dans Live Editor, tu peux la recopier manuellement depuis FC26.
              Le but est d’obtenir assez d’informations pour que FC Career Hub démarre avec ton vrai club,
              ton vrai effectif, ton calendrier et ton classement.
            </p>

            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Avant de commencer</h3>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Lance EA App en mode hors ligne si tu utilises Live Editor.</li>
                  <li>Lance FC26.</li>
                  <li>Charge ta sauvegarde carrière Manager.</li>
                  <li>Lance FC 26 Live Editor.</li>
                  <li>Vérifie que Live Editor est bien attaché au jeu et que ta carrière est chargée.</li>
                  <li>Garde FC Career Hub ouvert sur cette page d’import.</li>
                </ol>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 1 — Infos de carrière</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Ces infos servent à créer la base de ta carrière dans FC Career Hub.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Regarde le nom exact de ton club dans ta carrière.</li>
                  <li>Note le championnat ou la compétition principale de ton club.</li>
                  <li>Note ta saison actuelle : saison 1, saison 2, etc.</li>
                  <li>Note la journée actuelle ou la semaine de ton calendrier.</li>
                  <li>Va dans les finances du club et note ton budget transfert approximatif.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre la partie liée aux équipes ou au club, souvent Teams Editor.</li>
                  <li>Retrouve ton club.</li>
                  <li>Vérifie le nom du club.</li>
                  <li>Note ou vérifie le budget transfert du club si l’information est visible.</li>
                </ol>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  À remplir dans la page : Club, Ligue, Saison, Semaine/Journée, Budget, Coach.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 2 — Effectif au format CSV</h3>
                <p style={{ color: "#cbd5e1" }}>
                  L’effectif permet au Career Hub de générer des événements cohérents :
                  blessure, moral, mercato, contrats, stars, jeunes, cadres et remplaçants.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Va dans l’écran Effectif ou Gestion équipe.</li>
                  <li>Commence par les titulaires.</li>
                  <li>Ajoute ensuite les remplaçants importants.</li>
                  <li>Ajoute les jeunes ou les joueurs que tu veux suivre dans ta narration.</li>
                  <li>Pour chaque joueur, note au minimum : nom, poste, âge, note générale.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre Players Editor.</li>
                  <li>Recherche ton club ou filtre les joueurs de ton équipe.</li>
                  <li>Pour chaque joueur utile, récupère son nom.</li>
                  <li>Récupère son poste principal.</li>
                  <li>Récupère son âge.</li>
                  <li>Récupère son overall.</li>
                  <li>Récupère son potentiel si disponible.</li>
                  <li>Si tu veux un import plus complet, ajoute aussi contrat restant et salaire.</li>
                </ol>

                <h4>Format CSV à respecter</h4>
                <pre
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    overflowX: "auto",
                  }}
                >
name,position,age,overall,potential,goals,appearances,contractYears,wage
Mikel Oyarzabal,AG,29,84,84,3,4,3,2.4
                </pre>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Conseil joueur : si tu n’as pas tout, remplis seulement name, position, age et overall.
                  Le reste peut rester à 0 ou être estimé.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 3 — Matchs et résultats</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Les matchs permettent au Career Hub de comprendre ta forme, tes séries,
                  les défaites importantes, les victoires, les matchs de coupe et la pression médiatique.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre le calendrier de ta carrière.</li>
                  <li>Note les matchs déjà joués.</li>
                  <li>Pour chaque match, note la journée ou la semaine.</li>
                  <li>Note l’équipe à domicile.</li>
                  <li>Note l’équipe extérieure.</li>
                  <li>Note le score si le match est joué.</li>
                  <li>Note la compétition : Championnat, Coupe, Europe ou Amical.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Si ta version affiche les matchs ou le calendrier, utilise ces informations.</li>
                  <li>Sinon, reste sur le calendrier classique de FC26 : c’est suffisant pour cet import.</li>
                  <li>Recopie les informations dans le CSV.</li>
                </ol>

                <h4>Format CSV à respecter</h4>
                <pre
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    overflowX: "auto",
                  }}
                >
week,home,away,score,competition
1,Real Sociedad,Villarreal,2-1,Championnat
2,Athletic Club,Real Sociedad,0-0,Championnat
                </pre>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Si un match n’est pas encore joué, laisse le score vide.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 4 — Classement</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Le classement permet au Career Hub de savoir si tu joues le titre,
                  l’Europe, le maintien, ou si la pression commence à monter.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre le classement de ton championnat.</li>
                  <li>Recopie ton club.</li>
                  <li>Recopie les équipes proches de toi au classement.</li>
                  <li>Tu peux aussi recopier tout le classement si tu veux une carrière plus précise.</li>
                  <li>Pour chaque équipe, note : joués, victoires, nuls, défaites, buts pour, buts contre, différence, points.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre Live Editor dans ta sauvegarde carrière.</li>
                  <li>Va dans la zone équipe, championnat ou table de championnat si elle est disponible.</li>
                  <li>Recopie les lignes utiles du classement.</li>
                  <li>Si tu ne trouves pas cette zone, utilise simplement le classement visible dans FC26.</li>
                </ol>

                <h4>Format CSV à respecter</h4>
                <pre
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    overflowX: "auto",
                  }}
                >
team,played,won,drawn,lost,gf,ga,gd,points
Real Sociedad,2,1,1,0,2,1,1,4
Villarreal,2,1,0,1,3,3,0,3
                </pre>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Tu peux commencer avec seulement ton club et 3 ou 4 concurrents directs.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 5 — Copier puis importer le JSON</h3>

                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Une fois les champs remplis, descends à la section JSON généré automatiquement.</li>
                  <li>Vérifie que ton club apparaît bien dans le JSON.</li>
                  <li>Vérifie que tes joueurs apparaissent dans squad.</li>
                  <li>Vérifie que tes matchs apparaissent dans fixtures.</li>
                  <li>Vérifie que ton classement apparaît dans leagueTable.</li>
                  <li>Clique sur Copier le JSON.</li>
                  <li>Retourne sur la page principale.</li>
                  <li>Clique sur Manager Career.</li>
                  <li>Choisis Import FC26.</li>
                  <li>Colle le JSON dans la zone prévue.</li>
                  <li>Clique sur Créer depuis données FC26.</li>
                </ol>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Le joueur ne doit jamais écrire le JSON à la main. Il remplit les champs, copie, colle, puis crée la carrière.
                </p>
              </div>
            </div>
          </Card>
`;

if (text.includes("MODE_EMPLOI_LIVE_EDITOR_DETAILLE_V4")) {
  console.log("Le bloc détaillé existe déjà. Aucune modification appliquée.");
} else if (text.includes(marker)) {
  text = text.replace(marker, detailedBlock + "\n\n        " + marker);
  fs.writeFileSync(pagePath, text, "utf8");
  console.log("Bloc détaillé Live Editor ajouté dans /import-guide.");
  console.log("Sauvegarde :", backupPath);
} else {
  console.error("Impossible de trouver l’emplacement d’insertion.");
  console.error("Cherche manuellement le bloc :");
  console.error(marker);
  process.exit(1);
}

console.log("Relance : rmdir /s /q .next puis npm.cmd run build");