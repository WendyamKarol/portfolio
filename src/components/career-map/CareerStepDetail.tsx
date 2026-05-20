'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';
import {
  getTestimonialsForStep,
  isPlaceholderQuote,
  resolveLocalized,
} from '@/lib/career-journey';
import { cn } from '@/lib/utils';
import type { CareerJourney, CareerStep, Locale } from '@/types/portfolio';

interface Props {
  step: CareerStep;
  journey: CareerJourney;
  locale: Locale;
  className?: string;
  variant?: 'default' | 'overlay';
}

export default function CareerStepDetail({
  step,
  journey,
  locale,
  className,
  variant = 'default',
}: Props) {
  const testimonials = getTestimonialsForStep(journey, step.id);
  const images = step.detail.images ?? [];
  const nested = step.nestedExperiences ?? [];
  const overlay = variant === 'overlay';

  return (
    <div className={className}>
      {nested.length > 0 && (
        <div className={cn(overlay ? 'mb-4' : 'mt-4')}>
          <h3
            className={cn(
              'mb-2 text-sm font-medium',
              overlay ? 'text-white' : 'text-foreground',
            )}
          >
            {locale === 'fr' ? 'Expériences liées' : 'Related experiences'}
          </h3>
          <ul className="space-y-2">
            {nested.map((exp) => (
              <li
                key={exp.id}
                className={cn(
                  'rounded-lg border p-3 text-sm',
                  overlay
                    ? 'border-white/10 bg-white/5'
                    : 'border-border/60 bg-muted/40',
                )}
              >
                <p className={cn('font-medium', overlay ? 'text-white' : 'text-foreground')}>
                  {resolveLocalized(exp.title, locale)}
                </p>
                <p className={cn('text-xs', overlay ? 'text-white/60' : 'text-muted-foreground')}>
                  {exp.period} · {exp.organization}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>
                {(exp.skills?.length ?? 0) > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exp.skills!.map((skill) => (
                      <span
                        key={skill}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px]',
                          overlay
                            ? 'bg-white/10 text-white/75'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p
        className={cn(
          'text-sm leading-relaxed',
          overlay ? 'text-white/85' : 'text-muted-foreground mt-4',
        )}
      >
        {resolveLocalized(step.detail.description, locale)}
      </p>

      {step.detail.highlights.length > 0 && (
        <ul className={cn('space-y-2', overlay ? 'mt-3' : 'mt-4')}>
          {step.detail.highlights.map((h, i) => (
            <li
              key={i}
              className={cn(
                'border-l-2 pl-3 text-sm',
                overlay
                  ? 'border-orange-400/60 text-white/90'
                  : 'border-primary/30 text-foreground/90',
              )}
            >
              {resolveLocalized(h, locale)}
            </li>
          ))}
        </ul>
      )}

      {(step.detail.technologies?.length ?? 0) > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {step.detail.technologies!.map((tech) => (
            <span
              key={tech}
              className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                overlay
                  ? 'bg-white/10 text-white/75'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {images.map((img) => (
            <div key={img.src} className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={img.src}
                alt={resolveLocalized(img.alt, locale)}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          ))}
        </div>
      )}

      {testimonials.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3
            className={cn(
              'flex items-center gap-2 text-sm font-medium',
              overlay ? 'text-white' : 'text-foreground',
            )}
          >
            <Quote className="h-4 w-4" />
            {locale === 'fr' ? 'Témoignages' : 'Testimonials'}
          </h3>
          {testimonials.map((t) => {
            const hasQuote = !isPlaceholderQuote(t.quote);
            const documentLabel = t.documentLabel
              ? resolveLocalized(t.documentLabel, locale)
              : locale === 'fr'
                ? 'Document'
                : 'Document';

            return (
              <blockquote
                key={t.id}
                className={cn(
                  'rounded-lg border p-3 text-sm',
                  overlay
                    ? 'border-white/10 bg-white/5'
                    : 'border-border/60 bg-muted/40',
                )}
              >
                {hasQuote && (
                  <p className={cn('italic', overlay ? 'text-white/90' : 'text-foreground/90')}>
                    &ldquo;{resolveLocalized(t.quote, locale)}&rdquo;
                  </p>
                )}
                {t.documentUrl && (
                  <div className={cn(hasQuote && 'mt-3')}>
                    <p
                      className={cn(
                        'mb-2 text-xs font-medium',
                        overlay ? 'text-white/70' : 'text-muted-foreground',
                      )}
                    >
                      {documentLabel}
                    </p>
                    <iframe
                      src={`${t.documentUrl}#view=FitH`}
                      title={documentLabel}
                      className={cn(
                        'h-[min(70vh,520px)] w-full rounded-md border',
                        overlay ? 'border-white/15 bg-white/5' : 'border-border/60 bg-background',
                      )}
                    />
                    <a
                      href={t.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'mt-2 inline-block text-xs underline-offset-2 hover:underline',
                        overlay ? 'text-orange-300' : 'text-primary',
                      )}
                    >
                      {locale === 'fr' ? 'Ouvrir le PDF dans un nouvel onglet' : 'Open PDF in a new tab'}
                    </a>
                  </div>
                )}
                <footer
                  className={cn(
                    'text-xs',
                    hasQuote || t.documentUrl ? 'mt-2' : '',
                    overlay ? 'text-white/55' : 'text-muted-foreground',
                  )}
                >
                  — {t.author}, {resolveLocalized(t.role, locale)}
                  {t.company ? ` · ${t.company}` : ''}
                </footer>
              </blockquote>
            );
          })}
        </div>
      )}
    </div>
  );
}
