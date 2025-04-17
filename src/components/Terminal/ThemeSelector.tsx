/** 
 * 1. Add keyboard accessibility for toggling the theme selection dropdown to improve usability for keyboard users.

2. Implement a confirmation dialog when changing themes to prevent accidental theme changes.

3. Optimize the ColorPreview component by memoizing it to prevent unnecessary re-renders when the theme does not change.
 */
import React, { useState } from 'react';
import { TerminalTheme, useTheme } from '../../context';

interface ThemeSelectorProps {
  minimal?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  minimal = false
}) => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const handleThemeSelect = (newTheme: TerminalTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };
  
  // Simple color square preview
  const ColorPreview = ({ colors }: { colors: TerminalTheme['colors'] }) => (
    <div className="flex gap-1">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.background }}></div>
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.cyan }}></div>
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.green }}></div>
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.magenta }}></div>
    </div>
  );
  
  // Minimal version (just a button that opens a popup)
  if (minimal) {
    return (
      <div className="theme-selector relative">
        <button 
          className="theme-toggle-btn px-2 py-1 text-xs border border-terminal-green text-terminal-green bg-terminal-black hover:bg-terminal-green hover:text-terminal-black transition-colors rounded"
          onClick={toggleOpen}
        >
          Theme: {theme.name}
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 bg-terminal-black border border-terminal-green rounded p-2 w-48 z-10">
            <div className="font-bold text-terminal-cyan mb-2 text-xs">Select Theme</div>
            <ul className="space-y-1">
              {availableThemes.map((t) => (
                <li 
                  key={t.id}
                  className={`
                    flex items-center justify-between p-1 text-xs rounded cursor-pointer
                    ${t.id === theme.id ? 'bg-terminal-green text-terminal-black' : 'hover:bg-terminal-black hover:bg-opacity-30'}
                  `}
                  onClick={() => handleThemeSelect(t)}
                >
                  <span>{t.name}</span>
                  <ColorPreview colors={t.colors} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  
  // Full version (detailed theme selector with previews)
  return (
    <div className="theme-selector w-full border border-terminal-green bg-terminal-black bg-opacity-80 rounded overflow-hidden">
      <div className="p-3 border-b border-terminal-green">
        <h3 className="text-terminal-green font-bold">Terminal Theme</h3>
        <p className="text-terminal-white text-opacity-70 text-xs mt-1">
          Select a theme to customize the terminal appearance.
        </p>
      </div>
      
      <div className="p-3 grid grid-cols-2 gap-3">
        {availableThemes.map((t) => (
          <div 
            key={t.id}
            className={`
              theme-preview p-2 border rounded cursor-pointer transition-transform transform hover:scale-105
              ${t.id === theme.id 
                ? 'border-terminal-green shadow-sm shadow-terminal-green' 
                : 'border-terminal-gray'}
            `}
            style={{ backgroundColor: t.colors.background }}
            onClick={() => handleThemeSelect(t)}
          >
            <div 
              className="theme-name font-bold mb-1"
              style={{ color: t.colors.foreground }}
            >
              {t.name}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {['magenta', 'cyan', 'green', 'yellow', 'red', 'blue'].map((color) => (
                <div 
                  key={color}
                  className="w-4 h-2 rounded-sm"
                  style={{ backgroundColor: t.colors[color as keyof typeof t.colors] }}
                ></div>
              ))}
            </div>
            
            <div 
              className="text-xs sample-text"
              style={{ color: t.colors.foreground }}
            >
              <div style={{ color: t.colors.green }}>user@terminal:~$</div>
              <div style={{ color: t.colors.cyan }}>sample text</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-terminal-green flex justify-end">
        <div className="text-xs text-terminal-white">
          Current: <span className="text-terminal-green font-bold">{theme.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector; 