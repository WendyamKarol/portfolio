'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setImgIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setImgIndex((i) => Math.min(i + 1, (project.images?.length ?? 1) - 1));
      if (e.key === 'ArrowLeft') setImgIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [project, onClose]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  const githubLink = project?.links.find(
    (l) => l.name.toLowerCase().includes('github') || l.url.includes('github.com'),
  );
  const demoLink = project?.links.find(
    (l) =>
      l.name.toLowerCase().includes('demo') ||
      l.name.toLowerCase().includes('live') ||
      l.name.toLowerCase().includes('site'),
  );
  const hasImages = (project?.images?.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto">
              {/* Image section */}
              {hasImages && (
                <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted sm:h-64">
                  <Image
                    src={project.images[imgIndex].src}
                    alt={project.images[imgIndex].alt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIndex((i) => Math.max(i - 1, 0))}
                        disabled={imgIndex === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity disabled:opacity-30 hover:bg-black/70"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setImgIndex((i) => Math.min(i + 1, project.images.length - 1))}
                        disabled={imgIndex === project.images.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity disabled:opacity-30 hover:bg-black/70"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {project.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col gap-5 p-6">
                {/* Header */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {project.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      {project.category}
                    </span>
                    {project.status && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">{project.title}</h2>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                {/* Achievements */}
                {project.achievements && project.achievements.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">Key features</h3>
                    <ul className="space-y-2">
                      {project.achievements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech stack */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Tech stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {(githubLink?.url || demoLink?.url) && (
                  <div className="flex flex-wrap gap-3 border-t border-border pt-4">
                    {githubLink?.url && (
                      <a
                        href={githubLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                    {demoLink?.url && (
                      <a
                        href={demoLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {demoLink.name}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
