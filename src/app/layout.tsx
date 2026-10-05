import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roblox Asset AI - Specialized 3D Model & Animation Synthesizer',
  description:
    'Dedicated AI studio for generating, visually inspecting, iteratively correcting, and exporting Roblox-compatible 3D models and animations (.rbxmx / .rbxm).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-studio-950 text-studio-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
