import '@testing-library/jest-dom';
import { Glitch } from '../../../UI';
import TableRenderer from '../../TableRenderer';

import { render } from '@testing-library/react';

jest.mock('../../UI', () => ({
  Glitch: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('glitchEffect() glitchEffect method', () => {
  const mockData = {
    headers: ['Name', 'Age', 'Occupation'],
    rows: [
      ['Alice', '30', 'Engineer'],
      ['Bob', '25', 'Designer'],
    ],
  };

  describe('glitchEffect prop', () => {
    it('should render the title with glitch effect when glitchEffect is true', () => {
      // Test to ensure the title is rendered with the Glitch component when glitchEffect is true
      const { getByText } = render(
        <TableRenderer data={mockData} title="Test Title" glitchEffect={true} />
      );

      expect(Glitch).toHaveBeenCalledWith(
        expect.objectContaining({ intensity: 'low' }),
        expect.anything()
      );
      expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('should render the title without glitch effect when glitchEffect is false', () => {
      // Test to ensure the title is rendered without the Glitch component when glitchEffect is false
      const { getByText } = render(
        <TableRenderer
          data={mockData}
          title="Test Title"
          glitchEffect={false}
        />
      );

      expect(Glitch).not.toHaveBeenCalled();
      expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('should render the title without glitch effect when glitchEffect is not provided', () => {
      // Test to ensure the title is rendered without the Glitch component when glitchEffect is not provided
      const { getByText } = render(
        <TableRenderer data={mockData} title="Test Title" />
      );

      expect(Glitch).not.toHaveBeenCalled();
      expect(getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('Happy paths', () => {
    it('should render the table with correct headers and rows', () => {
      // Test to ensure the table is rendered with correct headers and rows
      const { getByText } = render(<TableRenderer data={mockData} />);

      mockData.headers.forEach((header) => {
        expect(getByText(header)).toBeInTheDocument();
      });

      mockData.rows.forEach((row) => {
        row.forEach((cell) => {
          expect(getByText(cell)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty data gracefully', () => {
      // Test to ensure the component handles empty data gracefully
      const emptyData = { headers: [], rows: [] };
      const { container } = render(<TableRenderer data={emptyData} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should handle data with varying row lengths', () => {
      // Test to ensure the component handles data with varying row lengths
      const unevenData = {
        headers: ['Name', 'Age'],
        rows: [['Alice', '30'], ['Bob']],
      };
      const { getByText } = render(<TableRenderer data={unevenData} />);

      expect(getByText('Alice')).toBeInTheDocument();
      expect(getByText('30')).toBeInTheDocument();
      expect(getByText('Bob')).toBeInTheDocument();
    });
  });
});
