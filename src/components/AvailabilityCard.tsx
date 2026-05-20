'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe, Briefcase, FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AvailabilityData {
  availability: string;
  preferences: {
    contractTypes?: string[];
    roles?: string[];
    workMode: string;
    location: string;
    focusAreas?: string[];
  };
  experience: {
    freelanceWork: string;
    recentRoles?: string[];
    projectHighlights?: string[];
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  achievements: string[];
  lookingFor: {
    goals?: string;
    workStyle?: string;
    motivation?: string;
    interests?: string[];
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

interface AvailabilityCardProps {
  data?: AvailabilityData;
}

const AvailabilityCard = ({ data }: AvailabilityCardProps) => {
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/?query=How can I reach you?');
  };

  const handleResumeClick = () => {
    router.push('/?query=Can I see your resume?');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-md">
            <Image
              src="/profile2.png"
              alt="Karol Naze"
              width={64}
              height={64}
              className="h-full w-full scale-95 object-cover object-[center_top_-5%]"
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">
              Karol Naze
            </h2>
            <p className="text-muted-foreground text-sm">
              Software Engineer &middot; Full-stack &middot; AI
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 sm:mt-0 sm:items-end">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Available Now
          </span>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            CDI &middot; CDD &middot; Freelance
          </p>
        </div>
      </div>

      {/* Availability Highlight */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Current Availability</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Status</p>
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
              {data?.availability || "Available immediately"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Contract types</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              {data?.preferences?.contractTypes?.join(', ') || 'CDI, CDD, Freelance'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Work mode</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
              {data?.preferences?.workMode || 'Remote or On-site'}
            </p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Target roles</p>
            <p className="text-muted-foreground text-sm">
              {data?.preferences?.roles?.join(', ') || 'Software Engineer, Full-stack Developer, AI Engineer, Backend Developer'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              {data?.preferences?.location || 'Paris, France — open to relocation'}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Key technologies</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="list-disc pl-4">
                {data?.skills?.technical?.slice(0, 4).map((skill, index) => (
                  <li key={index}>{skill}</li>
                )) || (
                  <>
                    <li>Python, C, C++, Java, JavaScript, TypeScript</li>
                    <li>FastAPI, Flask, Django, Node.js, NestJS</li>
                    <li>React.js, Angular, HTML/CSS</li>
                    <li>PostgreSQL, MongoDB, TypeORM</li>
                  </>
                )}
              </ul>
              <ul className="list-disc pl-4">
                {data?.skills?.technical?.slice(4, 8).map((skill, index) => (
                  <li key={index}>{skill}</li>
                )) || (
                  <>
                    <li>PyTorch, TensorFlow, Scikit-learn, OpenCV</li>
                    <li>LangChain, LangGraph, OpenAI API</li>
                    <li>AWS, Azure, Docker, Kubernetes</li>
                    <li>Git, CI/CD, GitHub Actions</li>
                  </>
                )}
                <li>
                  <Link
                    href="/?query=What%20are%20your%20skills%3F"
                    className="cursor-pointer items-center text-blue-500 hover:underline"
                  >
                    See all skills
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I bring */}
      <div className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">
          What I bring
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {data?.lookingFor?.workStyle || 'I work quickly and know how to set priorities based on the needs of my team and employer. I keep a positive attitude, stay flexible, and adapt well to change. I have the technical knowledge to solve problems and the ability to pick up new tools fast — I can learn quickly, fit into a team, and deliver solutions that work.'}
        </p>
      </div>

      {/* Goals */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goals</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {data?.lookingFor?.goals || "I'm looking to join a software engineering team or take on freelance missions where I can build reliable backend systems, contribute to impactful applications, and apply my skills in AI and cloud technologies. I want to keep learning and improving, while working on meaningful projects."}
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={handleContactClick}
          className="cursor-pointer rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors duration-300 hover:bg-primary/80 flex items-center gap-2"
        >
          Contact me
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={handleResumeClick}
          className="cursor-pointer rounded-full border border-border bg-card px-6 py-3 font-semibold text-foreground transition-colors duration-300 hover:bg-accent flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View resume
        </button>
      </div>
    </motion.div>
  );
};

export default AvailabilityCard;
