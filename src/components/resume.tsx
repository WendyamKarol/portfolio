'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';
import { Download } from 'lucide-react';
import { resumeDetails as configResumeDetails } from '@/lib/config-loader';

export function Resume() {
  const resumeDetails = {
    title: configResumeDetails.title || "Karol's Resume",
    description: configResumeDetails.description || 'Software Engineer • AI Engineer • Full-stack Developer',
    fileType: configResumeDetails.fileType || 'PDF',
    lastUpdated: configResumeDetails.lastUpdated || '2025',
    fileSize: configResumeDetails.fileSize || '',
    downloadUrl: configResumeDetails.downloadUrl,
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeDetails.downloadUrl;
    link.download = resumeDetails.downloadUrl.split('/').pop() || 'resume.pdf';
    link.click();
  };

  return (
    <div className="mx-auto w-full py-8 font-sans">
      {/* Resume Card */}
      <motion.div
        className="group relative overflow-hidden rounded-xl bg-accent p-0 transition-all duration-300 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, ease: easeOut }}
      >
        {/* Details area */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {resumeDetails.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {resumeDetails.description}
              </p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeDetails.fileType}</span>
                <span className="mx-2">•</span>
                <span>Updated {resumeDetails.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>{resumeDetails.fileSize}</span>
              </div>
            </div>

            {/* Download button */}
            <motion.button
              onClick={handleDownload}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

export default Resume;