'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, easeOut } from 'framer-motion';
import { Brain, Code, Cloud, Database, Layers, Package } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';

interface SkillsProps {
  locale?: 'fr' | 'en';
}

const categoryIconMap: Record<string, React.ReactNode> = {
  'Expertises IA':           <Brain className="h-5 w-5" />,
  'AI Expertise':            <Brain className="h-5 w-5" />,
  'Méthodes & Principes':    <Layers className="h-5 w-5" />,
  'Methods & Principles':    <Layers className="h-5 w-5" />,
  'Langages de programmation': <Code className="h-5 w-5" />,
  'Programming Languages':   <Code className="h-5 w-5" />,
  'Frameworks':              <Package className="h-5 w-5" />,
  'Bases de données':        <Database className="h-5 w-5" />,
  'Databases':               <Database className="h-5 w-5" />,
  'Cloud & DevOps':          <Cloud className="h-5 w-5" />,
};

const Skills = ({ locale = 'en' }: SkillsProps) => {
  const config = getConfig();
  const cvSkills = config.cv_skills ?? [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: easeOut } },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="mx-auto w-full max-w-5xl px-4 sm:px-6"
    >
      <Card className="w-full border-none px-0 pb-8 sm:pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-2xl sm:text-3xl lg:text-4xl font-bold">
            {locale === 'fr' ? 'Compétences' : 'Skills & Expertise'}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-6 sm:space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cvSkills.map((section, index) => {
              const label = locale === 'fr' ? section.category : section.categoryEn;
              const icon = categoryIconMap[label] ?? categoryIconMap[section.category] ?? null;
              return (
                <motion.div key={index} className="space-y-3 px-0" variants={itemVariants}>
                  <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-accent-foreground text-base sm:text-lg font-semibold">
                      {label}
                    </h3>
                  </div>

                  <motion.div
                    className="flex flex-wrap gap-1.5 sm:gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {section.skills.map((skill, idx) => (
                      <motion.div
                        key={idx}
                        variants={badgeVariants}
                        whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                      >
                        <Badge className="border px-2 py-1 sm:px-3 sm:py-1.5 font-normal text-xs sm:text-sm">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
