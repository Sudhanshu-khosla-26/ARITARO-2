'use client';

import FloatingLines from './FloatingLines';

export default function GlobalBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      background: '#000000',
    }}>
      <FloatingLines
        colors={['#22d3ee', '#3b82f6', '#6366f1']}
        backgroundColor="#000000"
        speed={0.4}
        streakCount={2}
        glow={0.5}
        opacity={0.7}
        density={0.5}
        mixBlendMode="screen"
        mouseInteraction={true}
      />
      
      {/* Subtle grid texture above lines */}
      <div className="cyber-grid" style={{
        position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', zIndex: 1,
      }} />
    </div>
  );
}
