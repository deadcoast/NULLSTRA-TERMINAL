import {
  formatIpAddress,
  formatTimestamp,
  generateRandomError,
  glitchText,
} from '../effectsHelper';

// Mock functions that require browser APIs
jest.mock('../effectsHelper', () => {
  const originalModule = jest.requireActual('../effectsHelper');
  return {
    ...originalModule,
    generateNoise: jest.fn(() => 'mock-data-url'),
    simulateConnectionIssue: jest.fn(() => Promise.resolve()),
  };
});

describe('effectsHelper utilities', () => {
  describe('glitchText', () => {
    test('should return a string of the same length as input', () => {
      const input = 'Test String';
      const result = glitchText(input);
      expect(result.length).toBe(input.length);
    });

    test('should not return the exact same string every time (random element)', () => {
      const input = 'A'.repeat(1000); // Long string to ensure high probability of difference
      const result1 = glitchText(input);
      const result2 = glitchText(input);

      // With 1000 characters and 5% glitch chance, the probability of getting
      // the exact same result twice is extremely low
      expect(result1).not.toBe(result2);
    });
  });

  describe('generateRandomError', () => {
    test('should return a non-empty string', () => {
      const result = generateRandomError();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return a string that starts with [FAIL] or [WARN]', () => {
      const result = generateRandomError();
      expect(result.startsWith('[FAIL]') || result.startsWith('[WARN]')).toBe(
        true
      );
    });
  });

  describe('formatTimestamp', () => {
    test('should return a string in the format HH:MM:SS', () => {
      const result = formatTimestamp();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should return current time', () => {
      // Mock Date constructor
      const realDateNow = Date.now;
      // Jan 1, 2023, 14:30:45
      const mockTimestamp = new Date(2023, 0, 1, 14, 30, 45).getTime();

      Date.now = jest.fn(() => mockTimestamp);

      // Mock new Date() to return fixed date
      const spy = jest.spyOn(global, 'Date').mockImplementation(() => {
        return new Date(mockTimestamp);
      });

      const result = formatTimestamp();
      expect(result).toBe('14:30:45');

      // Restore Date
      spy.mockRestore();
      Date.now = realDateNow;
    });
  });

  describe('formatIpAddress', () => {
    test('should wrap IP address in angle brackets', () => {
      const ip = '192.168.1.1';
      const result = formatIpAddress(ip);
      expect(result).toBe('<192.168.1.1>');
    });

    test('should work with IPv6 addresses', () => {
      const ip = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
      const result = formatIpAddress(ip);
      expect(result).toBe('<2001:0db8:85a3:0000:0000:8a2e:0370:7334>');
    });
  });
});
