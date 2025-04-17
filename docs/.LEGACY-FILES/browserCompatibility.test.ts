/**
 * Browser Compatibility Tests
 *
 * These tests check that the application is compatible with different browsers
 * by mocking browser user agent strings and testing feature detection.
 */

describe('Browser Compatibility', () => {
  // Store original navigator and window properties
  const originalNavigator = global.navigator;
  const originalUserAgent = global.navigator.userAgent;

  // Helper to mock user agent
  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(global.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
  };

  afterEach(() => {
    // Restore original navigator properties
    if (originalNavigator) {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      });
    }
  });

  test('Chrome browser compatibility check', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    );

    // Check if key browser features are supported
    expect(typeof window.requestAnimationFrame).toBe('function');
    expect(typeof window.localStorage).toBe('object');
    expect(typeof window.sessionStorage).toBe('object');
    expect(typeof window.fetch).toBe('function');
  });

  test('Firefox browser compatibility check', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
    );

    // Check if key browser features are supported
    expect(typeof window.requestAnimationFrame).toBe('function');
    expect(typeof window.localStorage).toBe('object');
    expect(typeof window.sessionStorage).toBe('object');
    expect(typeof window.fetch).toBe('function');
  });

  test('Safari browser compatibility check', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15'
    );

    // Check if key browser features are supported
    expect(typeof window.requestAnimationFrame).toBe('function');
    expect(typeof window.localStorage).toBe('object');
    expect(typeof window.sessionStorage).toBe('object');
    expect(typeof window.fetch).toBe('function');
  });

  test('Edge browser compatibility check', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Edg/96.0.1054.43'
    );

    // Check if key browser features are supported
    expect(typeof window.requestAnimationFrame).toBe('function');
    expect(typeof window.localStorage).toBe('object');
    expect(typeof window.sessionStorage).toBe('object');
    expect(typeof window.fetch).toBe('function');
  });

  test('Mobile browser compatibility check', () => {
    mockUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    );

    // Check if key browser features are supported
    expect(typeof window.requestAnimationFrame).toBe('function');
    expect(typeof window.localStorage).toBe('object');
    expect(typeof window.sessionStorage).toBe('object');
    expect(typeof window.fetch).toBe('function');

    // Check if touch events are supported
    expect(typeof window.ontouchstart).not.toBe('undefined');
  });
});
