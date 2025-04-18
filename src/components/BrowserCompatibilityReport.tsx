import * as React from "react";
const {   useEffect, useState   } = React;

interface BrowserFeature {
  name: string;
  check: () => boolean;
  description: string;
  impact: "critical" | "high" | "medium" | "low";
}

const BrowserCompatibilityReport: React.FC = () => {
  const [features, setFeatures] = useState<
    { feature: BrowserFeature; supported: boolean }[]
  >([]);
  const [compatibilityScore, setCompatibilityScore] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const terminalFeatures: BrowserFeature[] = [
    {
      name: "WebGL",
      check: () => {
        try {
          const canvas = document.createElement("canvas");
          return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") ||
              canvas.getContext("experimental-webgl"))
          );
        } catch (e) {
          return false;
        }
      },
      description: "Used for advanced terminal graphics and effects.",
      impact: "medium",
    },
    {
      name: "LocalStorage",
      check: () => {
        try {
          return !!window.localStorage;
        } catch (e) {
          return false;
        }
      },
      description: "Required for saving terminal configuration and history.",
      impact: "high",
    },
    {
      name: "WebSockets",
      check: () => {
        return "WebSocket" in window;
      },
      description: "Used for real-time terminal updates and connections.",
      impact: "critical",
    },
    {
      name: "Workers",
      check: () => {
        return "Worker" in window;
      },
      description: "Improves performance for complex terminal operations.",
      impact: "medium",
    },
    {
      name: "CSS Grid",
      check: () => {
        return "grid" in document.documentElement.style;
      },
      description: "Used for advanced terminal layouts.",
      impact: "high",
    },
    {
      name: "CSS Custom Properties",
      check: () => {
        return window.CSS && CSS.supports("color", "var(--test)");
      },
      description: "Essential for theme implementation and customization.",
      impact: "high",
    },
    {
      name: "Touch Events",
      check: () => {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
      },
      description: "Enables mobile terminal usage.",
      impact: "medium",
    },
    {
      name: "Clipboard API",
      check: () => {
        return navigator.clipboard !== undefined;
      },
      description: "Used for copy/paste functionality in the terminal.",
      impact: "high",
    },
    {
      name: "IndexedDB",
      check: () => {
        return "indexedDB" in window;
      },
      description: "Used for storing larger terminal datasets and history.",
      impact: "medium",
    },
    {
      name: "CSS Backdrop Filter",
      check: () => {
        return (
          CSS.supports("backdrop-filter", "blur(10px)") ||
          CSS.supports("-webkit-backdrop-filter", "blur(10px)")
        );
      },
      description: "Used for modern UI effects in the terminal.",
      impact: "low",
    },
  ];

  useEffect(() => {
    const checkedFeatures = terminalFeatures.map((feature) => ({
      feature,
      supported: feature.check(),
    }));

    setFeatures(checkedFeatures);

    // Calculate compatibility score
    const totalWeight = checkedFeatures.reduce((acc, { feature }) => {
      const weights = { critical: 4, high: 3, medium: 2, low: 1 };
      return acc + weights[feature.impact];
    }, 0);

    const scoreWeight = checkedFeatures.reduce(
      (acc, { feature, supported }) => {
        if (!supported) return acc;
        const weights = { critical: 4, high: 3, medium: 2, low: 1 };
        return acc + weights[feature.impact];
      },
      0,
    );

    setCompatibilityScore(Math.round((scoreWeight / totalWeight) * 100));
  }, []);

  const getScoreClass = () => {
    if (compatibilityScore >= 90) return "score-excellent";
    if (compatibilityScore >= 75) return "score-good";
    if (compatibilityScore >= 50) return "score-medium";
    return "score-poor";
  };

  const getImpactClass = (impact: string) => {
    switch (impact) {
      case "critical":
        return "impact-critical";
      case "high":
        return "impact-high";
      case "medium":
        return "impact-medium";
      case "low":
        return "impact-low";
      default:
        return "";
    }
  };

  return (
    <div className="compatibility-report">
      <h2>Browser Compatibility</h2>

      <div className="compatibility-score">
        <div className={`score-circle ${getScoreClass()}`}>
          <span className="score-value">{compatibilityScore}%</span>
        </div>
        <div className="score-label">
          {compatibilityScore >= 90
            ? "Excellent"
            : compatibilityScore >= 75
            ? "Good"
            : compatibilityScore >= 50
            ? "Fair"
            : "Poor"}
        </div>
      </div>

      <button
        className="details-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {showDetails && (
        <div className="compatibility-details">
          <table className="features-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
                <th>Impact</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {features.map(({ feature, supported }) => (
                <tr
                  key={feature.name}
                  className={supported ? "supported" : "not-supported"}
                >
                  <td>{feature.name}</td>
                  <td>
                    <span
                      className={`status-indicator ${
                        supported ? "status-ok" : "status-error"
                      }`}
                    >
                      {supported ? "Supported" : "Not Supported"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`impact-indicator ${getImpactClass(
                        feature.impact,
                      )}`}
                    >
                      {feature.impact.charAt(0).toUpperCase() +
                        feature.impact.slice(1)}
                    </span>
                  </td>
                  <td>{feature.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrowserCompatibilityReport;
