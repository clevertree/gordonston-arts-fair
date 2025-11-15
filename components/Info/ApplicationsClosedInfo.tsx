import React from 'react';

/**
 * Simple information box stating that applications are closed.
 * The message year is derived from NEXT_PUBLIC_EVENT_DATE.
 */
export default function ApplicationsClosedInfo() {
  const eventDateStr = process.env.NEXT_PUBLIC_EVENT_DATE || '';

  // Parse year from env string safely (expects formats like YYYY-MM-DD ...)
  let eventYear: string = '';
  if (eventDateStr) {
    const yearMatch = eventDateStr.trim().match(/^\s*(\d{4})/);
    eventYear = yearMatch ? yearMatch[1] : '';
  }

  const yearText = eventYear || 'the upcoming';

  return (
    <div
      style={{
        border: '1px solid var(--gold-color)',
        background: 'rgba(255, 215, 0, 0.08)',
        padding: '1rem',
        borderRadius: '8px',
      }}
      role="status"
      aria-live="polite"
    >
      <p style={{ margin: 0 }}>
        Applications are closed for the {yearText} Gordonston Art Fair. Please consider applying next year.
      </p>
    </div>
  );
}
