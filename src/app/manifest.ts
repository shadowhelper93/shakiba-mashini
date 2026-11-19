import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shakiba Mashini — Computer Science PhD Researcher & Data Scientist',
    short_name: 'Shakiba Mashini',
    description:
      'Portfolio of Shakiba Mashini, PhD student in Computer Science at Georgia State University and Research Specialist at Emory University School of Medicine.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#0a0c0c',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
