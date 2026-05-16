import { Metadata } from 'next';

export const revalidate = 86400; // Revalidate every 24 hours

export const metadata: Metadata = {
  title: 'Live Radio India | Global Streaming',
  description: 'Stream your favorite Indian radio stations live in high quality. Listen to Red FM, Radio Mirchi, Big FM, and more on Ink Auth Radio.',
  keywords: ['live radio', 'indian radio', 'streaming', 'music', 'Red FM', 'Radio Mirchi', 'online radio'],
  openGraph: {
    title: 'Live Radio India | Global Streaming',
    description: 'Stream your favorite Indian radio stations live in high quality.',
    type: 'website',
    url: 'https://inkauth.in/radio',
  },
};

export default function RadioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
