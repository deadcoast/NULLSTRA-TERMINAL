import React, { useEffect, useState } from 'react';
import Glitch from '../UI/Glitch';
import CRTEffect from '../UI/CRTEffect';

interface OverlayEffectsProps {
  glitchFrequency?: number; // milliseconds
}

const OverlayEffects: React.FC<OverlayEffectsProps> = ({ 
  glitchFrequency = 5000 
}) => {
  const [glitchActive, setGlitchActive] = useState(false);
  
  useEffect(() => {
    // Random glitch effect
    const triggerRandomGlitch = () => {
      // Random chance to trigger a glitch
      if (Math.random() < 0.3) {
        setGlitchActive(true);
        
        setTimeout(() => {
          setGlitchActive(false);
        }, Math.random() * 200 + 50);
      }
    };
    
    const glitchInterval = setInterval(triggerRandomGlitch, glitchFrequency);
    
    return () => clearInterval(glitchInterval);
  }, [glitchFrequency]);
  
  return (
    <>
      {/* Scanline effect */}
      <div className="scanline" />
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5" 
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c4zIgLAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmAx0HHBZVePY+AAAAHWlUWHRDb21tZW50AAAAAABDcmVhdGVkIHdpdGggR0lNUGQuZQcAAAGASURBVEjHzZbJkoMgDIbhnwSQRdZs7/+gnaS6Rk1Q6UtnLgWfyZJACD+LX6KCZ1Wy/R9JjJGQzCi6klASP8KQUoiYVEDKALUiUReK7t/kaYoMiAVAUlOECZAVUFH6q8p8R1q2dvLEZFYkEUPs9XJW7Sd9pkwJBBL9TGFcFbvMmZJ8T0a5t7+In7MytCSOH7JQ93XbtCK51L/Nnm/bmNnxx8W2H9IHJB6JtCQJk/51XJ3xSpZxT0sHJCci+lJwxI9tu3i2IAlIKbA//5yH3iNB5dy8MrMPmSVnRIeHN1L+qcE4CxIQV3UT5Uu/krEgkYa4+rjSh+h7DoVEI5GPJU/5tKrWGpFE9LgSUu+PaYw0IeSnxZDKAxJRaERigLh9mFdHEh9N0p68LYwlUYM0IZ71LG/tmmuRgNSLZDKbzC5B1tPnt2WRBcn5rHP7T7sNix89F5K89Iy73YYlonNtVpJFLRDWNQdT4tFh5l7jQWgJ8ueK4hyKWlcfSbXXGtbL5mL+By6jQ/v5PCQ0AAAAAElFTkSuQmCC")'
        }}
      />
      
      {/* Glitch effect */}
      {glitchActive && (
        <div className="absolute inset-0 bg-terminal-green bg-opacity-5 animate-glitch pointer-events-none" />
      )}
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.7) 100%)'
        }}
      />
    </>
  );
};

export default OverlayEffects;