'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Code2 } from 'lucide-react';
import { easeOut, motion } from 'framer-motion';
import { useState } from 'react';
import { getConfig } from '@/lib/config-loader';
import { Project } from '@/types/portfolio';
import ProjectThumbnail, { hasThumbnail } from './ProjectThumbnail';
import ProjectModal from './ProjectModal';
import { Button } from '@/components/ui/button';

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
  if (lower.includes('database') || lower.includes('backend') || lower.includes('sql')) {
    return 'from-slate-500/25 via-zinc-500/15 to-neutral-500/5';
  }
  return 'from-slate-500/20 via-slate-400/10 to-transparent';
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const maxTech = 3;
  const visibleTech = project.techStack.slice(0, maxTech);
  const extraCount = project.techStack.length - maxTech;
  const firstImage = project.images?.[0];

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-muted">
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
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{project.date}</span>
          <span>·</span>
          <span className="truncate">{project.category}</span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground">{project.title}</h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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

        <p className="mt-1 text-xs text-muted-foreground/60 group-hover:text-primary transition-colors">
          Click to view details →
        </p>
      </div>
    </motion.div>
  );
}

export default function LastProjects() {
  const config = getConfig();
  const featured = config.projects.filter((p) => p.featured).slice(0, 6);
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section className="border-b border-border bg-background py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-sm font-medium text-primary">Selected work</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Recent Projects
            </h2>
          </div>
          <Button variant="ghost" asChild size="sm" className="gap-1.5 text-muted-foreground">
            <Link href="/projects">
              All projects
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} onClick={() => setSelected(project)} />
          ))}
        </motion.div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
