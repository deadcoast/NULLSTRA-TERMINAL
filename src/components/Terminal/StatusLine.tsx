/**
 * 1. Add type annotations for `ipAddress` and `networkActive` in the function parameters to ensure type safety.  
2. Use `useMemo` for formatting the date and time strings to optimize performance and avoid unnecessary re-renders.  
3. Consider adding a cleanup function to clear the interval in case the component unmounts to prevent memory leaks.  
 */
import React, { useEffect, useState } from 'react';

interface StatusLineProps {
  ipAddress: string;
  networkActive?: boolean;
}

const StatusLine: React.FC<StatusLineProps> = ({
  ipAddress,
  networkActive = false,
}) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const dateStr = now.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });

      setTime(timeStr);
      setDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between text-xs mt-2 border-t border-terminal-green border-opacity-30 pt-1">
      <div
        className={`text-terminal-magenta ${networkActive ? 'network-active' : ''}`}
      >
        &lt;{ipAddress}&gt;
      </div>
      <div className="text-terminal-cyan">
        {time} | {date}
      </div>
    </div>
  );
};

export default StatusLine;
