import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Preventivatore Benifin',
  description: 'Crea, modifica ed esporta preventivi Benifin mantenendo la grafica originale.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body>{children}</body></html>;
}
