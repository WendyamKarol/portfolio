'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';
import { getSortedSteps, resolveLocalized } from '@/lib/career-journey';
import { Button } from '@/components/ui/button';

const CareerGlobePreview = dynamic(
  () => import('@/components/career-map/CareerGlobePreview'),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full max-w-md animate-pulse rounded-2xl bg-slate-900 md:h-80" />
    ),
  },
);

export default function CareerMapTeaser() {
  const config = getConfig();
  const journey = config.careerJourney;
  const locale = 'en' as const;

  if (!journey?.enabled) return null;

  const steps = getSortedSteps(journey);

  return (
    <section
      id="career-map"
      className="border-border snap-start border-b bg-gradient-to-b from-background via-slate-900/95 to-slate-950"
    >
      <div className="container mx-auto flex min-h-[50vh] max-w-5xl flex-col items-center justify-center gap-8 px-4 py-14 md:flex-row md:py-16">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-orange-400">
            <MapPin className="h-4 w-4" />
            Career Map
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {resolveLocalized(journey.intro.headline, locale)}
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-300">
            {resolveLocalized(journey.intro.subheadline, locale)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {steps.length} steps · Burkina Faso → Morocco → France → Spain
          </p>
          <Button asChild size="lg" className="mt-6 gap-2">
            <Link href="/journey">
              {resolveLocalized(journey.intro.ctaLabel, locale)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <CareerGlobePreview />
      </div>
    </section>
  );
}
