"use client";
/**
 * 1. Implement session persistence using local storage to retain sessions across page reloads.
 * 2. Add a notification system to inform users when the maximum session limit is reached.
 * 3. Allow users to customize the IP address generation logic for more control over session configurations.
 */
import * as React from "react";
const {   useEffect, useState   } = React;

import { ThemeProvider } from "../../context";
import { CommandResult } from "../../hooks/useSocket";

import { SplitDirection } from "./SplitPane";
import SplitTerminal from "./SplitTerminal";
import Terminal from "./Terminal";
import ThemeSelector from "./ThemeSelector";

interface TerminalSession {
  id: string;
  name: string;
  ipAddress: string;
  initialMessages?: CommandResult[];
  split?: {
    enabled: boolean;
    direction: SplitDirection;
    secondaryIpAddress?: string;
  };
}

interface TerminalManagerProps {
  initialSessions?: TerminalSession[];
  maxSessions?: number;
}

const TerminalManager: React.FC<TerminalManagerProps> = ({
  initialSessions = [],
  maxSessions = 4,
}) => {
  // Create a default session with placeholder IP
  const defaultSessions: TerminalSession[] =
    initialSessions.length > 0
      ? initialSessions
      : [
          {
            id: `term-${Date.now()}`,
            name: "Main Terminal",
            ipAddress: "", // Start with empty IP address
            initialMessages: [
              {
                type: "info",
                content:
                  "Welcome to the Terminal! Connection to server may be pending...",
                timestamp: new Date().toISOString(),
              },
            ],
            split: {
              enabled: false,
              direction: "horizontal",
            },
          },
        ];

  const [sessions, setSessions] = useState<TerminalSession[]>(defaultSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(
    defaultSessions[0].id,
  );

  // Generate random IPs only on the client-side
  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    // Add random IP addresses to sessions that don't have one
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (!session.ipAddress) {
          const updatedSession = {
            ...session,
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
              Math.random() * 255,
            )}`,
          };

          // Generate a secondary IP for split session if needed
          if (session.split?.enabled && !session.split.secondaryIpAddress) {
            updatedSession.split = {
              enabled: true,
              direction: session.split.direction,
              secondaryIpAddress: `192.168.${Math.floor(
                Math.random() * 255,
              )}.${Math.floor(Math.random() * 255)}`,
            };
          }

          return updatedSession;
        }
        return session;
      }),
    );
  }, []);

  // Log initial rendering for debugging
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("TerminalManager mounted with sessions:", sessions);
  }, [sessions]);

  // Create a new terminal session
  const createSession = () => {
    if (sessions.length >= maxSessions) {
      // Maybe show a notification that max sessions reached
      return;
    }

    // Create session with IP only on client side
    const newSession: TerminalSession = {
      id: `term-${Date.now()}`,
      name: `Terminal ${sessions.length + 1}`,
      ipAddress:
        typeof window !== "undefined"
          ? `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
              Math.random() * 255,
            )}`
          : "",
      split: {
        enabled: false,
        direction: "horizontal",
      },
    };

    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
  };

  // Close a terminal session
  const closeSession = (id: string) => {
    // Don't allow closing the last session
    if (sessions.length <= 1) {
      return;
    }

    const newSessions = sessions.filter((session) => session.id !== id);
    setSessions(newSessions);

    // If the active session was closed, activate another one
    if (activeSessionId === id) {
      setActiveSessionId(newSessions[0].id);
    }
  };

  // Split the current terminal
  const splitTerminal = (
    id: string,
    direction: SplitDirection = "horizontal",
  ) => {
    setSessions(
      sessions.map((session) => {
        if (session.id === id) {
          return {
            ...session,
            split: {
              enabled: true,
              direction,
              secondaryIpAddress: `192.168.${Math.floor(
                Math.random() * 255,
              )}.${Math.floor(Math.random() * 255)}`,
            },
          };
        }
        return session;
      }),
    );
  };

  // Close a split terminal
  const closeSplit = (id: string) => {
    setSessions(
      sessions.map((session) => {
        if (session.id === id && session.split?.enabled) {
          return {
            ...session,
            split: {
              ...session.split,
              enabled: false,
            },
          };
        }
        return session;
      }),
    );
  };

  // Toggle split direction
  const toggleSplitDirection = (id: string) => {
    setSessions(
      sessions.map((session) => {
        if (session.id === id && session.split?.enabled) {
          return {
            ...session,
            split: {
              ...session.split,
              direction:
                session.split.direction === "horizontal"
                  ? "vertical"
                  : "horizontal",
            },
          };
        }
        return session;
      }),
    );
  };

  // Get the active session
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) || sessions[0];

  return (
    <ThemeProvider>
      <div className="terminal-manager h-full flex flex-col">
        {/* Terminal Tabs and Controls */}
        <div className="terminal-tabs flex bg-night border-b border-shocking-pink text-xs justify-between">
          <div className="flex">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  terminal-tab cursor-pointer py-1 px-3 mr-1 flex items-center
                  ${
                    session.id === activeSessionId
                      ? "bg-lime text-night font-bold"
                      : "bg-night border border-lime text-lime"
                  }
                `}
                onClick={() => setActiveSessionId(session.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveSessionId(session.id);
                    e.preventDefault();
                  }
                }}
                role="tab"
                tabIndex={0}
                aria-selected={session.id === activeSessionId}
              >
                <span className="mr-2">
                  {session.id === activeSessionId ? "⚡" : "•"}
                </span>
                <span>{session.name}</span>
                {sessions.length > 1 && (
                  <button
                    className="ml-2 text-xs opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent activating the tab
                      closeSession(session.id);
                    }}
                    aria-label={`Close ${session.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Add Tab Button */}
            {sessions.length < maxSessions && (
              <button
                className="terminal-tab-add py-1 px-2 text-lime hover:text-white"
                onClick={createSession}
                aria-label="Create new terminal"
              >
                + New Terminal
              </button>
            )}
          </div>

          {/* Terminal Controls */}
          <div className="flex items-center px-2 space-x-2">
            {/* Split Terminal Controls */}
            <div className="flex items-center space-x-1">
              {!activeSession.split?.enabled ? (
                <>
                  <button
                    className="terminal-control-btn text-lime hover:text-white px-2"
                    onClick={() =>
                      splitTerminal(activeSession.id, "horizontal")
                    }
                    title="Split horizontally (Alt+Shift+H)"
                    aria-label="Split terminal horizontally"
                  >
                    ↔
                  </button>
                  <button
                    className="terminal-control-btn text-lime hover:text-white px-2"
                    onClick={() => splitTerminal(activeSession.id, "vertical")}
                    title="Split vertically (Alt+Shift+V)"
                    aria-label="Split terminal vertically"
                  >
                    ↕
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="terminal-control-btn text-lime hover:text-white px-2"
                    onClick={() => toggleSplitDirection(activeSession.id)}
                    title={`Switch to ${
                      activeSession.split.direction === "horizontal"
                        ? "vertical"
                        : "horizontal"
                    } split`}
                    aria-label={`Switch to ${
                      activeSession.split.direction === "horizontal"
                        ? "vertical"
                        : "horizontal"
                    } split`}
                  >
                    {activeSession.split.direction === "horizontal"
                      ? "↕"
                      : "↔"}
                  </button>
                  <button
                    className="terminal-control-btn text-lime hover:text-white px-2"
                    onClick={() => closeSplit(activeSession.id)}
                    title="Close split view"
                    aria-label="Close split view"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>

            {/* Theme Selector */}
            <ThemeSelector minimal />
          </div>
        </div>

        {/* Active Terminal Instance */}
        <div className="terminal-container flex-grow">
          {activeSession.split?.enabled ? (
            <SplitTerminal
              direction={activeSession.split.direction}
              terminals={[
                {
                  ipAddress: activeSession.ipAddress,
                  initialMessages: activeSession.initialMessages,
                  title: `${activeSession.name} (1)`,
                },
                {
                  ipAddress: activeSession.split.secondaryIpAddress,
                  title: `${activeSession.name} (2)`,
                },
              ]}
              syncScroll={true}
            />
          ) : (
            <Terminal
              key={activeSession.id}
              ipAddress={activeSession.ipAddress}
              initialMessages={activeSession.initialMessages}
              title={activeSession.name}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TerminalManager;
