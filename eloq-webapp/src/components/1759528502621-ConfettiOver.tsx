'use client';

import { useRef } from 'react';

import { Confetti, type ConfettiRef } from '@/components/ui/confetti';

type Player = {
  ranking: number;
  name: string;
};

type ConfettiNameProps = {
  topPlayers?: Player[]; // Make it optional to handle undefined case
};

export function ConfettiName({ topPlayers }: ConfettiNameProps) {
  const confettiRef = useRef<ConfettiRef>(null);

  // Handle case where topPlayers is undefined or empty
  const topPlayer = topPlayers && topPlayers.length > 0 ? topPlayers[0] : null;

  return (
    <div
      className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border"
      onMouseEnter={() => {
        if (topPlayer) {
          confettiRef.current?.fire({});
        }
      }}
    >
      <span className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10 margin">
        <p className="text-2xl">#{topPlayer?.ranking || 'N/A'}</p>
        <p>{topPlayer?.name || 'No players'}</p>
        <p className="text-7xl text-primary">🏆</p>
      </span>

      <Confetti
        ref={confettiRef}
        className="absolute top-0 left-0 z-0 size-full"
      />
    </div>
  );
}

export default ConfettiName;
