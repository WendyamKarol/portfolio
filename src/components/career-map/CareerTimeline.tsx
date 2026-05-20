'use client';

import { cn } from '@/lib/utils';
import { getStepColor } from '@/lib/career-journey';
import type { CareerStep } from '@/types/portfolio';

interface Props {
  steps: CareerStep[];
  currentIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export default function CareerTimeline({ steps, currentIndex, onSelect, className }: Props) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex gap-1.5 overflow-x-auto px-1 py-1 scrollbar-none',
        className,
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const color = getStepColor(step);

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              'flex h-11 min-w-[44px] shrink-0 flex-col items-center justify-center rounded-xl px-2 transition-all',
              isActive
                ? 'bg-white/20 ring-2 ring-white/40'
                : 'bg-black/40 hover:bg-white/10',
            )}
            aria-label={`${step.city} ${step.period}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: isActive || isPast ? color : '#667788' }}
            />
            <span
              className={cn(
                'mt-0.5 max-w-[44px] truncate text-[9px] font-medium sm:max-w-[52px] sm:text-[10px]',
                isActive ? 'text-white' : 'text-white/60',
              )}
            >
              {step.city}
            </span>
          </button>
        );
      })}
    </div>
  );
}
