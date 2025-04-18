// Helper function to generate random static noise
export const generateNoise = (
  width: number,
  height: number,
  opacity: number = 0.1,
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  const imageData = ctx.createImageData(width, height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    // Random static
    const value = Math.floor(Math.random() * 256);
    data[i] = value; // r
    data[i + 1] = value; // g
    data[i + 2] = value; // b
    data[i + 3] = Math.floor(opacity * 255); // alpha
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};

// Helper function to apply glitch effect to text
export const glitchText = (text: string): string => {
  // Characters to randomly replace with
  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\";

  // Apply glitch to random positions
  return text
    .split("")
    .map((char) => {
      if (Math.random() < 0.05) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    })
    .join("");
};

// Helper to simulate connection issues
export const simulateConnectionIssue = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve();
      },
      Math.random() * 1000 + 500,
    );
  });
};

// Generate random error message
export const generateRandomError = (): string => {
  const errors = [
    "[FAIL] Remote node unresponsive.",
    "[WARN] Link failure detected at node 4A-7D.",
    "[FAIL] Decryption failed.",
    "[WARN] Power fluctuation detected.",
    "[WARN] High fragmentation detected.",
    "[FAIL] Module 7E-1D misalignment detected.",
    "[WARN] Unrecognized transmission detected on secured channel.",
  ];

  return errors[Math.floor(Math.random() * errors.length)];
};

// Format timestamp for terminal display
export const formatTimestamp = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
};

// Format IP address
export const formatIpAddress = (ip: string): string => {
  return `<${ip}>`;
};

// Make text appear typed
export const typeText = async (
  text: string,
  callback: (chunk: string) => void,
  speed: number = 30,
): Promise<void> => {
  let currentIndex = 0;

  return new Promise((resolve) => {
    const type = () => {
      if (currentIndex < text.length) {
        // Get next chunk of text (can be more than one character for faster typing)
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const end = Math.min(currentIndex + chunkSize, text.length);
        const chunk = text.substring(currentIndex, end);

        callback(chunk);
        currentIndex = end;

        setTimeout(type, speed);
      } else {
        resolve();
      }
    };

    type();
  });
};
