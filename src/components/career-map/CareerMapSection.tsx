'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';
import { getSortedSteps, getTransitionHopCount, resolveLocalized } from '@/lib/career-journey';
import { useCareerPlayer } from '@/components/career-map/useCareerPlayer';
import CareerMap from '@/components/career-map/CareerMap';
import CareerPlayerControls from '@/components/career-map/CareerPlayerControls';
import CareerTimeline from '@/components/career-map/CareerTimeline';
import CareerDetailSheet from '@/components/career-map/CareerDetailSheet';
import { Button } from '@/components/ui/button';

export default function CareerMapSection() {
  const config = getConfig();
  const journey = config.careerJourney;

  const steps = useMemo(
    () => (journey ? getSortedSteps(journey) : []),
    [journey],
  );

  const player = useCareerPlayer(steps);
  const {
    currentIndex,
    currentStep,
    mode,
    locale,
    isPlaying,
    stepCount,
    skipIntro,
    start,
    play,
    pause,
    goToStep,
    complete,
    introDone,
    next,
    prev,
    openDetail,
    closeDetail,
    showDetail,
    setLocale,
  } = player;

  const isIdle = mode === 'idle';
  const prevIndexRef = useRef(0);

  const handleStepSelect = useCallback(
    (index: number) => {
      goToStep(index);
      pause();
    },
    [goToStep, pause],
  );

  const handleOpenDetail = useCallback(
    (index: number) => {
      if (mode === 'playing') pause();
      openDetail(index);
    },
    [mode, pause, openDetail],
  );

  const handleDetailPrev = useCallback(() => {
    prev();
  }, [prev]);

  const handleDetailNext = useCallback(() => {
    if (currentIndex >= stepCount - 1) {
      closeDetail();
      complete();
    } else {
      next();
    }
  }, [currentIndex, stepCount, next, closeDetail, complete]);

  const handleStart = useCallback(() => {
    start();
  }, [start]);

  const handleIntroDone = useCallback(() => {
    introDone();
  }, [introDone]);

  useEffect(() => {
    if (!isPlaying || !journey || showDetail) return;
    const fromIndex = prevIndexRef.current;
    const hops =
      fromIndex === currentIndex
        ? 1
        : getTransitionHopCount(steps, fromIndex, currentIndex);
    const delay = journey.map.segmentDurationMs * hops + journey.map.stepPauseMs;
    const timer = window.setTimeout(() => {
      if (currentIndex >= stepCount - 1) {
        complete();
      } else {
        next();
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentIndex, stepCount, journey, steps, complete, next, showDetail]);

  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isPlaying) pause();
          else if (!isIdle) play();
          break;
        case 'ArrowLeft':
          handleStepSelect(Math.max(0, currentIndex - 1));
          break;
        case 'ArrowRight':
          handleStepSelect(Math.min(stepCount - 1, currentIndex + 1));
          break;
        case 'Escape':
          if (showDetail) closeDetail();
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, isIdle, currentIndex, stepCount, play, pause, handleStepSelect, showDetail, closeDetail]);

  if (!journey?.enabled || steps.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Career journey is not configured.</p>
      </div>
    );
  }

  const toggleLocale = () => setLocale(locale === 'en' ? 'fr' : 'en');

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <CareerMap
          journey={journey}
          steps={steps}
          currentIndex={currentIndex}
          mode={mode}
          locale={locale}
          avatarMarkerSrc={journey.avatarMarkerSrc ?? '/avatar.png'}
          avatarMarkerFallback={config.personal.fallbackAvatar}
          onIntroDone={handleIntroDone}
          onStepMarkerClick={handleStepSelect}
          onOpenDetail={handleOpenDetail}
          fullScreen
        />
      </div>

      {showDetail && currentStep && !isIdle && (
        <CareerDetailSheet
          step={currentStep}
          journey={journey}
          locale={locale}
          currentIndex={currentIndex}
          stepCount={stepCount}
          onClose={closeDetail}
          onPrev={handleDetailPrev}
          onNext={handleDetailNext}
        />
      )}

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent px-3 pb-8 pt-3 safe-top md:px-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="pointer-events-auto text-white/90 hover:bg-white/10 hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">{locale === 'fr' ? 'Accueil' : 'Home'}</span>
          </Link>
        </Button>
        <div className="pointer-events-none text-center">
          <p className="text-sm font-semibold text-white md:text-base">
            {resolveLocalized(journey.intro.headline, locale)}
          </p>
          <p className="hidden text-[11px] text-white/60 sm:block">
            {locale === 'fr'
              ? 'Suivez mon parcours · cliquez une fenêtre pour le détail'
              : 'Follow my path · tap a popup for full details'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLocale}
          className="pointer-events-auto min-w-[44px] text-white/90 hover:bg-white/10 hover:text-white"
          aria-label="Toggle language"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Button>
      </header>

      {isIdle && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
          <CareerPlayerControls
            player={player}
            intro={journey.intro}
            onStart={handleStart}
            onSkipIntro={skipIntro}
            overlay
          />
        </div>
      )}

      {!isIdle && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 md:px-4">
          <CareerTimeline
            steps={steps}
            currentIndex={currentIndex}
            onSelect={handleStepSelect}
          />

          <div className="flex justify-center">
            <CareerPlayerControls
              player={player}
              intro={journey.intro}
              onStart={handleStart}
              onSkipIntro={skipIntro}
              overlay
            />
          </div>
        </div>
      )}
    </div>
  );
}
