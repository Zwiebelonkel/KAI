
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KAI: KI Erklärt',
  description: 'Dein interaktiver Lernpfad in die Welt der Künstlichen Intelligenz',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen text-foreground selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
