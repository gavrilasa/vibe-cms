'use client';

import { useEffect } from 'react';

export function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: window.location.pathname,
          }),
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, []);

  return null;
}