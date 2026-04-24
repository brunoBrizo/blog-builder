import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: true,
});

export const fontDisplay = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
});
