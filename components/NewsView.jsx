import React from 'react';
import Card from './Card';
import Pill from './Pill';

/**
 * Vue des actualités
 * @param {Object} career - Carrière
 */
export default function NewsView({ career }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {career.news.length ? (
        career.news.map(item => (
          <Card key={item.id}>
            <Pill>{item.type}</Pill>
            <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
            <p className="mt-2 text-slate-300">{item.body}</p>
          </Card>
        ))
      ) : (
        <Card>Aucune actualité générée.</Card>
      )}
    </div>
  );
}