'use client';

import { easeOut, motion } from 'framer-motion';
import { Award, Code, Mail, MessageSquare, Briefcase, MapPin } from 'lucide-react';
import React from 'react';

import { presetReplies } from '@/lib/config-loader';

interface ChatLandingProps {
  submitQuery: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
}

const ChatLanding: React.FC<ChatLandingProps> = ({ submitQuery, handlePresetReply }) => {

  const suggestedQuestions = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: 'Who are you?',
    },
    {
      icon: <Code className="h-4 w-4" />,
      text: 'What projects are you most proud of?',
    },
    {
      icon: <Award className="h-4 w-4" />,
      text: 'What are your skills?',
    },
    {
      icon: <Briefcase className="h-4 w-4" />,
      text: 'Are you open to new roles?',
    },
    {
      icon: <Mail className="h-4 w-4" />,
      text: 'How can I reach you?',
    },
  ];

  const handleQuestionClick = (questionText: string) => {
    const preset = presetReplies[questionText as keyof typeof presetReplies];
    
    if (preset && handlePresetReply) {
      handlePresetReply(questionText, preset.reply, preset.tool);
    } else {
      submitQuery(questionText);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome message */}
      <motion.div className="mb-6 text-center" variants={itemVariants}>
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Hi, I&apos;m Karol
        </h2>
        <p className="text-muted-foreground text-base">
          Software Engineer &middot; AI &middot; Automation
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>Paris, France</span>
        </div>
      </motion.div>

      {/* Available for Opportunities */}
      <motion.div className="mb-8" variants={itemVariants}>
        <motion.button
          onClick={() => handleQuestionClick('Are you open to new roles?')}
          className="bg-card hover:bg-accent border border-border rounded-full px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Open to opportunities &mdash; CDI, CDD & Freelance
        </motion.button>
      </motion.div>

      {/* Suggested questions */}
      <motion.div
        className="w-full max-w-md space-y-3"
        variants={containerVariants}
      >
        <motion.p
          className="text-muted-foreground mb-1 text-center text-xs uppercase tracking-wider"
          variants={itemVariants}
        >
          Ask me anything
        </motion.p>
        {suggestedQuestions.map((question, index) => (
          <motion.button
            key={index}
            className="bg-accent hover:bg-accent/80 flex w-full items-center rounded-lg px-4 py-3 transition-colors"
            onClick={() => handleQuestionClick(question.text)}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bg-background mr-3 rounded-full p-2">
              {question.icon}
            </span>
            <span className="text-left text-foreground">{question.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatLanding;
