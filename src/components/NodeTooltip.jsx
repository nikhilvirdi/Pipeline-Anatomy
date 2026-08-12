import React from 'react';

export default function NodeTooltip({ node, theme }) {
  if (!node || !node.data) return null;

  const { label, title, phase, cardText, bullets } = node.data;

  // Format phase label cleanly (e.g. local-development -> LOCAL DEVELOPMENT)
  const formattedPhase = phase
    ? phase.replace(/-/g, ' ').toUpperCase()
    : 'PIPELINE STEP';

  const cardTitle = title || label;
  const isPhaseCard = bullets && bullets.length > 0;

  return (
    <div className="hover-card pointer-events-none">
      {/* Phase badge — hidden on phase cards (title is self-describing) */}
      {!isPhaseCard && (
        <span className="hover-card__tag">
          {formattedPhase}
        </span>
      )}
      
      <div className="hover-card__title">
        {cardTitle}
      </div>

      {/* Body: bulleted list for phase cards, paragraph for node cards */}
      {isPhaseCard ? (
        <ul className="hover-card__list">
          {bullets.map((bullet, idx) => (
            <li key={idx}>
              {bullet}
            </li>
          ))}
        </ul>
      ) : (
        <p className="hover-card__body">
          {cardText || 'No description available for this step.'}
        </p>
      )}
    </div>
  );
}
