'use client';
/* 1. Add type annotations for the `Home` function to ensure type safety: `export default function Home(): JSX.Element {}`.
 * 2. Use environment variables for the `ipAddress` to enhance security and flexibility.
 * 3. Implement error handling for the `Terminal` component to manage potential rendering issues.
 * 4. Add a `useEffect` hook to handle the `ipAddress` change and update the URL when the `ipAddress` prop is updated.
 * 5. Implement a `useState` hook to manage the `showTerminal` state for dynamic visibility.
 * 6. Add a toggle button to allow users to show or hide the terminal dynamically.
 */
import Terminal from '../components/Terminal';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Terminal ipAddress="192.168.1.1" showHeader={true} showStatus={true} />
    </main>
  );
}
