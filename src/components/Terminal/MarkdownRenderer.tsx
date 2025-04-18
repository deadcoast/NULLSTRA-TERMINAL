import React from "react";

interface MarkdownRendererProps {
  markdown: string;
  darkMode?: boolean;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
  darkMode = true,
  className = "",
}) => {
  // A real implementation would use a library like react-markdown
  // This is a placeholder implementation

  // Very basic markdown-to-HTML conversion
  const renderMarkdown = () => {
    let content = markdown
      // Headers
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`(.*?)`/g, "<code>$1</code>")
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gm, "<li>$1</li>")
      // Paragraphs
      .replace(/^\s*(\n)?(.+)/gm, (m, _, p1) => `<p>${p1}</p>`);

    return { __html: content };
  };

  return (
    <div
      className={`markdown-renderer ${
        darkMode ? "dark" : "light"
      } ${className}`}
      dangerouslySetInnerHTML={renderMarkdown()}
    />
  );
};

export default MarkdownRenderer;
