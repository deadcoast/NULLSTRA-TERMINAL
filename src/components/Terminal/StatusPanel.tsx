/**
 * 1. Implement a cleanup function in the `useEffect` to prevent memory leaks by ensuring the interval is cleared when the component unmounts.

2. Use a more sophisticated method for simulating metrics, such as a random walk or a predefined pattern, to make the changes in memory, CPU, and disk usage more realistic.

3. Add a visual representation (e.g., progress bars or charts) for memory, CPU, and disk usage to enhance user experience and provide clearer insights into system performance.
 */
import React, { useEffect, useState } from "react";
import StatusTag from "./StatusTag";

interface StatusPanelProps {
  className?: string;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ className = "" }) => {
  const [memoryUsage, setMemoryUsage] = useState<number>(32);
  const [cpuUsage, setCpuUsage] = useState<number>(15);
  const [diskUsage, setDiskUsage] = useState<number>(65);
  const [networkStatus, setNetworkStatus] = useState<
    "online" | "degraded" | "offline"
  >("online");

  // Simulate changing system metrics every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update values
      setMemoryUsage(Math.floor(Math.random() * 40) + 25); // 25-65%
      setCpuUsage(Math.floor(Math.random() * 30) + 5); // 5-35%
      setDiskUsage(Math.floor(Math.random() * 20) + 60); // 60-80%

      // Occasionally change network status
      if (Math.random() < 0.1) {
        // 10% chance
        const statuses: Array<"online" | "degraded" | "offline"> = [
          "online",
          "degraded",
          "offline",
        ];
        setNetworkStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Determine network status type
  const getNetworkStatusType = () => {
    switch (networkStatus) {
      case "online":
        return "success";
      case "degraded":
        return "warning";
      case "offline":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <div
      className={`p-2 border border-terminal-green bg-terminal-black bg-opacity-50 ${className}`}
    >
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-terminal-green mr-2">System Status:</span>

        <StatusTag type="info" autoUpdateInterval={5000}>
          MEM: {memoryUsage}%
        </StatusTag>

        <StatusTag type={cpuUsage > 25 ? "warning" : "success"}>
          CPU: {cpuUsage}%
        </StatusTag>

        <StatusTag
          type={
            diskUsage > 75 ? "error" : diskUsage > 60 ? "warning" : "success"
          }
        >
          DISK: {diskUsage}%
        </StatusTag>

        <StatusTag type={getNetworkStatusType()}>
          NET: {networkStatus.toUpperCase()}
        </StatusTag>
      </div>
    </div>
  );
};

export default StatusPanel;
