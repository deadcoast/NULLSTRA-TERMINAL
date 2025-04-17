/**
 * Applies a red terminal text style with hover effect to an element.
 * @param {string} className - The class name to be applied to the element.
 * @returns {void} - No return value.
 * @throws {Error} - Throws an error if the className is not a string.
 */
import '@testing-library/jest-dom';
import FileViewer from '../../FileViewer';

import { render } from '@testing-library/react';

describe('renderContent() renderContent method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should render plain text content correctly', () => {
      // Test description: This test checks if plain text content is rendered correctly without any JSON formatting.
      const content = 'This is a plain text file.';
      const { container } = render(
        <FileViewer
          filename="file.txt"
          content={content}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(container.querySelector('pre')).toHaveTextContent(content);
    });

    it('should render JSON content with syntax highlighting', () => {
      // Test description: This test checks if JSON content is rendered with syntax highlighting.
      const content = '{"key": "value", "number": 123, "boolean": true}';
      const { container } = render(
        <FileViewer
          filename="file.json"
          content={content}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const preElement = container.querySelector('pre');
      expect(preElement).toContainHTML(
        '<span class="text-terminal-yellow">"key"</span>:'
      );
      expect(preElement).toContainHTML(
        '<span class="text-terminal-green">"value"</span>'
      );
      expect(preElement).toContainHTML(
        '<span class="text-terminal-cyan">123</span>'
      );
      expect(preElement).toContainHTML(
        '<span class="text-terminal-cyan">true</span>'
      );
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should handle empty content gracefully', () => {
      // Test description: This test checks if the function handles empty content without errors.
      const content = '';
      const { container } = render(
        <FileViewer
          filename="empty.txt"
          content={content}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(container.querySelector('pre')).toHaveTextContent(content);
    });

    it('should handle malformed JSON content without crashing', () => {
      // Test description: This test checks if the function handles malformed JSON content without crashing.
      const content = '{"key": "value", "number": 123, "boolean": true';
      const { container } = render(
        <FileViewer
          filename="malformed.json"
          content={content}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(container.querySelector('pre')).toHaveTextContent(content);
    });

    it('should render JSON content that starts with an array', () => {
      // Test description: This test checks if JSON content that starts with an array is rendered correctly.
      const content = '[{"key": "value"}, {"key2": "value2"}]';
      const { container } = render(
        <FileViewer
          filename="array.json"
          content={content}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const preElement = container.querySelector('pre');
      expect(preElement).toContainHTML(
        '<span class="text-terminal-yellow">"key"</span>:'
      );
      expect(preElement).toContainHTML(
        '<span class="text-terminal-green">"value"</span>'
      );
    });
  });
});
