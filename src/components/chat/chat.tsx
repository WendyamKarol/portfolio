'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion, easeOut } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { PresetReply } from '@/components/chat/preset-reply';
import { presetReplies } from '@/lib/config-loader';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import HelperBoost from './HelperBoost';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool }: AvatarProps) => {
      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <Image
              src="/avatar.png"
              alt="Avatar"
              width={112}
              height={112}
              className="h-full w-full scale-95 rounded-full object-cover object-[center_top_-5%] mix-blend-multiply dark:mix-blend-normal"
            />
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: easeOut,
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [presetReply, setPresetReply] = useState<{
    question: string;
    reply: string;
    tool: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-locale');
    if (saved === 'fr' || saved === 'en') setLocale(saved);
  }, []);

  const toggleLocale = () => {
    setLocale(l => {
      const next = l === 'fr' ? 'en' : 'fr';
      localStorage.setItem('portfolio-locale', next);
      return next;
    });
  };

  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    stop,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      console.error('Chat error:', error.message, error.cause);
      
      // Handle specific error types
      if (error.message?.includes('quota') || error.message?.includes('exceeded') || error.message?.includes('429')) {
        // Show a friendly notification for quota issues
        toast.error('⚠️ API Quota Exhausted! Free Gemini API limit reached. Please use preset questions or contact via email. Thank you for understanding! 🙏', {
          duration: 6000, // Show for 6 seconds
          style: {
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
        
        // Set error message state for frontend display
        setErrorMessage('quota_exhausted');
        
        // Try to add a chat bubble with the error message
        try {
          append({
            role: 'assistant',
            content: '⚠️ **API Quota Exhausted**\n\nFree Gemini API limit reached. Please use preset questions below, or reach out directly via email.',
          });
        } catch (appendError) {
          console.error('Failed to append error message:', appendError);
        }
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Error: ${error.message}`);
        setErrorMessage(`Error: ${error.message}`);
      }
    },
    onToolCall: () => {},
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  const submitQuery = useCallback(
    (query: string) => {
      if (!query.trim() || isToolInProgress) return;

      setErrorMessage(null);

      if (presetReplies[query]) {
        const preset = presetReplies[query];
        setPresetReply({
          question: query,
          reply: locale === 'fr' ? (preset.replyFr ?? preset.reply) : preset.reply,
          tool: preset.tool,
        });
        setLoadingSubmit(false);
        return;
      }

      setLoadingSubmit(true);
      setPresetReply(null);
      append({
        role: 'user',
        content: query,
      });
    },
    [append, isToolInProgress, locale]
  );

  const submitQueryToAI = useCallback(
    (query: string) => {
      if (!query.trim() || isToolInProgress) return;

      setErrorMessage(null);
      setLoadingSubmit(true);
      setPresetReply(null);
      append({
        role: 'user',
        content: query,
      });
    },
    [append, isToolInProgress]
  );

  const handlePresetReply = useCallback(
    (question: string, reply: string, tool: string) => {
      setPresetReply({ question, reply, tool });
      setLoadingSubmit(false);
    },
    []
  );

  const handleGetAIResponse = useCallback(
    (question: string) => {
      setPresetReply(null);
      submitQueryToAI(question);
    },
    [submitQueryToAI]
  );

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted, setInput, submitQuery]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || isToolInProgress) return;
      submitQueryToAI(input);
      setInput('');
    },
    [input, isToolInProgress, setInput, submitQueryToAI]
  );

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit && !presetReply && !errorMessage;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {/* Avatar header — sticky within chat section only (not viewport-fixed) */}
      <div className="sticky top-0 z-10 shrink-0 bg-gradient-to-b from-background via-background/90 to-transparent">
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="relative flex items-center justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={hasActiveTool} />
            </ClientOnly>
            <button
              onClick={toggleLocale}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-background/80 text-xs hover:bg-accent transition-colors select-none"
              aria-label="Toggle language"
            >
              <span className={locale === 'fr' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>FR</span>
              <span className="text-muted-foreground">|</span>
              <span className={locale === 'en' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>EN</span>
            </button>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex min-h-0 flex-1 max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding
                  submitQuery={submitQuery}
                  handlePresetReply={handlePresetReply}
                  locale={locale}
                />
              </motion.div>
            ) : presetReply ? (
              <div className="pb-4">
                <PresetReply
                  question={presetReply.question}
                  reply={presetReply.reply}
                  tool={presetReply.tool}
                  onGetAIResponse={handleGetAIResponse}
                  onClose={() => setPresetReply(null)}
                  locale={locale}
                />
              </div>
            ) : errorMessage ? (
              <motion.div
                key="error"
                {...MOTION_CONFIG}
                className="px-4 pt-4"
              >
                <ChatBubble variant="received">
                  <ChatBubbleMessage className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                          <span className="text-white text-lg">⚠️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                            API Quota Exhausted
                          </h3>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Free Gemini API limit reached
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                        <p>
                          Hi! I&apos;m currently using the{' '}
                          <strong>free version</strong> of Google&apos;s Gemini API, and
                          today&apos;s quota has been reached.
                        </p>
                        
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mt-3">
                          <p className="font-medium mb-2">What you can do:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Contact me directly for a live demo</li>
                            <li>Use the preset questions below for instant responses</li>
                            <li>Come back tomorrow when the quota resets</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setErrorMessage(null);
                            const preset = presetReplies["How can I reach you?"];
                            if (preset) {
                              setPresetReply({
                                question: "How can I reach you?",
                                reply: locale === 'fr' ? (preset.replyFr ?? preset.reply) : preset.reply,
                                tool: preset.tool
                              });
                            }
                          }}
                          className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors font-medium"
                        >
                          Contact me
                        </button>
                        <button
                          onClick={() => {
                            setErrorMessage(null);
                            window.location.href = '/';
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Use Presets
                        </button>
                      </div>
                      
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-3">
                        Thank you for your patience! 🙏
                      </p>
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                  locale={locale}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-background px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost
              submitQuery={submitQuery}
              handlePresetReply={handlePresetReply}
              locale={locale}
            />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
              locale={locale}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
