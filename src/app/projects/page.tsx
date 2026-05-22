'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Code2 } from 'lucide-react';
import { easeOut, motion } from 'framer-motion';
import ProjectThumbnail, { hasThumbnail } from '@/components/projects/ProjectThumbnail';
import ProjectModal from '@/components/projects/ProjectModal';
import { useState } from 'react';
import { getConfig } from '@/lib/config-loader';
import { Project } from '@/types/portfolio';
import { Button } from '@/components/ui/button';

const CATEGORIES = ['All', 'AI', 'Web', 'Embedded', 'Other'] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

function categoryGradient(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes('ai') || lower.includes('llm') || lower.includes('ml') || lower.includes('rag') || lower.includes('nlp')) {
    return 'from-indigo-500/25 via-purple-500/15 to-violet-500/5';
  }
  if (lower.includes('web') || lower.includes('frontend')) {
    return 'from-blue-500/25 via-cyan-500/15 to-sky-500/5';
  }
  if (lower.includes('embedded') || lower.includes('iot')) {
    return 'from-emerald-500/25 via-teal-500/15 to-green-500/5';
  }
  if (lower.includes('robot') || lower.includes('autonomous')) {
    return 'from-orange-500/25 via-amber-500/15 to-yellow-500/5';
  }
  return 'from-slate-500/20 via-slate-400/10 to-transparent';
}

function matchesFilter(project: Project, filter: CategoryFilter): boolean {
  if (filter === 'All') return true;
  const lower = project.category.toLowerCase();
  if (filter === 'AI') return lower.includes('ai') || lower.includes('llm') || lower.includes('ml') || lower.includes('rag') || lower.includes('nlp');
  if (filter === 'Web') return lower.includes('web') || lower.includes('frontend') || lower.includes('full');
  if (filter === 'Embedded') return lower.includes('embedded') || lower.includes('iot') || lower.includes('robot') || lower.includes('autonomous');
  return true;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const maxTech = 4;
  const visibleTech = project.techStack.slice(0, maxTech);
  const extraCount = project.techStack.length - maxTech;
  const firstImage = project.images?.[0];

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {firstImage ? (
          <Image
            src={firstImage.src}
            alt={firstImage.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : hasThumbnail(project.title) ? (
          <ProjectThumbnail title={project.title} />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${categoryGradient(project.category)} flex items-center justify-center`}
          >
            <Code2 className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        {project.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{project.date}</span>
          <span>·</span>
          <span className="truncate">{project.category}</span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground">{project.title}</h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              +{extraCount}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-muted-foreground/60 transition-colors group-hover:text-primary">
          Click to view details →
        </p>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const config = getConfig();
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = config.projects.filter((p) => matchesFilter(p, filter));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6 gap-1.5 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </Button>

          <p className="mb-1.5 text-sm font-medium text-primary">Portfolio</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            All Projects
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            {config.projects.length} projects — AI systems, web apps, embedded systems and more.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === cat
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          key={filter}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {filtered.map((project) => (
            <ProjectCard key={project.title} project={project} onClick={() => setSelected(project)} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">No projects in this category.</p>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
