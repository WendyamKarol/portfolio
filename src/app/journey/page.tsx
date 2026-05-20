import type { Metadata } from 'next';
import JourneyView from './JourneyView';

export const metadata: Metadata = {
  title: 'My Journey',
  description:
    "Interactive career map — from Burkina Faso to Paris. Explore Karol Naze's education, internships, and professional path.",
};

export default function JourneyPage() {
  return <JourneyView />;
}
