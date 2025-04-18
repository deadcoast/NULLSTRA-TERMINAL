import * as React from "react";
import styled from "styled-components";

interface StatusLineProps {
  status?: string;
  connectionStatus?: "connected" | "disconnected" | "connecting";
  cursorPosition?: { line: number; column: number };
  encoding?: string;
  mode?: string;
  className?: string;
}

const StatusLineContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) =>
    theme.colors?.statusBarBackground || "#333"};
  color: ${({ theme }) => theme.colors?.statusBarForeground || "#ddd"};
  padding: 0 8px;
  font-size: 12px;
  height: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors?.border || "#444"};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusIndicator = styled.span<{
  status?: "connected" | "disconnected" | "connecting";
}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  background-color: ${({ status }) =>
    status === "connected"
      ? "#4CAF50"
      : status === "connecting"
      ? "#FFC107"
      : "#F44336"};
  margin-right: 4px;
`;

const StatusLine: React.FC<StatusLineProps> = ({
  status = "Ready",
  connectionStatus = "connected",
  cursorPosition = { line: 1, column: 1 },
  encoding = "UTF-8",
  mode = "Normal",
  className,
}) => {
  return (
    <StatusLineContainer className={className}>
      <LeftSection>
        <div>
          <StatusIndicator status={connectionStatus} />
          {status}
        </div>
        <div>Mode: {mode}</div>
      </LeftSection>
      <RightSection>
        <div>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </div>
        <div>{encoding}</div>
        <div>
          {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </div>
      </RightSection>
    </StatusLineContainer>
  );
};

export default StatusLine;
