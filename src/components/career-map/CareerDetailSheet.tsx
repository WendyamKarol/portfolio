'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStepTypeLabel, resolveLocalized } from '@/lib/career-journey';
import CareerStepDetail from '@/components/career-map/CareerStepDetail';
import type { CareerJourney, CareerStep, Locale } from '@/types/portfolio';
import { Button } from '@/components/ui/button';

interface Props {
  step: CareerStep;
  journey: CareerJourney;
  locale: Locale;
  currentIndex: number;
  stepCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export default function CareerDetailSheet({
  step,
  journey,
  locale,
  currentIndex,
  stepCount,
  onClose,
  onPrev,
  onNext,
  className,
}: Props) {
  const typeLabel = getStepTypeLabel(step.type, locale);

  return (
    <>
      <button
        type="button"
        className="pointer-events-auto fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
        aria-label={locale === 'fr' ? 'Fermer les détails' : 'Close details'}
        onClick={onClose}
      />

      <div
        className={cn(
          'pointer-events-auto fixed z-[70] flex flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl',
          'bottom-0 left-0 right-0 max-h-[min(78dvh,640px)]',
          'md:bottom-4 md:left-4 md:right-auto md:w-full md:max-w-md md:rounded-2xl',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-detail-title"
      >
        <div className="flex items-start gap-2 border-b border-white/10 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-white/60">
              <span className="rounded bg-white/10 px-1.5 py-0.5">{typeLabel}</span>
              <span>
                {currentIndex + 1}/{stepCount}
              </span>
              <span>{step.period}</span>
            </div>
            <h2 id="career-detail-title" className="mt-1 text-base font-semibold leading-tight md:text-lg">
              {resolveLocalized(step.title, locale)}
            </h2>
            <p className="text-sm text-orange-300">{step.organization}</p>
            <p className="text-xs text-white/55">
              {step.city === resolveLocalized(step.country, locale)
                ? step.city
                : `${step.city}, ${resolveLocalized(step.country, locale)}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-white/80 hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="mb-3 text-sm leading-relaxed text-white/80">
            {resolveLocalized(step.summary, locale)}
          </p>
          <CareerStepDetail step={step} journey={journey} locale={locale} variant="overlay" />
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-white/80 hover:bg-white/10 hover:text-white"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === 'fr' ? 'Préc.' : 'Prev'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-white/80 hover:bg-white/10 hover:text-white"
            onClick={onNext}
            disabled={currentIndex >= stepCount - 1}
          >
            {locale === 'fr' ? 'Suiv.' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
