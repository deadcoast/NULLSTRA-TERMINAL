/**
 * Browser Compatibility Utility
 *
 * This utility helps detect browser capabilities, optimizations, and performance
 * characteristics to ensure optimal performance across different browsers.
 */

/**
 * Browser detection result
 */
export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  os: string;
  mobile: boolean;
  tablet: boolean;
  capabilities: BrowserCapabilities;
}

/**
 * Browser capabilities and feature support
 */
export interface BrowserCapabilities {
  webGL: boolean;
  webGL2: boolean;
  webAssembly: boolean;
  webWorker: boolean;
  sharedWorker: boolean;
  serviceWorker: boolean;
  webRTC: boolean;
  webVR: boolean;
  webXR: boolean;
  touchEvents: boolean;
  pointerEvents: boolean;
  passiveEvents: boolean;
  offscreenCanvas: boolean;
  transform3D: boolean;
  webpSupport: boolean;
  avifSupport: boolean;
  css: CSSSupport;
  api: APISupport;
}

/**
 * CSS feature support
 */
export interface CSSSupport {
  grid: boolean;
  flexbox: boolean;
  customProperties: boolean;
  transforms: boolean;
  animations: boolean;
  filters: boolean;
  containment: boolean;
  willChange: boolean;
}

/**
 * API support
 */
export interface APISupport {
  intersection: boolean;
  resize: boolean;
  mutationObserver: boolean;
  performance: boolean;
  perfObserver: boolean;
  deviceMemory: boolean;
  hardwareConcurrency: boolean;
  effectiveCpuType: string | null;
  batteryOptimized: boolean;
}

/**
 * Performance characteristics for the current browser
 */
export interface BrowserPerformance {
  fps: number;
  renderTime: number;
  memoryUsage: number | null;
  cpuUtilization: number | null;
  batteryAware: boolean;
  throttled: boolean;
  optimizationLevel: "high" | "medium" | "low";
  deviceTier: "high-end" | "mid-range" | "low-end";
}

/**
 * Detect current browser information
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const browsers = [
    { name: "Edge", regex: /Edg(?:e|A|iOS)\/(\d+)/ },
    { name: "Chrome", regex: /(?:Chrome|CriOS)\/(\d+)/ },
    { name: "Firefox", regex: /(?:Firefox|FxiOS)\/(\d+)/ },
    { name: "Safari", regex: /Version\/(\d+).*Safari/ },
    { name: "Samsung", regex: /SamsungBrowser\/(\d+)/ },
    { name: "Opera", regex: /(?:Opera|OPR)\/(\d+)/ },
    { name: "IE", regex: /MSIE (\d+)|Trident.*rv:(\d+)/ },
  ];

  let browserName = "Unknown";
  let browserVersion = "Unknown";

  for (const browser of browsers) {
    const match = ua.match(browser.regex);
    if (match) {
      browserName = browser.name;
      browserVersion = match[1] || match[2] || "Unknown";
      break;
    }
  }

  // Detect engine
  let engine = "Unknown";
  if (ua.includes("Gecko/")) engine = "Gecko";
  else if (ua.includes("AppleWebKit/")) engine = "WebKit";
  else if (ua.includes("Trident/")) engine = "Trident";
  else if (ua.includes("Presto/")) engine = "Presto";

  // Detect OS
  let os = "Unknown";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

  // Detect device type
  const mobile =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const tablet = /iPad|Android(?!.*Mobile)/i.test(ua);

  return {
    name: browserName,
    version: browserVersion,
    engine,
    os,
    mobile,
    tablet,
    capabilities: detectCapabilities(),
  };
}

/**
 * Detect browser capabilities and feature support
 */
function detectCapabilities(): BrowserCapabilities {
  const css = detectCSSSupport();
  const api = detectAPISupport();

  return {
    webGL: !!window.WebGLRenderingContext,
    webGL2: !!window.WebGL2RenderingContext,
    webAssembly: typeof WebAssembly === "object",
    webWorker: typeof Worker === "function",
    sharedWorker: typeof SharedWorker === "function",
    serviceWorker: "serviceWorker" in navigator,
    webRTC: !!window.RTCPeerConnection,
    webVR: "getVRDisplays" in navigator,
    webXR: "xr" in navigator,
    touchEvents: "ontouchstart" in window,
    pointerEvents: !!window.PointerEvent,
    passiveEvents: detectPassiveEvents(),
    offscreenCanvas: typeof OffscreenCanvas === "function",
    transform3D: css.transforms && detectTransform3DSupport(),
    webpSupport: false, // Will be tested asynchronously
    avifSupport: false, // Will be tested asynchronously
    css,
    api,
  };
}

