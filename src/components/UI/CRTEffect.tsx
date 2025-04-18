import * as React from "react";
const {   useCallback, useEffect, useRef   } = React;

interface CRTEffectProps {
  intensity?: number; // 0-1
  flicker?: boolean;
  curvature?: number; // 0-1
  isProcessing?: boolean;
  enabled?: boolean; // New prop to make effect optional
  throttleFrames?: number; // Reduce animation frames for performance
}

const CRTEffect: React.FC<CRTEffectProps> = ({
  intensity = 0.5,
  flicker = true,
  curvature = 0.3,
  isProcessing = false,
  enabled = true, // Default to enabled for backward compatibility
  throttleFrames = 2, // Only render every X frames
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const flickerValueRef = useRef(1);

  // Cache the noise function for better performance
  const createNoise = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      intensity: number,
    ) => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const { data } = imageData;

      // Optimize noise algorithm by doing less work
      // Skip pixels to improve performance (check every 4th pixel)
      const pixelSkip = isProcessing ? 2 : 4;

      for (let i = 0; i < data.length; i += 4 * pixelSkip) {
        // More sophisticated noise algorithm
        const noise = Math.random() * 255;
        const value = noise < 230 ? 0 : noise;
        const alpha = noise < 230 ? 0 : (noise - 230) * 10 * intensity; // alpha

        // Set this pixel
        data[i] = value * intensity; // r
        data[i + 1] = value * intensity; // g
        data[i + 2] = value * intensity; // b
        data[i + 3] = alpha; // alpha

        // Fill in the skipped pixels with the same value
        // This greatly reduces the computation cost
        for (let j = 1; j < pixelSkip && i + j * 4 < data.length; j++) {
          data[i + j * 4] = data[i];
          data[i + j * 4 + 1] = data[i + 1];
          data[i + j * 4 + 2] = data[i + 2];
          data[i + j * 4 + 3] = data[i + 3];
        }
      }

      return imageData;
    },
    [isProcessing],
  );

  useEffect(() => {
    if (!enabled) return; // Skip effect if disabled

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Resize to match window
    const resize = () => {
      // Only update canvas size if dimensions actually changed
      if (
        canvas.width !== window.innerWidth ||
        canvas.height !== window.innerHeight
      ) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", resize);
    resize();

    // CRT render function - memoized for better performance
    const render = () => {
      frameCountRef.current += 1;

      // Only render every X frames for better performance
      // Skip rendering frames to improve performance
      if (frameCountRef.current % throttleFrames !== 0) {
        animationFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      if (!ctx) {
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply dynamic noise that changes during "processing" states
      const noiseIntensity = isProcessing ? 0.2 : 0.05;
      const noiseData = createNoise(ctx, canvas, noiseIntensity);
      ctx.putImageData(noiseData, 0, 0);

      // Render scan lines - optimize by increasing line height
      const scanLineHeight = isProcessing ? 3 : 4;
      const scanLines = Math.ceil(canvas.height / scanLineHeight);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

      // Draw fewer scan lines based on processing state
      const lineSkip = isProcessing ? 1 : 2;
      for (let i = 0; i < scanLines; i += lineSkip) {
        ctx.fillRect(0, i * scanLineHeight, canvas.width, scanLineHeight);
      }

      // Apply vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5,
      );

      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, `rgba(0, 0, 0, ${0.6 * intensity})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply curvature distortion only if necessary (skip if curvature is low)
      if (curvature > 0.05) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Skip pixels for performance
        const distortionSkip = 2; // Process every Nth pixel
        const distortionStrength = curvature * 0.8; // Reduce strength for better performance

        for (let y = 0; y < canvas.height; y += distortionSkip) {
          for (let x = 0; x < canvas.width; x += distortionSkip) {
            // Calculate distance from center
            const dx = (x - centerX) / centerX;
            const dy = (y - centerY) / centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply quadratic distortion
            const strength = distance * distortionStrength;
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

              // Fill in adjacent skipped pixels for smoother appearance
              for (
                let dy = 0;
                dy < distortionSkip && y + dy < canvas.height;
                dy++
              ) {
                for (
                  let dx = 0;
                  dx < distortionSkip && x + dx < canvas.width;
                  dx++
                ) {
                  if (dx === 0 && dy === 0) continue; // Skip the original pixel

                  const fillIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
                  data[fillIndex] = data[targetIndex];
                  data[fillIndex + 1] = data[targetIndex + 1];
                  data[fillIndex + 2] = data[targetIndex + 2];
                  data[fillIndex + 3] = data[targetIndex + 3];
                }
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Apply random flicker effect - make less frequent
      if (flicker) {
        // Reduce flicker frequency for better performance
        if (Math.random() < (isProcessing ? 0.03 : 0.01)) {
          flickerValueRef.current = Math.max(0.7, Math.random());
        } else {
          // Gradually return to normal
          flickerValueRef.current = 0.95 * flickerValueRef.current + 0.05;
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${1 - flickerValueRef.current})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [
    intensity,
    flicker,
    curvature,
    isProcessing,
    enabled,
    throttleFrames,
    createNoise,
  ]);

  // If effect is disabled, render nothing
  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "overlay" }}
    />
  );
};

export default React.memo(CRTEffect);
