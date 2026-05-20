'use client';

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveLocalized } from '@/lib/career-journey';
import type { CareerPlayer } from '@/components/career-map/useCareerPlayer';
import type { CareerJourneyIntro } from '@/types/portfolio';

interface Props {
  player: CareerPlayer;
  intro: CareerJourneyIntro;
  onStart: () => void;
  onSkipIntro: () => void;
  overlay?: boolean;
}

export default function CareerPlayerControls({
  player,
  intro,
  onStart,
  onSkipIntro,
  overlay = false,
}: Props) {
  const { locale, currentIndex, stepCount, mode, isPlaying } = player;
  const isIdle = mode === 'idle';
  const isIntro = mode === 'intro';

  const btnClass = overlay
    ? 'h-11 w-11 text-white/90 hover:bg-white/15 hover:text-white'
    : 'h-11 w-11';

  const barClass = overlay
    ? 'border-white/15 bg-black/70 backdrop-blur-xl'
    : 'border-white/15 bg-black/60 backdrop-blur-md';

  if (isIdle) {
    return (
      <Button
        size="lg"
        onClick={onStart}
        className="pointer-events-auto min-h-12 gap-2 px-8 text-base shadow-xl"
        aria-label={resolveLocalized(intro.ctaLabel, locale)}
      >
        <Play className="h-5 w-5" />
        {resolveLocalized(intro.ctaLabel, locale)}
      </Button>
    );
  }

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-2">
      {isIntro && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipIntro}
          className={overlay ? 'text-white/70 hover:text-white' : 'text-xs'}
        >
          {resolveLocalized(intro.skipIntroLabel, locale)}
        </Button>
      )}
      <div className={`flex items-center gap-1 rounded-full border px-2 py-1.5 ${barClass}`}>
        <Button
          variant="ghost"
          size="icon"
          className={btnClass}
          onClick={player.prev}
          disabled={currentIndex === 0}
          aria-label="Previous"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        {isPlaying ? (
          <Button variant="ghost" size="icon" className={btnClass} onClick={player.pause} aria-label="Pause">
            <Pause className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className={btnClass} onClick={player.play} aria-label="Play">
            <Play className="h-5 w-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={btnClass}
          onClick={player.next}
          disabled={currentIndex >= stepCount - 1 && mode === 'completed'}
          aria-label="Next"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className={btnClass} onClick={player.restart} aria-label="Restart">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
