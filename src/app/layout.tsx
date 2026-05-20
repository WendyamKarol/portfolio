import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Karol Naze - Software Engineer | Full-stack Developer & AI Engineer | Professional Portfolio",
    template: "%s | Karol Naze Portfolio"
  },
  description: "Professional portfolio of Karol Naze - Software Engineer | Full-stack Developer | AI Engineer. Available for full-time opportunities.",
  keywords: [
    "Karol Naze",
    "Full-stack Developer", 
    "Python Developer",
    "AI Engineer",
    "Portfolio",
    "Software Developer",
    "Machine Learning",
    "IoT Developer",
    "Web Development",
    "Next.js",
    "React",
    "FastAPI",
    "Django",
    "Automation",
    "LangChain",
    "Freelancer",
    "AI Chatbot",
    "Professional Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "Internship",
    "Python Automation",
    "Web Scraping",
    "API Development"
  ],
  authors: [
    {
      name: "Karol Naze",
      url: "https://karolnaze.dev",
    },
  ],
  creator: "Karol Naze",
  publisher: "Karol Naze",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://karolnaze.dev",
    title: "Karol Naze - Software Engineer | Full-stack Developer | AI Engineer",
    description: "Professional portfolio of Karol Naze — Software Engineer, Full-stack Developer & AI Engineer. Explore projects, skills, and availability through an AI-powered chat interface.",
    siteName: "Karol Naze Portfolio",
    images: [
      {
        url: "https://karolnaze.dev/portfolio.png",
        width: 1156,
        height: 816,
        alt: "Karol Naze - Software Engineer Portfolio",
        type: "image/png",
      },
    ],
  },
  
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      }
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://karolnaze.dev",
  },
  category: "technology",
  classification: "Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://karolnaze.dev" /> 
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Karol Naze",
              "jobTitle": "Software Engineer | Full-stack Developer | AI Engineer",
              "url": "https://karolnaze.dev",
              "image": "https://karolnaze.dev/profile.png",
              "sameAs": [
                "https://github.com/WendyamKarol",
                "https://linkedin.com/in/karol-naze",
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "Paris Cité University"
              },
              "knowsAbout": [
                "Python Development",
                "AI Engineering",
                "Machine Learning",
                "IoT Systems",
                "Web Development",
                "Automation",
                "Full Stack Development"
              ],
              "description": "Software Engineer & AI Engineer with expertise in building full-stack applications, AI-powered solutions, IoT systems, and automation tools."
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}