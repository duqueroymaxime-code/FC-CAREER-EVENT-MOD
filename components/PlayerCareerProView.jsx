"use client";

import PlayerCareerApp from "./player-career/PlayerCareerApp";

export default function PlayerCareerProView({
  career = {},
  onApply = () => {},
}) {
  return <PlayerCareerApp career={career} onApply={onApply} />;
}