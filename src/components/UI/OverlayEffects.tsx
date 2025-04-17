'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context';
import CRTEffect from '../UI/CRTEffect';
import Glitch from '../UI/Glitch';

interface OverlayEffectsProps {
  children?: React.ReactNode;
  intensity?: number;
  flicker?: boolean;
  scanlines?: boolean;
  noise?: boolean;
  isProcessing?: boolean;
  glitchFrequency?: number;
  glitchIntensity?: 'low' | 'medium' | 'high';
  className?: string;
}

/**
 * OverlayEffects component that provides visual effects for the terminal
 * Similar to CRT effects but with a more general interface
 */
const OverlayEffects: React.FC<OverlayEffectsProps> = ({
  children,
  intensity = 0.5,
  flicker = true,
  scanlines = true,
  noise = true,
  isProcessing = false,
  glitchFrequency = 5000,
  glitchIntensity = 'medium',
  className = '',
}) => {
  const { theme } = useTheme();
  const [flickerState, setFlickerState] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  // Random glitch effect - just for controlling when the Glitch component is active
  useEffect(() => {
    const triggerRandomGlitch = () => {
      // Random chance to trigger a glitch
      if (Math.random() < 0.3) {
        setGlitchActive(true);

        setTimeout(
          () => {
            setGlitchActive(false);
          },
          Math.random() * 200 + 50
        );
      }
    };

    const glitchInterval = setInterval(triggerRandomGlitch, glitchFrequency);

    return () => clearInterval(glitchInterval);
  }, [glitchFrequency]);

  // Apply flicker effect
  useEffect(() => {
    if (!flicker) {
      return;
    }

    // Flicker intensity increases when processing
    const interval = isProcessing
      ? Math.max(50, 200 - intensity * 150)
      : Math.max(300, 1000 - intensity * 300);

    const timer = setInterval(() => {
      setFlickerState((prev) => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [flicker, intensity, isProcessing]);

  // Additional overlay for noise effect
  const noiseStyle: React.CSSProperties = noise
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: intensity * 0.1,
        pointerEvents: 'none',
        backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAP1JREFUaEPtmEEKwzAMBPPofXL/f1PPoYfQg2XZiZ0lYJGBgZrIINhabBRFURRFUexIKeUihHDz3n8spbRVZqwjhOA+YytjHaHhGbpkxLGO0PiXQiK3yAgJfSLRNcDOvRqRqOvLva7RArRxnCfFFan3N6zZpnGRQU5kIbRxGhdZyIkshDaOmMjMJ4iIiMz8vSEyQ/GI2UXQiBkiM0PbPWLGiIjM3G33iBkjQ/PITdBGER8Zy6osYzGbAIJGjMVsAvRceTIWs4mgESMys2+/yEPEiIjMvNnuamiEyI5qn/xlQFNVxlBKubpP8L49cKtNlmQURVEURXEKquoLVItyJ07d0UIAAAAASUVORK5CYII=')`,
        backgroundSize: '50px 50px',
      }
    : {};

  // Define the content to be wrapped with glitch effect
  const contentWithEffects = (
    <div
      className={`overlay-effects-inner ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {children}

      {/* Use the actual CRTEffect component */}
      <CRTEffect
        intensity={intensity}
        flicker={flicker}
        curvature={0.2}
        isProcessing={isProcessing}
      />

      {/* Scanline effect */}
      {scanlines && <div className="scanline" />}

      {/* Noise overlay */}
      {noise && (
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c4zIgLAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmAx0HHBZVePY+AAAAHWlUWHRDb21tZW50AAAAAABDcmVhdGVkIHdpdGggR0lNUGQuZQcAAAGASURBVEjHzZbJkoMgDIbhnwSQRdZs7/+gnaS6Rk1Q6UtnLgWfyZJACD+LX6KCZ1Wy/R9JjJGQzCi6klASP8KQUoiYVEDKALUiUReK7t/kaYoMiAVAUlOECZAVUFH6q8p8R1q2dvLEZFYkEUPs9XJW7Sd9pkwJBBL9TGFcFbvMmZJ8T0a5t7+In7MytCSOH7JQ93XbtCK51L/Nnm/bmNnxx8W2H9IHJB6JtCQJk/51XJ3xSpZxT0sHJCci+lJwxI9tu3i2IAlIKbA//5yH3iNB5dy8MrMPmSVnRIeHN1L+qcE4CxIQV3UT5Uu/krEgkYa4+rjSh+h7DoVEI5GPJU/5tKrWGpFE9LgSUu+PaYw0IeSnxZDKAxJRaERigLh9mFdHEh9N0p68LYwlUYM0IZ71LG/tmmuRgNSLZDKbzC5B1tPnt2WRBcn5rHP7T7sNix89F5K89Iy73YYlonNtVpJFLRDWNQdT4tFh5l7jQWgJ8ueK4hyKWlcfSbXXGtbL5mL+By6jQ/v5PCQ0AAAAAElFTkSuQmCC")',
          }}
        />
      )}

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

      {noise && <div className="noise-effect" style={noiseStyle} />}
    </div>
  );

  // Apply Glitch effect conditionally
  return glitchActive ? (
    <Glitch intensity={glitchIntensity} active={true}>
      {contentWithEffects}
    </Glitch>
  ) : (
    contentWithEffects
  );
};

export default OverlayEffects;
