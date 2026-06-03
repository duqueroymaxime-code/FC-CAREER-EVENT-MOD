import React from 'react';
import Card from './Card';
import Pill from './Pill';

/**
 * Vue du calendrier
 * @param {Object} career - Carrière
 */
export default function CalendarView({ career }) {
  return (
    <div className="grid gap-3">
      {career.fixtures.map(fixture => (
        <Card key={fixture.id} className={fixture.played ? "opacity-60" : ""}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Pill tone={fixture.played ? "green" : "cyan"}>
              Semaine {fixture.week} • {fixture.month}
            </Pill>
            <span>{fixture.competition}</span>
          </div>
          <h3 className="mt-3 text-2xl font-black">
            {fixture.home} {fixture.score || "-"} {fixture.away}
          </h3>
        </Card>
      ))}
    </div>
  );
}