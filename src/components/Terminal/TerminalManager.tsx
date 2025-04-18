"use client";
/**
 * 1. Implement session persistence using local storage to retain sessions across page reloads.
2. Add a notification system to inform users when the maximum session limit is reached.
3. Allow users to customize the IP address generation logic for more control over session configurations.
 */
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../../context";
import { CommandResult } from "../../hooks/useSocket";
import Terminal from "./Terminal";
import ThemeSelector from "./ThemeSelector";

interface TerminalSession {
  id: string;
  name: string;
  ipAddress: string;
  initialMessages?: CommandResult[];
}

interface TerminalManagerProps {
  initialSessions?: TerminalSession[];
  maxSessions?: number;
}

const TerminalManager: React.FC<TerminalManagerProps> = ({
  initialSessions = [],
  maxSessions = 4,
}) => {
  // Generate a default session if none provided
  const defaultSessions: TerminalSession[] =
    initialSessions.length > 0
      ? initialSessions
      : [
          {
            id: `term-${Date.now()}`,
            name: "Main Terminal",
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            initialMessages: [
              {
                type: "info",
                content: "Welcome to the Terminal! Connection to server may be pending...",
                timestamp: new Date().toISOString(),
              },
            ],
          },
        ];

  const [sessions, setSessions] = useState<TerminalSession[]>(defaultSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(
    defaultSessions[0].id,
  );

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

    const newSession: TerminalSession = {
      id: `term-${Date.now()}`,
      name: `Terminal ${sessions.length + 1}`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
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

  // Rename a terminal session
  const _renameSession = (id: string, newName: string) => {
    setSessions(
      sessions.map((session) =>
        session.id === id ? { ...session, name: newName } : session,
      ),
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
              >
                + New Terminal
              </button>
            )}
          </div>

          {/* Theme Selector */}
          <div className="flex items-center px-2">
            <ThemeSelector minimal />
          </div>
        </div>

        {/* Active Terminal Instance */}
        <div className="terminal-container flex-grow">
          <Terminal
            key={activeSession.id}
            ipAddress={activeSession.ipAddress}
            initialMessages={activeSession.initialMessages}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TerminalManager;
