'use client';

import { Suspense } from 'react';
import Chat from '@/components/chat/chat';
import { ProLanding } from '@/components/landing/ProLanding';
import CareerMapTeaser from '@/components/career-map/CareerMapTeaser';
import LastProjects from '@/components/projects/LastProjects';

function ChatSkeleton() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background">
      <div className="h-28 w-28 animate-pulse rounded-full bg-muted" />
      <div className="mt-6 h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-3 w-32 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <ProLanding />
      <CareerMapTeaser />
      <LastProjects />
      <Suspense fallback={<ChatSkeleton />}>
        <div id="chat" className="flex h-screen min-h-[640px] shrink-0 snap-start flex-col">
          <Chat />
        </div>
      </Suspense>
    </div>
  );
}
