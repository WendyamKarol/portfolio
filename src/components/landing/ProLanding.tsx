'use client';

import { easeOut, motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, Mail, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { contactInfo, getConfig } from '@/lib/config-loader';
import { Button } from '@/components/ui/button';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export function ProLanding() {
  const config = getConfig();
  const { landing, personal, social } = config;
  const [photoSrc, setPhotoSrc] = useState(personal.avatar);

  function scrollToChat() {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <motion.header
      className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="container relative mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-center md:gap-10">
          <div className="flex max-w-lg flex-col items-center">
            <motion.div
              variants={item}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Open to opportunities
            </motion.div>

            <motion.h1
              variants={item}
              className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {personal.name}
            </motion.h1>

            <motion.p
              variants={item}
              className="text-muted-foreground mt-3 text-lg md:text-xl"
            >
              <span className="text-foreground font-medium">{landing.tagline}</span>
              {' · '}
              {landing.highlight}
            </motion.p>

            <motion.p
              variants={item}
              className="text-muted-foreground mt-4 text-base leading-relaxed"
            >
              {landing.valueProposition}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button size="lg" onClick={scrollToChat}>
                Talk to my AI assistant
              </Button>

              <div className="flex items-center justify-center gap-4">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </a>
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="relative shrink-0">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border border-border bg-muted shadow-lg md:h-48 md:w-48">
              <Image
                src={photoSrc}
                alt={personal.name}
                width={192}
                height={192}
                sizes="(max-width: 768px) 160px, 192px"
                className="h-full w-full object-cover object-[50%_12%]"
                priority
                unoptimized
                onError={() => setPhotoSrc(personal.fallbackAvatar)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
