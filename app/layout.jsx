import './globals.css';
import AnimatedLayout from './AnimatedLayout';
import ConditionalNavbar from './ConditionalNavbar';

export const metadata = {
  title: 'Harshit Gupta — Portfolio',
  description: 'Hybrid frontend engineer & designer — portfolio with Three.js visuals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,600;1,600&family=Birthstone&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white min-h-screen antialiased">
        {/* Conditional navbar - hidden on /design page */}
        <ConditionalNavbar />

        <main className="app-content">
          <AnimatedLayout>
          {children}
          </AnimatedLayout>
        </main>
      </body>
    </html>
  );
}