import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  BriefcaseIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleEllipsis,
  CodeIcon,
  FileText,
  GraduationCapIcon,
  Laugh,
  Layers,
  MailIcon,
  Sparkles,
  UserRoundSearch,
  UserSearch,
} from 'lucide-react';
import { useState } from 'react';
import { Drawer } from 'vaul';
import { presetReplies } from '@/lib/config-loader';

interface HelperBoostProps {
  submitQuery?: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
  locale?: 'fr' | 'en';
}

const presetMapping: Record<string, string> = {
  Me: 'Who are you?',
  Projects: 'What projects are you most proud of?',
  Skills: 'What makes you a strong AI Software Engineer?',
  Resume: 'Can I see your resume?',
  Contact: 'How can I reach you?',
};

const buttonLabels: Record<string, { en: string; fr: string }> = {
  Me: { en: 'Me', fr: 'Moi' },
  Projects: { en: 'Projects', fr: 'Projets' },
  Skills: { en: 'Skills', fr: 'Compétences' },
  Resume: { en: 'Resume', fr: 'CV' },
  Contact: { en: 'Contact', fr: 'Contact' },
};

const questionConfig = [
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Resume', color: '#D97856', icon: FileText },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
];

// EN keys for special highlighting
const specialQuestionKeys = [
  'Who are you?',
  'What makes you a strong AI Software Engineer?',
  'What projects are you most proud of?',
  'Can I see your resume?',
  'Are you available immediately?',
  'How can I reach you?',
];

type BilingualQuestion = { en: string; fr: string };

const questionsByCategory: {
  id: string;
  name: { en: string; fr: string };
  icon: React.ElementType;
  questions: BilingualQuestion[];
}[] = [
  {
    id: 'intro',
    name: { en: 'Intro', fr: 'Intro' },
    icon: UserSearch,
    questions: [
      { en: 'Who are you?', fr: 'Qui es-tu ?' },
      { en: 'Tell me about your background', fr: 'Parle-moi de ton parcours' },
      { en: 'How did you get into AI?', fr: 'Comment es-tu arrivé dans l\'IA ?' },
      { en: 'What sets you apart from other engineers?', fr: 'Qu\'est-ce qui te différencie des autres ingénieurs ?' },
    ],
  },
  {
    id: 'professional',
    name: { en: 'Professional', fr: 'Professionnel' },
    icon: BriefcaseIcon,
    questions: [
      { en: 'Why did you leave your last role?', fr: 'Pourquoi as-tu quitté ton dernier poste ?' },
      { en: 'What are you looking for in your next opportunity?', fr: 'Que recherches-tu dans ta prochaine opportunité ?' },
      { en: "What's your greatest professional achievement?", fr: 'Quelle est ta plus grande réussite professionnelle ?' },
      { en: 'Why should we hire you?', fr: 'Pourquoi devrions-nous t\'embaucher ?' },
    ],
  },
  {
    id: 'projects',
    name: { en: 'Projects', fr: 'Projets' },
    icon: CodeIcon,
    questions: [
      { en: 'What projects are you most proud of?', fr: 'De quels projets es-tu le plus fier ?' },
      { en: 'Tell me about your RAG and LLM projects', fr: 'Parle-moi de tes projets RAG et LLM' },
      { en: 'Have you shipped AI to production?', fr: 'As-tu mis de l\'IA en production ?' },
      { en: 'Walk me through your most complex AI project', fr: 'Présente-moi ton projet IA le plus complexe' },
    ],
  },
  {
    id: 'technical',
    name: { en: 'Technical', fr: 'Technique' },
    icon: GraduationCapIcon,
    questions: [
      { en: 'What makes you a strong AI Software Engineer?', fr: 'Qu\'est-ce qui fait de toi un bon ingénieur IA ?' },
      { en: 'Can I see your resume?', fr: 'Puis-je voir ton CV ?' },
      { en: "What's your experience with Generative AI?", fr: 'Quelle est ton expérience avec l\'IA générative ?' },
      { en: 'Do you have experience with Azure / cloud platforms?', fr: 'As-tu de l\'expérience avec Azure / les plateformes cloud ?' },
    ],
  },
  {
    id: 'logistics',
    name: { en: 'Logistics', fr: 'Logistique' },
    icon: MailIcon,
    questions: [
      { en: 'Are you available immediately?', fr: 'Es-tu disponible immédiatement ?' },
      { en: 'What kind of contract are you looking for?', fr: 'Quel type de contrat recherches-tu ?' },
      { en: 'Where are you located? Open to remote?', fr: 'Où es-tu basé ? Ouvert au télétravail ?' },
      { en: 'How can I reach you?', fr: 'Comment te contacter ?' },
    ],
  },
];

// Animated Chevron component
const AnimatedChevron = () => {
  return (
    <motion.div
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      className="text-primary mb-1.5"
    >
      <ChevronUp size={16} />
    </motion.div>
  );
};

