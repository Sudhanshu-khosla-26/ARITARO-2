'use client';

import { useEffect } from 'react';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    const previousBodyBehavior = document.body.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = previousBehavior;
      document.body.style.scrollBehavior = previousBodyBehavior;
    };
  }, []);

  return <>{children}</>;
}
