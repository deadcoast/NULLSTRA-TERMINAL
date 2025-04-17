// src/components/Terminal/TerminalButton.tsx
/**
 * 1. Add `type` prop to the button for better accessibility: `<button type="button" ...>`.
2. Implement `onMouseEnter` and `onMouseLeave` events to manage `isHovered` state for hover effects.
3. Use `disabled` prop to conditionally render the button or a `span` to prevent interaction when disabled. 
 */
import { useState } from 'react';

interface TerminalButtonProps {
  children: React.ReactNode;
  className?: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'accent';
}

const TerminalButton: React.FC<TerminalButtonProps> = ({
  icon,
  onClick,
  active = false,
  disabled = false,
  variant = 'primary',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClass = 'terminal-button';
  const variantClass = variant === 'accent' ? 'terminal-button-accent' : '';
  const activeClass = active ? 'terminal-button-active' : '';
  const disabledClass = disabled ? 'terminal-button-disabled' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${activeClass} ${disabledClass} flex items-center justify-center w-8 h-8`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      aria-label={icon}
    >
      <span
        className={`${variant === 'accent' ? 'text-shocking-pink' : 'text-lime'} ${isHovered && !disabled ? 'terminal-shadow-' + (variant === 'accent' ? 'magenta' : 'green') : ''}`}
      >
        {icon}
      </span>
      {isHovered && !disabled && (
        <div
          className={`absolute bottom-full mb-1 px-2 py-1 text-xs bg-night border ${variant === 'accent' ? 'border-shocking-pink' : 'border-lime'} rounded`}
        >
          {icon}
        </div>
      )}
    </button>
  );
};

export default TerminalButton;
