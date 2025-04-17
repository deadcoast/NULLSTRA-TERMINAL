import React, { useEffect, useRef } from 'react';

interface CRTEffectProps {
  intensity?: number; // 0-1
  flicker?: boolean;
  curvature?: number; // 0-1
  isProcessing?: boolean;
}

const CRTEffect: React.FC<CRTEffectProps> = ({
  intensity = 0.5,
  flicker = true,
  curvature = 0.3,
  isProcessing = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Resize to match window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Animation variables
    let frameId: number;
    let flickerValue = 1;

    // Add to CRTEffect.tsx
    const createNoise = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      intensity: number
    ) => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        // More sophisticated noise algorithm
        const noise = Math.random() * 255;
        const value = noise < 230 ? 0 : noise;

        data[i] = value * intensity; // r
        data[i + 1] = value * intensity; // g
        data[i + 2] = value * intensity; // b
        data[i + 3] = noise < 230 ? 0 : (noise - 230) * 10 * intensity; // alpha
      }

      return imageData;
    };

    // CRT render function
    const render = () => {
      if (!ctx) {
        return;
      }

      // Apply dynamic noise that changes during "processing" states
      const noiseIntensity = isProcessing ? 0.2 : 0.05;
      const noiseData = createNoise(ctx, canvas, noiseIntensity);
      ctx.putImageData(noiseData, 0, 0);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render scan lines
      const scanLineHeight = 4;
      const scanLines = Math.ceil(canvas.height / scanLineHeight);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';

      for (let i = 0; i < scanLines; i += 2) {
        ctx.fillRect(0, i * scanLineHeight, canvas.width, scanLineHeight);
      }

      // Apply vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );

      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, `rgba(0, 0, 0, ${0.6 * intensity})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply curvature distortion
      if (curvature > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            // Calculate distance from center
            const dx = (x - centerX) / centerX;
            const dy = (y - centerY) / centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply quadratic distortion
            const strength = distance * curvature;
            const distortionX = dx * strength * strength;
            const distortionY = dy * strength * strength;

            // Map to new coordinates
            const sourceX = Math.floor(x + distortionX * centerX);
            const sourceY = Math.floor(y + distortionY * centerY);

            // Copy pixel if within bounds
            if (
              sourceX >= 0 &&
              sourceX < canvas.width &&
              sourceY >= 0 &&
              sourceY < canvas.height
            ) {
              const targetIndex = (y * canvas.width + x) * 4;
              const sourceIndex = (sourceY * canvas.width + sourceX) * 4;

              data[targetIndex] = data[sourceIndex];
              data[targetIndex + 1] = data[sourceIndex + 1];
              data[targetIndex + 2] = data[sourceIndex + 2];
              data[targetIndex + 3] = data[sourceIndex + 3];
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Apply random flicker effect
      if (flicker) {
        // Random flicker
        if (Math.random() < 0.03) {
          flickerValue = Math.max(0.7, Math.random());
        } else {
          // Gradually return to normal
          flickerValue = 0.95 * flickerValue + 0.05;
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${1 - flickerValue})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      frameId = requestAnimationFrame(render);
    };

    // Start animation
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [intensity, flicker, curvature, isProcessing]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
};

export default CRTEffect;
