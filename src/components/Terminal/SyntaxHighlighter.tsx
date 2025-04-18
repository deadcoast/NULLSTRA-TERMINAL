import React from "react";

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  theme?: "dark" | "light";
  showLineNumbers?: boolean;
  className?: string;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  language = "javascript",
  theme = "dark",
  showLineNumbers = false,
  className = "",
}) => {
  // Simple implementation - a real component would use a library like prism or highlight.js
  const lines = code.split("\n");

  return (
    <div className={`syntax-highlighter syntax-${theme} ${className}`}>
      <pre>
        <code className={`language-${language}`}>
          {showLineNumbers
            ? lines.map((line, index) => (
                <div key={index} className="syntax-line">
                  <span className="line-number">{index + 1}</span>
                  <span className="line-content">{line}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
    </div>
  );
};

export default SyntaxHighlighter;
