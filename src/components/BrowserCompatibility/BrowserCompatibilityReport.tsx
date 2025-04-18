import * as React from "react";
const {  useEffect, useState  } = React;
import styled, { css } from "styled-components";

// Theme type extension
interface DefaultTheme {
  isDark?: boolean;
  background?: string;
  text?: string;
  border?: string;
  backgroundLight?: string;
}

import useBrowserCompatibility from "../../hooks/useBrowserCompatibility";
import { ThemeType } from "../../types/theme";

interface BrowserCompatibilityReportProps {
  showDetailed?: boolean;
  onClose?: () => void;
}

interface RecommendationsPanelProps {
  expanded: boolean;
  theme?: ThemeType;
}

const RecommendationsPanel = styled.div<RecommendationsPanelProps>`
  margin-top: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme?.isDark ? "rgba(40, 44, 52, 0.8)" : "rgba(245, 245, 245, 0.8)"};
  ${({ theme }) =>
    theme?.isDark &&
    css`
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    `}
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: ${({ expanded }) => (expanded ? "1000px" : "0")};
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
  padding: ${({ expanded }) => (expanded ? "12px 15px" : "0 15px")};
`;

const Container = styled.div<{ theme: ThemeType }>`
  border: 1px solid #333;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  background-color: ${({ theme }) => (theme?.isDark ? "#1a1a1a" : "#f0f0f0")};
  color: ${({ theme }) => (theme?.isDark ? "#f0f0f0" : "#1a1a1a")};
  font-size: 14px;
  max-width: 800px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
`;

const HeaderContainer = styled.div<{ theme: ThemeType }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
`;

const SectionToggle = styled.div<{ expanded: boolean; theme: ThemeType }>`
  padding: 6px 10px;
  border: none;
  border-radius: 3px;
  background-color: ${({ theme }) => (theme?.isDark ? "#333" : "#555")};
  color: ${({ theme }) => (theme?.isDark ? "#f0f0f0" : "#fff")};
  cursor: pointer;
  margin-left: 8px;
  transition: background-color 0.2s;
`;

const Section = styled.div<{ expanded: boolean; theme: ThemeType }>`
  margin-top: 20px;
  border-top: 1px solid #444;
  padding-top: 15px;