/**
 * Detect CSS feature support
 */
function detectCSSSupport(): CSSSupport {
  const div = document.createElement("div");

  return {
    grid: "grid-template-columns" in div.style,
    flexbox: "flexBasis" in div.style || "WebkitFlexBasis" in div.style,
    customProperties: CSS && CSS.supports && CSS.supports("--a", "0"),
    transforms: "transform" in div.style || "WebkitTransform" in div.style,
    animations: "animation" in div.style || "WebkitAnimation" in div.style,
    filters: "filter" in div.style || "WebkitFilter" in div.style,
    containment: "contain" in div.style,
    willChange: "willChange" in div.style,
  };
}

/**
 * Detect API support
 */
function detectAPISupport(): APISupport {
  return {
    intersection: "IntersectionObserver" in window,
    resize: "ResizeObserver" in window,
    mutationObserver: "MutationObserver" in window,
    performance: "performance" in window,
    perfObserver: "PerformanceObserver" in window,
    deviceMemory: "deviceMemory" in navigator,
    hardwareConcurrency: "hardwareConcurrency" in navigator,
    effectiveCpuType: estimateCpuType(),
    batteryOptimized: detectBatteryOptimization(),
  };
}

/**
 * Detect if transform 3D is supported
 */
function detectTransform3DSupport(): boolean {
  const el = document.createElement("div");
  const has3d = "webkitPerspective" in el.style || "perspective" in el.style;
  if (has3d && "WebkitPerspective" in el.style) {
    // Confirm 3D support for WebKit
    const styleSheet = document.createElement("style");
    styleSheet.textContent =
      "@media (transform-3d), (-webkit-transform-3d) { #test3d { height: 3px } }";
    document.head.appendChild(styleSheet);

    el.id = "test3d";
    document.body.appendChild(el);
    const { height } = window.getComputedStyle(el);
    document.body.removeChild(el);
    styleSheet.remove();

    return height === "3px";
  }
  return has3d;
}

/**
 * Detect if passive event listeners are supported
 */
function detectPassiveEvents(): boolean {
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
        return true;
      },
    });
    const noop = () => {};
    window.addEventListener("testpassive", noop, opts);
    window.removeEventListener("testpassive", noop, opts);
  } catch (e) {}
  return supportsPassive;
}

/**
 * Estimate CPU type based on browser and device information
 */
function estimateCpuType(): string | null {
  if (!("hardwareConcurrency" in navigator)) return null;

  const cores = navigator.hardwareConcurrency;

  if (cores <= 2) return "low-end";
  if (cores <= 4) return "mid-range";
  if (cores <= 8) return "high-end";
  return "very-high-end";
}

/**
 * Detect if browser uses battery optimization
 */
function detectBatteryOptimization(): boolean {
  if (!("getBattery" in navigator)) return false;

  // The actual implementation would need to test battery status changes,
  // but this is a simplified version
  return true;
}

/**
 * Test image format support
 */
export async function testImageSupport(): Promise<{
  webp: boolean;
  avif: boolean;
}> {
  const supportsWebP = await testImageFormat(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",
  );
  const supportsAvif = await testImageFormat(
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=",
  );

  return { webp: supportsWebP, avif: supportsAvif };
}

/**
 * Test if an image format is supported
 */
async function testImageFormat(data: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = data;
  });
}

/**
 * Measure browser performance characteristics
 */
export async function measureBrowserPerformance(): Promise<BrowserPerformance> {
  let fps = 60; // Default estimate
  let renderTime = 0;

  // Measure real FPS
  fps = await measureFPS();

  // Measure render time
  renderTime = await measureRenderTime();

  // Get memory usage if available
  let memoryUsage = null;
  if (performance && (performance as any).memory) {
    memoryUsage = (performance as any).memory.usedJSHeapSize / (1024 * 1024); // MB
  }

  // Estimate CPU utilization
  const cpuUtilization = null;

  // Battery awareness
  const batteryAware = "getBattery" in navigator;

  // Estimate throttling
  const throttled = fps < 56; // Browsers usually throttle at ~60fps, so below 56 might indicate throttling

  // Get device tier and optimization level
  const browserInfo = detectBrowser();
  const deviceTier = estimateDeviceTier(browserInfo);
  const optimizationLevel = getOptimizationLevel(
    browserInfo,
    deviceTier,
    throttled,
  );

  return {
    fps,
    renderTime,
    memoryUsage,
    cpuUtilization,
    batteryAware,
    throttled,
    optimizationLevel,
    deviceTier,
  };
}

/**
 * Measure actual FPS
 */
