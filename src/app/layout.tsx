import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  themeColor: '#0a0c0c',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3300',
  ),
  title: 'Shakiba Mashini — Computer Science PhD Researcher & Data Scientist',
  description:
    'Portfolio of Shakiba Mashini, PhD student in Computer Science at Georgia State University and Research Specialist at Emory University School of Medicine specializing in Graph Neural Networks and applied machine learning.',
  authors: [{ name: 'Shakiba Mashini' }],
  keywords: [
    'Shakiba Mashini',
    'Computer Science PhD',
    'Georgia State University',
    'Emory University School of Medicine',
    'Graph Neural Networks',
    'Data Science',
    'Machine Learning',
    'PyTorch',
    'Applied Mathematics',
  ],
  openGraph: {
    type: 'profile',
    siteName: 'Shakiba Mashini',
    title: 'Shakiba Mashini — Computer Science PhD Researcher & Data Scientist',
    description:
      'PhD student in Computer Science at Georgia State University and Research Specialist at Emory University School of Medicine. Researching community-aware graph sparsification, Graph Neural Networks, and biomedical data science.',
    images: ['/assets/aistudio/2026-11-19_15.46.43_6df2cb4a.jpg'],
    firstName: 'Shakiba',
    lastName: 'Mashini',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shakiba Mashini — Computer Science PhD Researcher & Data Scientist',
    description:
      'PhD student in Computer Science at Georgia State University and Research Specialist at Emory University School of Medicine.',
    images: ['/assets/aistudio/2026-11-19_15.46.43_6df2cb4a.jpg'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shakiba Mashini',
  jobTitle: 'PhD Student in Computer Science & Research Specialist',
  description:
    'Computer Science PhD researcher at Georgia State University and Research Specialist at Emory University School of Medicine focused on Graph Neural Networks, applied machine learning, and computational research.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    addressCountry: 'US',
  },
  affiliation: [
    {
      '@type': 'EducationalOrganization',
      name: 'Georgia State University',
    },
    {
      '@type': 'Organization',
      name: 'Emory University School of Medicine',
    },
  ],
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'Georgia State University - J. Mack Robinson College of Business',
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Georgia Institute of Technology',
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Alzahra University',
    },
  ],
  award:
    'First Place Award – Global Engagement, 4th Annual Graduate Conference for Research, Scholarship, and Creative Activity, Georgia State University',
  knowsAbout: [
    'Graph Neural Networks',
    'Community-Aware Graph Sparsification',
    'Data Science',
    'Machine Learning',
    'PyTorch',
    'TensorFlow',
    'AWS SageMaker',
    'Apache Spark',
    'Applied Mathematics',
    'Modkit',
    'Samtools',
  ],
  sameAs: ['https://www.linkedin.com/in/shakiba-mashini-8b5646182/'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <body className="bg-[#000000] font-sans text-white antialiased selection:bg-white selection:text-[#0a0c0c]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
