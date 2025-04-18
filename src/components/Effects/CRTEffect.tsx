import React, { useEffect, useState } from "react";

interface CRTEffectProps {
  enabled?: boolean;
  intensity?: number;
  scanlines?: boolean;
  flicker?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CRTEffect: React.FC<CRTEffectProps> = ({
  enabled = true,
  intensity = 0.5,
  scanlines = true,
  flicker = true,
  children,
  className = "",
}) => {
  const [flickerState, setFlickerState] = useState(1);

  // Create flicker effect
  useEffect(() => {
    if (!enabled || !flicker) return;

    const flickerInterval = setInterval(() => {
      // Random flicker between 0.95 and 1.05
      setFlickerState(0.95 + Math.random() * 0.1);
    }, 100 + Math.random() * 500);

    return () => clearInterval(flickerInterval);
  }, [enabled, flicker]);

  if (!enabled) {
    return <>{children}</>;
  }

  const crtClasses = [
    "crt-effect",
    scanlines ? "crt-scanlines" : "",
    flicker ? "crt-flicker" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const crtStyle = {
    "--crt-intensity": intensity,
    "--crt-flicker-opacity": flickerState,
  } as React.CSSProperties;

  return (
    <div className={crtClasses} style={crtStyle}>
      {children}
    </div>
  );
};

export default CRTEffect;
