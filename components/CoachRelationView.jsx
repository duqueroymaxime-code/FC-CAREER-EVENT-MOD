import React from "react";
import Card from "./Card";
import Pill from "./Pill";
import Bar from "./Bar";
import { pick } from "../utils/utils";

/**
 * Vue de la relation avec le coach
 * @param {Object} career - Carrière du joueur
 */
export default function CoachRelationView({ career }) {
  const { coachRelation } = career.playerCareer;
  const coachName =
    career.club.name === "Paris Saint-Germain"
      ? "Galtier"
      : career.club.name === "Olympique de Marseille"
      ? "Gasset"
      : "L'Entraîneur";

  // Générer des messages en fonction de la relation
  const getMessage = () => {
    if (coachRelation > 80) {
      return {
        text: `${career.playerCareer.name}, tu es un modèle pour l'équipe ! Continue comme ça.`,
        tone: "lime"
      };
    } else if (coachRelation > 60) {
      return {
        text: `Bon travail, mais il faut encore progresser sur ${getWeakness()}.`,
        tone: "cyan"
      };
    } else if (coachRelation > 40) {
      return {
        text: "Je suis déçu de ta performance récente. Il faut te réveiller !",
        tone: "amber"
      };
    } else if (coachRelation > 20) {
      return {
        text: "Si tu ne fais pas d'efforts, tu vas finir sur le banc !",
        tone: "red"
      };
    } else {
      return {
        text: "Je ne compte plus sur toi. Tu peux partir si tu veux.",
        tone: "red"
      };
    }
  };

  const getWeakness = () => {
    const weaknesses = [
      "la finition",
      "le jeu de tête",
      "la vitesse",
      "la vision du jeu",
      "la défense"
    ];
    return pick(weaknesses);
  };

  const message = getMessage();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Mon Coach : {coachName}</h2>
        <Pill tone={message.tone}>
          {coachRelation > 80
            ? "❤️"
            : coachRelation > 60
            ? "😊"
            : coachRelation > 40
            ? "😐"
            : coachRelation > 20
            ? "😠"
            : "😡"}
        </Pill>
      </div>
      <Bar label="Relation avec le Coach" value={coachRelation} className="mt-4" />
      <div className="mt-6 rounded-2xl bg-black/20 p-4">
        <p className="text-xl font-bold">
          {coachName} dit :{" "}
          <span
            className={`${
              message.tone === "red"
                ? "text-red-400"
                : message.tone === "amber"
                ? "text-amber-400"
                : "text-white"
            }`}
          >
            {message.text}
          </span>
        </p>
      </div>
      <div className="mt-4 grid gap-2">
        <button className="rounded-2xl bg-lime-300 p-3 font-black text-slate-950">
          Parler avec {coachName}
        </button>
        <button className="rounded-2xl bg-cyan-300 p-3 font-black text-slate-950">
          Demander un entraînement individuel
        </button>
      </div>
    </Card>
  );
}