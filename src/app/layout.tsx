/* 1. **Add a `<head>` section**: Include a `<head>` element to manage metadata, links to stylesheets, and scripts for better SEO and performance.
 * 2. **Implement error boundaries**: Wrap the `children` with an error boundary to gracefully handle any rendering errors in the child components.
 * 3. **Use a layout context**: Create a context provider to manage global state or theme settings, allowing child components to access shared data easily.
 */
import { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';

const fraktionMono = localFont({
  src: '../fonts/PPFraktionMono-Regular.woff2',
  display: 'swap',
  variable: '--font-terminal'
});

export const metadata: Metadata = {
  title: 'Futuristic Terminal UI',
  description: 'Interactive terminal UI with cyberpunk aesthetics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraktionMono.variable} font-sans h-full`}>
      <body className="antialiased h-full">
        {children}
      </body>
    </html>
  );
}