async function measureFPS(): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    const lastTime = performance.now();

    function countFrame() {
      frameCount++;
      const now = performance.now();

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        resolve(fps);
        return;
      }

      requestAnimationFrame(countFrame);
    }

    requestAnimationFrame(countFrame);
  });
}

/**
 * Measure render time for a simple element
 */
async function measureRenderTime(): Promise<number> {
  return new Promise((resolve) => {
    // Create a test div with some relatively heavy styles
    const div = document.createElement("div");
    div.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, red, blue);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      transform: rotate(45deg);
      opacity: 0.8;
    `;

    // Measure rendering time
    const start = performance.now();

    document.body.appendChild(div);

    // Force a layout recalculation
    div.getBoundingClientRect();

    const end = performance.now();
    document.body.removeChild(div);

    resolve(end - start);
  });
}

/**
 * Estimate device tier based on browser information
 */
function estimateDeviceTier(
  info: BrowserInfo,
): "high-end" | "mid-range" | "low-end" {
  // Mobile devices are considered lower tier
  if (info.mobile && !info.tablet) {
    return "low-end";
  }

  // Use CPU information as a primary indicator
  if (info.capabilities.api.effectiveCpuType === "very-high-end")
    return "high-end";
  if (info.capabilities.api.effectiveCpuType === "high-end") return "high-end";
  if (info.capabilities.api.effectiveCpuType === "mid-range")
    return "mid-range";
  if (info.capabilities.api.effectiveCpuType === "low-end") return "low-end";

  // Tablets are generally mid-range
  if (info.tablet) return "mid-range";

  // Default to mid-range for desktop browsers with unknown specs
  return "mid-range";
}

/**
 * Determine optimization level based on browser info and device tier
 */
function getOptimizationLevel(
  info: BrowserInfo,
  deviceTier: "high-end" | "mid-range" | "low-end",
  isThrottled: boolean,
): "high" | "medium" | "low" {
  // Low-end devices or throttled browsers need higher optimization
  if (deviceTier === "low-end" || isThrottled) {
    return "high";
  }

  // Mid-range devices need medium optimization
  if (deviceTier === "mid-range") {
    return "medium";
  }

  // High-end devices can use lower optimization
  return "low";
}

/**
 * Get browser-specific optimization recommendations
 */
export function getOptimizationRecommendations(
  info: BrowserInfo,
  performance: BrowserPerformance,
): string[] {
  const recommendations: string[] = [];

  // General recommendations
  if (performance.optimizationLevel === "high") {
    recommendations.push("Disable non-essential visual effects");
    recommendations.push("Use simpler CSS layouts");
    recommendations.push("Reduce animation complexity");
    recommendations.push("Implement more aggressive code splitting");
  }

  // Browser-specific recommendations
  if (info.name === "Safari") {
    recommendations.push(
      "Use transform: translateZ(0) for hardware acceleration",
    );
    recommendations.push("Be cautious with fixed positioning and large images");
  } else if (info.name === "Firefox") {
    recommendations.push("Minimize DOM manipulations");
    recommendations.push("Use CSS containment for better isolation");
  } else if (info.name === "Edge" || info.name === "Chrome") {
    recommendations.push("Leverage CSS contain and will-change properties");
    recommendations.push("Use requestAnimationFrame for smoother animations");
  } else if (info.name === "IE") {
    recommendations.push("Avoid CSS Grid and modern features");
    recommendations.push("Minimize JavaScript execution");
  }

  // Mobile-specific recommendations
  if (info.mobile) {
    recommendations.push("Implement touch-specific interactions");
    recommendations.push("Optimize for portrait orientation");
    recommendations.push("Reduce network payload size");
  }

  return recommendations;
}

/**
 * Run a comprehensive browser compatibility test suite
 */
export async function runCompatibilityTests(): Promise<{
  browser: BrowserInfo;
  performance: BrowserPerformance;
  imageSupport: { webp: boolean; avif: boolean };
  recommendations: string[];
}> {
  // Detect browser info
  const browserInfo = detectBrowser();

  // Test image support
  const imageSupport = await testImageSupport();

  // Update image support info in browser capabilities
  browserInfo.capabilities.webpSupport = imageSupport.webp;
  browserInfo.capabilities.avifSupport = imageSupport.avif;

  // Measure performance
  const performanceMetrics = await measureBrowserPerformance();

  // Get recommendations
  const recommendations = getOptimizationRecommendations(
    browserInfo,
    performanceMetrics,
  );

  return {
    browser: browserInfo,
    performance: performanceMetrics,
    imageSupport,
    recommendations,
  };
}

export default {
  detectBrowser,
  measureBrowserPerformance,
  testImageSupport,
  runCompatibilityTests,
  getOptimizationRecommendations,
};