`;

const browserCompatStyles = {
  container: {
    backgroundColor: '#1c1c1c',
    color: '#e0e0e0',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #444',
    paddingBottom: '15px',
  },
  featureGroup: {
    marginBottom: '20px',
    border: '1px solid #444',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  featureHeader: {
    backgroundColor: '#2a2a2a',
    padding: '10px 15px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureDetails: (expanded: boolean) => ({
    padding: expanded ? '15px' : '0',
    maxHeight: expanded ? '500px' : '0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  }),
  browserIcons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '15px',
  },
  browserIcon: {
    textAlign: 'center' as const,
    width: '60px',
  },
  featureStatus: {
    padding: '5px',
    borderRadius: '4px',
    marginBottom: '5px',
    fontSize: '14px',
  },
  supported: {
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    color: '#28a745',
  },
  partial: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    color: '#ffc107',
  },
  notSupported: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    color: '#dc3545',
  },
};

// Types for browser compatibility data
type CompatibilityStatus = 'yes' | 'no' | 'partial';

interface BrowserSupport {
  chrome: CompatibilityStatus;
  firefox: CompatibilityStatus;
  safari: CompatibilityStatus;
  edge: CompatibilityStatus;
  ie: CompatibilityStatus;
}

interface FeatureData {
  name: string;
  description: string;
  browserSupport: BrowserSupport;
  alternatives?: string[];
  notes?: string;
}

interface FeatureGroup {
  name: string;
  features: FeatureData[];
}

/**
 * Component that displays browser compatibility information and performance recommendations
 */
export default function BrowserCompatibilityReport({
  showDetailed = false,
  onClose,
}: BrowserCompatibilityReportProps) {
  const {
    browser,
    performance,
    imageSupport,
    recommendations,
    isSupported,
    optimizationEnabled,
    toggleOptimization,
    isLoading,
  } = useBrowserCompatibility();

  const [showDetails, setShowDetails] = useState(showDetailed);
  const [compatibilityData, setCompatibilityData] = useState<FeatureGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // This would typically be an API call
    const mockData: FeatureGroup[] = [
      {
        name: 'JavaScript APIs',
        features: [
          {
            name: 'Clipboard API',
            description: 'Provides access to the system clipboard for copy and paste operations.',
            browserSupport: {
              chrome: 'yes',
              firefox: 'yes',
              safari: 'partial',
              edge: 'yes',
              ie: 'no',
            },
            notes: 'Safari has limited support and requires user permission.',
          },
          {
            name: 'Web Workers',
            description: 'Allows running scripts in background threads.',
            browserSupport: {
              chrome: 'yes',
              firefox: 'yes',
              safari: 'yes',
              edge: 'yes',
              ie: 'partial',
            },
          },
        ],
      },
      {
        name: 'CSS Features',
        features: [
          {
            name: 'CSS Grid',
            description: 'Two-dimensional grid-based layout system.',
            browserSupport: {
              chrome: 'yes',
              firefox: 'yes',
              safari: 'yes',
              edge: 'yes',
              ie: 'no',
            },
            alternatives: ['Flexbox', 'Float-based layouts'],
          },
          {
            name: 'CSS Variables',
            description: 'Custom properties for defining reusable values.',
            browserSupport: {
              chrome: 'yes',
              firefox: 'yes',
              safari: 'yes',
              edge: 'yes',
              ie: 'no',
            },
          },
        ],
      },
    ];

    setCompatibilityData(mockData);
    // Initialize expanded state
    const initialExpandedState: Record<string, boolean> = {};
    mockData.forEach((group) => {
      initialExpandedState[group.name] = false;
    });
    setExpandedGroups(initialExpandedState);
  }, []);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupName]: !prevState[groupName],
    }));
  };

  const getStatusClass = (status: CompatibilityStatus) => {
    switch (status) {
      case 'yes':
        return browserCompatStyles.supported;
      case 'partial':
        return browserCompatStyles.partial;
      case 'no':
        return browserCompatStyles.notSupported;
      default:
        return {};
    }
  };

  const getStatusText = (status: CompatibilityStatus) => {
    switch (status) {
      case 'yes':
        return 'Supported';
      case 'partial':
        return 'Partial Support';
      case 'no':
        return 'Not Supported';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "#4CAF50";
      case "warning":
        return "#FFC107";
      case "bad":
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };

  if (isLoading) {
    return (
      <div style={browserCompatStyles.container}>
        <div style={browserCompatStyles.header}>
          <h3 style={{ margin: 0 }}>Browser Compatibility</h3>
        </div>
        <p>Analyzing browser capabilities...</p>
      </div>
    );
  }

  // Determine browser compatibility status
  const status = !isSupported
    ? "bad"
    : performance?.optimizationLevel === "high"
      ? "warning"
      : "good";
  const statusColor = getStatusColor(status);

  // Device tier label
  const deviceTierLabel =
    performance?.deviceTier === "high-end"
      ? "High-End Device"
      : performance?.deviceTier === "mid-range"
        ? "Mid-Range Device"
        : performance?.deviceTier === "low-end"
          ? "Low-End Device"
          : "Unknown Device";

  return (
    <div style={browserCompatStyles.container}>
      <div style={browserCompatStyles.header}>
        <h2>Browser Compatibility Report</h2>
        <div>
          <select>
            <option value="all">All Browsers</option>
            <option value="modern">Modern Browsers Only</option>
          </select>
        </div>
      </div>

      <div style={browserCompatStyles.browserIcons}>
        <div style={browserCompatStyles.browserIcon}>
          <img src="/icons/chrome.svg" alt="Chrome" width="40" height="40" />
          <div>Chrome</div>
        </div>
        <div style={browserCompatStyles.browserIcon}>
          <img src="/icons/firefox.svg" alt="Firefox" width="40" height="40" />
          <div>Firefox</div>
        </div>
        <div style={browserCompatStyles.browserIcon}>
          <img src="/icons/safari.svg" alt="Safari" width="40" height="40" />
          <div>Safari</div>
        </div>
        <div style={browserCompatStyles.browserIcon}>
          <img src="/icons/edge.svg" alt="Edge" width="40" height="40" />
          <div>Edge</div>
        </div>
        <div style={browserCompatStyles.browserIcon}>
          <img src="/icons/ie.svg" alt="IE" width="40" height="40" />
          <div>IE 11</div>
        </div>
      </div>

      {compatibilityData.map((group) => (
        <div key={group.name} style={browserCompatStyles.featureGroup}>
          <button 
            onClick={() => toggleGroup(group.name)}
            style={browserCompatStyles.featureHeader}
          >
            <span>{group.name}</span>
            <span>{expandedGroups[group.name] ? '−' : '+'}</span>
          </button>
          <div style={browserCompatStyles.featureDetails(expandedGroups[group.name])}>
            {group.features.map((feature) => (
              <div key={feature.name} style={{ marginBottom: '15px' }}>
                <h4>{feature.name}</h4>
                <p>{feature.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0' }}>
                  <div style={{ ...browserCompatStyles.featureStatus, ...getStatusClass(feature.browserSupport.chrome) }}>
                    Chrome: {getStatusText(feature.browserSupport.chrome)}
                  </div>
                  <div style={{ ...browserCompatStyles.featureStatus, ...getStatusClass(feature.browserSupport.firefox) }}>
                    Firefox: {getStatusText(feature.browserSupport.firefox)}
                  </div>
                  <div style={{ ...browserCompatStyles.featureStatus, ...getStatusClass(feature.browserSupport.safari) }}>
                    Safari: {getStatusText(feature.browserSupport.safari)}
                  </div>
                  <div style={{ ...browserCompatStyles.featureStatus, ...getStatusClass(feature.browserSupport.edge) }}>
                    Edge: {getStatusText(feature.browserSupport.edge)}
                  </div>
                  <div style={{ ...browserCompatStyles.featureStatus, ...getStatusClass(feature.browserSupport.ie) }}>
                    IE: {getStatusText(feature.browserSupport.ie)}
                  </div>
                </div>
                {feature.alternatives && (
                  <div>
                    <strong>Alternatives: </strong>
                    {feature.alternatives.join(', ')}
                  </div>
                )}
                {feature.notes && (
                  <div>
                    <strong>Notes: </strong>
                    {feature.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
