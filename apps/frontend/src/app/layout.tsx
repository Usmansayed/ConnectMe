import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConnectMe — Local AI Workspace',
  description: 'Your personal AI command center. ChatGPT, Claude, and Gemini in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen overflow-hidden bg-[#0b0b0c] text-[#f3f4f6] antialiased">
        {children}
      </body>
    </html>
  );
}
