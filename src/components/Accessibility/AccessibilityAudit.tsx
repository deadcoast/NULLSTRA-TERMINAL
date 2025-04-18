import * as React from "react";
const {   useEffect, useState   } = React;
import { runAxe } from "../../utils/accessibility";

export interface AccessibilityIssue {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

interface AccessibilityAuditProps {
  onClose: () => void;
  onFix: (fixedIssues: string[]) => void;
}

const AccessibilityAudit: React.FC<AccessibilityAuditProps> = ({
  onClose,
  onFix,
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);
  const [manualChecks, setManualChecks] = useState<{ [key: string]: boolean }>({
    keyboardNavigation: false,
    screenReaderAnnouncements: false,
    colorContrast: false,
    textZoom: false,
  });

  // Run automated accessibility tests on mount
  useEffect(() => {
    const runAccessibilityTests = async () => {
      setLoading(true);
      try {
        const results = await runAxe();
        setIssues(results.violations as AccessibilityIssue[]);
      } catch (error) {
        console.error("Error running accessibility tests:", error);
      } finally {
        setLoading(false);
      }
    };

    runAccessibilityTests();
  }, []);

  // Handle marking an issue as fixed
  const handleMarkFixed = (issueId: string) => {
    setFixedIssues((prev) => [...prev, issueId]);
  };

  // Handle toggling manual checks
  const toggleManualCheck = (checkId: string) => {
    setManualChecks((prev) => ({
      ...prev,
      [checkId]: !prev[checkId],
    }));
  };

  // Submit all fixes
  const handleSubmitFixes = () => {
    onFix(fixedIssues);
    onClose();
  };

  // Get status counts
  const criticalCount = issues.filter((i) => i.impact === "critical").length;
  const seriousCount = issues.filter((i) => i.impact === "serious").length;
  const moderateCount = issues.filter((i) => i.impact === "moderate").length;
  const minorCount = issues.filter((i) => i.impact === "minor").length;
  const fixedCount = fixedIssues.length;
  const totalIssues = issues.length;

  // Calculate completion percentage
  const automatedCompletionPercentage =
    totalIssues === 0 ? 100 : Math.round((fixedCount / totalIssues) * 100);
  const manualCompletionPercentage =
    Object.values(manualChecks).filter(Boolean).length * 25;
  const overallCompletionPercentage = Math.round(
    (automatedCompletionPercentage + manualCompletionPercentage) / 2,
  );

  return (
    <div className="accessibility-audit fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="audit-container bg-night border-2 border-lime text-lime w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg shadow-xl">
        <div className="audit-header sticky top-0 bg-night border-b border-lime p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Accessibility Audit</h2>
          <div className="flex items-center space-x-3">
            <div className="completion-indicator flex items-center">
              <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${overallCompletionPercentage >= 70 ? "bg-green-500" : overallCompletionPercentage >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${overallCompletionPercentage}%` }}
                />
              </div>
              <span className="ml-2 text-sm">
                {overallCompletionPercentage}% Complete
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-lime hover:text-white"
              aria-label="Close accessibility audit"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="audit-content p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Automated Tests */}
            <div className="automated-tests">
              <h3 className="text-lg font-semibold mb-4">Automated Tests</h3>
              {loading ? (
                <div className="loading text-center p-8">
                  <div className="animate-pulse">
                    Running accessibility tests...
                  </div>
                </div>
              ) : (
                <>
                  <div className="issues-summary flex space-x-3 mb-4">
                    <div className="summary-item bg-red-900 bg-opacity-30 p-2 rounded">
                      <div className="text-red-400 font-bold">
                        {criticalCount}
                      </div>
                      <div className="text-xs">Critical</div>
                    </div>
                    <div className="summary-item bg-orange-900 bg-opacity-30 p-2 rounded">
                      <div className="text-orange-400 font-bold">
                        {seriousCount}
                      </div>
                      <div className="text-xs">Serious</div>
                    </div>
                    <div className="summary-item bg-yellow-900 bg-opacity-30 p-2 rounded">
                      <div className="text-yellow-400 font-bold">
                        {moderateCount}
                      </div>
                      <div className="text-xs">Moderate</div>
                    </div>
                    <div className="summary-item bg-blue-900 bg-opacity-30 p-2 rounded">
                      <div className="text-blue-400 font-bold">
                        {minorCount}
                      </div>
                      <div className="text-xs">Minor</div>
                    </div>
                    <div className="summary-item bg-green-900 bg-opacity-30 p-2 rounded">
                      <div className="text-green-400 font-bold">
                        {fixedCount}
                      </div>
                      <div className="text-xs">Fixed</div>
                    </div>
                  </div>

                  {issues.length === 0 ? (
                    <div className="no-issues bg-green-900 bg-opacity-20 border border-green-500 p-3 rounded text-green-400">
                      No accessibility issues detected in automated testing.
                    </div>
                  ) : (
                    <div className="issues-list space-y-2">
                      {issues.map((issue) => {
                        const isFixed = fixedIssues.includes(issue.id);
                        const isSelected = selectedIssue === issue.id;

                        return (
                          <div
                            key={issue.id}
                            className={`issue-item border rounded p-2 transition-colors ${
                              isFixed
                                ? "border-green-500 bg-green-900 bg-opacity-20"
                                : issue.impact === "critical"
                                  ? "border-red-500 bg-red-900 bg-opacity-20"
                                  : issue.impact === "serious"
                                    ? "border-orange-500 bg-orange-900 bg-opacity-20"
                                    : issue.impact === "moderate"
                                      ? "border-yellow-500 bg-yellow-900 bg-opacity-20"
                                      : "border-blue-500 bg-blue-900 bg-opacity-20"
                            } ${isSelected ? "ring-2 ring-lime" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <button
                                className="issue-header text-left flex-grow"
                                onClick={() =>
                                  setSelectedIssue(isSelected ? null : issue.id)
                                }
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`impact-badge text-xs px-1 rounded mr-2 ${
                                      issue.impact === "critical"
                                        ? "bg-red-900 text-red-300"
                                        : issue.impact === "serious"
                                          ? "bg-orange-900 text-orange-300"
                                          : issue.impact === "moderate"
                                            ? "bg-yellow-900 text-yellow-300"
                                            : "bg-blue-900 text-blue-300"
                                    }`}
                                  >
                                    {issue.impact}
                                  </span>
                                  <span className="issue-title font-medium">
                                    {issue.description}
                                  </span>
                                </div>
                              </button>

                              <div className="issue-actions flex space-x-1">
                                <a
                                  href={issue.helpUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-night border border-lime px-2 py-1 rounded hover:bg-lime hover:text-night transition-colors"
                                  aria-label={`Learn more about ${issue.description}`}
                                >
                                  Docs
                                </a>
                                <button
                                  onClick={() => handleMarkFixed(issue.id)}
                                  className={`text-xs ${
                                    isFixed
                                      ? "bg-green-800 text-green-200 cursor-default"
                                      : "bg-night border border-lime hover:bg-lime hover:text-night"
                                  } px-2 py-1 rounded transition-colors`}
                                  disabled={isFixed}
                                  aria-label={
                                    isFixed
                                      ? "Issue marked as fixed"
                                      : `Mark issue "${issue.description}" as fixed`
                                  }
                                >
                                  {isFixed ? "Fixed" : "Mark Fixed"}
                                </button>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="issue-details mt-2 text-sm border-t border-lime border-opacity-30 pt-2">
                                <p className="mb-2">{issue.help}</p>
                                {issue.nodes.map((node, i) => (
                                  <div
                                    key={i}
                                    className="node-detail border border-lime border-opacity-30 p-2 rounded mb-2 text-xs font-mono"
                                  >
                                    <div className="html-snippet overflow-auto max-h-24 mb-2 whitespace-pre">
                                      {node.html}
                                    </div>
                                    <div className="failure-summary text-red-300">
                                      {node.failureSummary}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Column - Manual Tests */}
            <div className="manual-tests">
              <h3 className="text-lg font-semibold mb-4">Manual Checks</h3>

              <div className="manual-checks-list space-y-3">
                <div className="manual-check-item border border-lime rounded p-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="keyboardNavigation"
                      checked={manualChecks.keyboardNavigation}
                      onChange={() => toggleManualCheck("keyboardNavigation")}
                      className="mt-1 mr-3 h-4 w-4 border-lime checked:bg-lime"
                    />
                    <div>
                      <label
                        htmlFor="keyboardNavigation"
                        className="font-medium cursor-pointer"
                      >
                        Keyboard Navigation
                      </label>
                      <p className="text-sm text-gray-300 mt-1">
                        Test that all interactive elements are accessible via
                        keyboard. Verify tab order is logical and focus
                        indicators are visible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="manual-check-item border border-lime rounded p-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="screenReaderAnnouncements"
                      checked={manualChecks.screenReaderAnnouncements}
                      onChange={() =>
                        toggleManualCheck("screenReaderAnnouncements")
                      }
                      className="mt-1 mr-3 h-4 w-4 border-lime checked:bg-lime"
                    />
                    <div>
                      <label
                        htmlFor="screenReaderAnnouncements"
                        className="font-medium cursor-pointer"
                      >
                        Screen Reader Compatibility
                      </label>
                      <p className="text-sm text-gray-300 mt-1">
                        Test with a screen reader to verify that content is
                        announced correctly and all functionality is accessible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="manual-check-item border border-lime rounded p-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="colorContrast"
                      checked={manualChecks.colorContrast}
                      onChange={() => toggleManualCheck("colorContrast")}
                      className="mt-1 mr-3 h-4 w-4 border-lime checked:bg-lime"
                    />
                    <div>
                      <label
                        htmlFor="colorContrast"
                        className="font-medium cursor-pointer"
                      >
                        Color Contrast
                      </label>
                      <p className="text-sm text-gray-300 mt-1">
                        Verify that text has sufficient contrast against its
                        background. Test with color blindness simulation tools.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="manual-check-item border border-lime rounded p-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="textZoom"
                      checked={manualChecks.textZoom}
                      onChange={() => toggleManualCheck("textZoom")}
                      className="mt-1 mr-3 h-4 w-4 border-lime checked:bg-lime"
                    />
                    <div>
                      <label
                        htmlFor="textZoom"
                        className="font-medium cursor-pointer"
                      >
                        Text Resize
                      </label>
                      <p className="text-sm text-gray-300 mt-1">
                        Test that the interface remains usable when text is
                        resized up to 200%. Verify no content is cut off or
                        overlapping.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="audit-tools mt-6">
                <h4 className="text-md font-semibold mb-2">
                  Accessibility Tools
                </h4>
                <div className="tools-grid grid grid-cols-2 gap-2">
                  <button className="tool-button border border-lime p-2 text-xs text-center rounded hover:bg-lime hover:text-night transition-colors">
                    Screen Reader Tester
                  </button>
                  <button className="tool-button border border-lime p-2 text-xs text-center rounded hover:bg-lime hover:text-night transition-colors">
                    Color Contrast Analyzer
                  </button>
                  <button className="tool-button border border-lime p-2 text-xs text-center rounded hover:bg-lime hover:text-night transition-colors">
                    Keyboard Navigation Test
                  </button>
                  <button className="tool-button border border-lime p-2 text-xs text-center rounded hover:bg-lime hover:text-night transition-colors">
                    Focus Order Visualizer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="audit-actions border-t border-lime mt-6 pt-4 flex justify-end">
            <button
              onClick={handleSubmitFixes}
              className="bg-lime text-night px-4 py-2 rounded font-bold hover:bg-green-400 transition-colors"
              aria-label="Submit accessibility fixes"
            >
              Save Improvements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityAudit;