export default function HelperBoost({
  submitQuery,
  handlePresetReply,
  locale = 'en',
}: HelperBoostProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(false);

  const handleQuestionClick = (questionKey: string) => {
    const presetKey = presetMapping[questionKey];
    if (presetKey && presetReplies[presetKey] && handlePresetReply) {
      const preset = presetReplies[presetKey];
      const reply = locale === 'fr' ? (preset.replyFr ?? preset.reply) : preset.reply;
      handlePresetReply(presetKey, reply, preset.tool);
    } else if (submitQuery) {
      // fallback: use a generic question text
      submitQuery(questionKey);
    }
  };

  const handleDrawerQuestionClick = (question: BilingualQuestion) => {
    const displayText = locale === 'fr' ? question.fr : question.en;
    // Check if there's a preset for this question (use EN key)
    const preset = presetReplies[question.en];
    if (preset && handlePresetReply) {
      const reply = locale === 'fr' ? (preset.replyFr ?? preset.reply) : preset.reply;
      handlePresetReply(question.en, reply, preset.tool);
    } else if (submitQuery) {
      submitQuery(displayText);
    }
    setOpen(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <div className="w-full">
          {/* Toggle Button */}
          <div
            className={
              isVisible
                ? 'mb-2 flex justify-center'
                : 'mb-0 flex justify-center'
            }
          >
            <button
              onClick={toggleVisibility}
              className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {isVisible ? (
                <>
                  <ChevronDown size={14} />
                  {locale === 'fr' ? 'Masquer les questions rapides' : 'Hide quick questions'}
                </>
              ) : (
                <>
                  <ChevronUp size={14} />
                  {locale === 'fr' ? 'Afficher les questions rapides' : 'Show quick questions'}
                </>
              )}
            </button>
          </div>

          {/* HelperBoost Content */}
          {isVisible && (
            <div className="w-full">
              <div
                className="flex w-full flex-wrap gap-1 md:gap-3"
                style={{ justifyContent: 'safe center' }}
              >
                {questionConfig.map(({ key, color, icon: Icon }) => (
                  <Button
                    key={key}
                    onClick={() => handleQuestionClick(key)}
                    variant="outline"
                    className="border-border hover:bg-border/30 h-auto min-w-[100px] flex-shrink-0 cursor-pointer rounded-xl border bg-background/80 px-4 py-3 shadow-none backdrop-blur-sm transition-none active:scale-95"
                  >
                    <div className="flex items-center gap-3 text-foreground">
                      <Icon size={18} strokeWidth={2} color={color} />
                      <span className="text-sm font-medium">
                        {buttonLabels[key][locale]}
                      </span>
                    </div>
                  </Button>
                ))}

                {/* Need Inspiration Button */}
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Drawer.Trigger className="group relative flex flex-shrink-0 items-center justify-center">
                        <motion.div
                          className="hover:bg-border/30 flex h-auto cursor-pointer items-center space-x-1 rounded-xl border border-border bg-background/80 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200"
                          whileHover={{ scale: 1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3 text-gray-700">
                            <CircleEllipsis
                              className="h-[20px] w-[18px] text-foreground"
                              strokeWidth={2}
                            />
                          </div>
                        </motion.div>
                      </Drawer.Trigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <AnimatedChevron />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Content */}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-100 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-muted outline-none lg:h-[60%]">
            <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-background p-4">
              <div className="mx-auto max-w-md space-y-4">
                <div
                  aria-hidden
                  className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-border"
                />
                <div className="mx-auto w-full max-w-md">
                  <div className="space-y-8 pb-16">
                    {questionsByCategory.map((category) => (
                      <CategorySection
                        key={category.id}
                        name={locale === 'fr' ? category.name.fr : category.name.en}
                        Icon={category.icon}
                        questions={category.questions}
                        locale={locale}
                        onQuestionClick={handleDrawerQuestionClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

// Component for each category section
interface CategorySectionProps {
  name: string;
  Icon: React.ElementType;
  questions: BilingualQuestion[];
  locale: 'fr' | 'en';
  onQuestionClick: (question: BilingualQuestion) => void;
}

function CategorySection({
  name,
  Icon,
  questions,
  locale,
  onQuestionClick,
}: CategorySectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 px-1">
        <Icon className="h-5 w-5" />
        <Drawer.Title className="text-[22px] font-medium text-foreground">
          {name}
        </Drawer.Title>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        {questions.map((question, index) => (
          <QuestionItem
            key={index}
            displayText={locale === 'fr' ? question.fr : question.en}
            onClick={() => onQuestionClick(question)}
            isSpecial={specialQuestionKeys.includes(question.en)}
          />
        ))}
      </div>
    </div>
  );
}

// Component for each question item with animated chevron
interface QuestionItemProps {
  displayText: string;
  onClick: () => void;
  isSpecial: boolean;
}

function QuestionItem({ displayText, onClick, isSpecial }: QuestionItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={cn(
        'flex w-full items-center justify-between rounded-[10px]',
        'text-md px-6 py-4 text-left font-normal',
        'transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isSpecial ? 'bg-primary' : 'bg-accent'
      )}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: isSpecial ? undefined : 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <div className="flex items-center">
        {isSpecial && <Sparkles className="mr-2 h-4 w-4 text-primary-foreground" />}
        <span className={isSpecial ? 'font-medium text-primary-foreground' : 'text-foreground'}>
          {displayText}
        </span>
      </div>
      <motion.div
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      >
        <ChevronRight
          className={cn(
            'h-5 w-5 shrink-0',
            isSpecial ? 'text-primary-foreground' : 'text-primary'
          )}
        />
      </motion.div>
    </motion.button>
  );
}
