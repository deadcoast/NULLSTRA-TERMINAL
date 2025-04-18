```css
/* Combined CSS from src/components/Terminal/terminal.css and terminal.css */
/* Preserving all rules and effects */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Space Mono font */
@import url("https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");
/* CSS Variables from terminal.css */
:root {
  --terminal-black: #000000;
  --terminal-green: #00ff00;
  --terminal-bright-green: #90ee90;
  --terminal-magenta: #ff00ff;
  --terminal-red: #ff0000;
  --terminal-yellow: #ffff00;
  --terminal-cyan: #00ffff;
  --terminal-white: #ffffff;
  --terminal-gray: #777777;
}

/* --- Start of src/components/Terminal/terminal.css --- */

/* Base terminal styles */
.terminal-window {
  /* Note: Styles for .terminal-window also exist in the second file below. */
  /* This definition might be intended for the overall container */
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  /* May be overridden by later rules or variables */
  font-family: "JetBrains Mono", "Consolas", monospace;
  /* Font may be overridden */
  color: #00ff00;
  /* May be overridden by later rules or variables */
  font-size: 16px;
  /* May be overridden */
  line-height: 1.4;
  /* May be overridden */
}

.terminal-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  overflow: auto;
}

.terminal-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px;
  z-index: 2;
}

.terminal-content {
  /* Note: Styles for .terminal-content also exist in the second file below. */
  /* These styles might conflict or complement depending on HTML structure */
  position: relative;
  /* Overridden by absolute positioning below if same element */
  z-index: 1;
  padding: 20px;
  /* Overridden by padding below if same element */
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Terminal header */
.terminal-header {
  /* Note: Styles for .terminal-header also exist in the second file below. */
  display: flex;
  margin-bottom: 10px;
  border: 1px solid #ff00ff;
  /* May conflict with border-bottom: none below */
  background-color: rgba(10, 0, 10, 0.7);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
  overflow: hidden;
  /* height: 22px; will be added from the second file */
  /* align-items: stretch; will be added from the second file */
}

.terminal-header-tag {
  background-color: #ff00ff;
  color: #000;
  padding: 5px 10px;
  font-weight: bold;
}

.terminal-header-content {
  padding: 5px 10px;
  color: #ff00ff;
  flex-grow: 1;
  text-align: center;
}

/* Terminal output */
.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff00ff;
  box-shadow: inset 0 0 5px rgba(255, 0, 255, 0.3);
}

.terminal-line {
  margin-bottom: 5px;
  word-wrap: break-word;
}

.terminal-line-error {
  color: #ff0000;
}

.terminal-line-warning {
  color: #ffff00;
}

.terminal-line-success {
  color: #00ff00;
}

.terminal-line-info {
  color: #00ffff;
}

.terminal-line-system {
  color: #ffffff;
}

.terminal-line-prefix {
  background-color: #ff00ff;
  color: #000;
  padding: 1px 5px;
  margin-right: 8px;
  font-weight: bold;
}

.terminal-timestamp {
  color: #888;
  margin-right: 8px;
}

/* Terminal prompt */
.terminal-prompt {
  /* Note: Second file uses .terminal-prompt-container for a similar concept */
  display: flex;
  align-items: center;
  background-color: rgba(0, 20, 0, 0.5);
  padding: 5px 10px;
  border: 1px solid #00ff00;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.terminal-prompt-user {
  color: #90ee90;
  font-weight: bold;
}

.terminal-prompt-separator {
  color: #ffffff;
  margin: 0 5px;
}

.terminal-prompt-path {
  color: #90ee90;
  /* May be overridden by var(--terminal-bright-green) below */
  margin-right: 10px;
}

.terminal-input-wrapper {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.terminal-input {
  /* Note: Styles for .terminal-input also exist in the second file below. */
  width: 100%;
  /* Overridden below */
  background-color: transparent;
  /* Overridden below */
  border: none;
  outline: none;
  color: #00ff00;
  /* Overridden by var(--terminal-green) below */
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  /* Overridden by padding: 0 below */
}

.terminal-cursor {
  /* Note: Styles for .terminal-cursor also exist in the second file below. */
  width: 8px;
  height: 16px;
  /* Overridden by height: 14px below */
  background-color: #00ff00;
  /* Overridden by var(--terminal-green) below */
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  /* Animation rule defined below */
}

.terminal-cursor-hidden {
  display: none;
}

body {
  /* Ensure full height and apply base styles if needed */
  height: 100vh;
  margin: 0;
  background-color: black;
  /* Default background */
  color: #4ade80;
  /* Default text color (like text-lime-400) */
  overflow: hidden;
  /* Prevent body scroll */
}

.terminal-container {
  /* Add any container-specific overrides here if needed */
  /* Example: background-color: #050a05; */
  color: #4ade80;
  /* Tailwind lime-400 */
  text-shadow:
    #4ade80 0 0 1px,
    rgba(74, 222, 128, 0.1) -1px 0 1px,
    rgba(74, 222, 128, 0.1) 1px 0 1px;
  position: relative;
  /* Needed for pseudo-elements if fixed */
  z-index: 1;
  /* Ensure container is above potential background elements */

  /* --- DEBUG: Force font family using CSS variable --- */
  font-family: var(--font-fraktion-mono), monospace;
  /* --- END DEBUG --- */
}

.text-lime {
  color: #4ade80;
}

.text-magenta {
  color: #f0f;
}

.lime-shadow {
  text-shadow:
    #4ade80 0 0 1px,
    rgba(74, 222, 128, 0.15) -1px 0 2px,
    rgba(74, 222, 128, 0.15) 1px 0 2px;
}

.magenta-shadow {
  text-shadow:
    #f0f 0 0 2px,
    /* Brighter magenta glow */ rgba(255, 0, 255, 0.25) -1px 0 2px,
    rgba(255, 0, 255, 0.25) 1px 0 2px;
}

.white-shadow {
  text-shadow:
    #fff 0 0 1px,
    hsla(0, 0%, 100%, 0.2) -2px 0 1px,
    hsla(0, 0%, 100%, 0.2) 2px 0 1px;
}

/* Scanline Effect (from .terminal.css / align-centre.css) */
.terminal-container::before {
  content: " ";
  display: block;
  position: absolute;
  /* Changed to absolute relative to container */
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.04),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.04)
    );
  z-index: 2;
  background-size:
    100% 2px,
    3px 100%;
  pointer-events: none;
}

/* Flicker Effect (from align-centre.css) */
.terminal-container::after {
  content: " ";
  display: block;
  position: absolute;
  /* Changed to absolute relative to container */
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  z-index: 3;
  /* Flicker above scanlines */
  pointer-events: none;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0% {
    opacity: 0.08;
  }

  5% {
    opacity: 0.02;
  }

  10% {
    opacity: 0.08;
  }

  15% {
    opacity: 0.15;
  }

  25% {
    opacity: 0.1;
  }

  30% {
    opacity: 0.18;
  }

  /* Add more steps for variation */
  100% {
    opacity: 0.1;
  }
}

/* Input Caret Blinking */
.terminal-input {
  position: relative;
  /* For caret positioning */
}

.terminal-input input {
  caret-color: #4ade80;
  /* Green caret */
  border: none;
  outline: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  width: 100%;
  /* Ensure it takes available space */
}

.terminal-input input:focus + .caret-pseudo::after {
  content: "_";
  /* Use underscore or block character */
  display: inline-block;
  background-color: #4ade80;
  /* Caret color */
  animation: blink 1s step-end infinite;
  margin-left: 1px;
  /* Adjust spacing */
  /* Adjust size if needed */
  /* width: 7px;  */
  /* height: 14px; */
  vertical-align: bottom;
  /* Align with text baseline */
}

/* Define the blinking animation */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.terminal-output > div {
  /* Ensure lines don't wrap unexpectedly */
  white-space: pre-wrap;
  /* Allows wrapping but preserves whitespace */
  word-break: break-all;
  /* Force breaks for long strings */
}

.terminal-output {
  /* Ensure lines don't wrap unexpectedly */
  white-space: pre-wrap;
  word-break: break-all;
}

/* Optional: Hide scrollbar visually but allow scrolling */
.terminal-output::-webkit-scrollbar {
  width: 0px;
  background: transparent;
  /* make scrollbar transparent */
}

.terminal-output {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* Header and Footer Specific Styles */
.terminal-header,
.terminal-footer {
  color: rgba(74, 222, 128, 0.8);
  /* Slightly dimmer lime */
  text-shadow: none;
  /* Remove main shadow from header/footer */
  flex-shrink: 0;
  /* Prevent shrinking */
}

.terminal-header {
  border-bottom: 1px solid rgba(74, 222, 128, 0.3);
}

.terminal-footer {
  border-top: 1px solid rgba(74, 222, 128, 0.3);
}

/* Add to global.css */

/* Variable text intensity */
.terminal-text {
  text-shadow: 0 0 1px rgba(0, 255, 0, 0.7);
  transition: text-shadow 0.3s ease;
}

.terminal-text.highlight {
  text-shadow: 0 0 3px rgba(0, 255, 0, 0.9);
}

/* Better cursor animation */
@keyframes cursor-pulse {
  0%,
  100% {
    opacity: 1;
  }

  40% {
    opacity: 0.8;
  }

  50% {
    opacity: 0;
  }

  60% {
    opacity: 0.8;
  }
}

.cursor {
  animation: cursor-pulse 1.2s infinite;
  box-shadow: 0 0 3px rgba(0, 255, 0, 0.7);
}

/* Command execution feedback */
.command-execute {
  animation: command-flash 0.3s ease;
}

@keyframes command-flash {
  0% {
    background-color: rgba(0, 255, 0, 0.2);
  }

  50% {
    background-color: rgba(0, 255, 0, 0.1);
  }

  100% {
    background-color: transparent;
  }
}

/* Status indicators */
.status-indicator {
  position: relative;
  overflow: hidden;
}

.status-indicator::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 0, 0.2),
    transparent
  );
  animation: status-slide 2s infinite;
}

@keyframes status-slide {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

/* Button hover states */
.terminal-button {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 255, 0, 0.5);
}

.terminal-button:hover {
  background-color: rgba(0, 255, 0, 0.2);
  border-color: rgba(0, 255, 0, 0.8);
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

/* Network activity indicator */
.network-active {
  position: relative;
}

.network-active::before {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #00ff00;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}

@keyframes command-flash {
  0% {
    background-color: rgba(0, 255, 0, 0.1);
  }

  50% {
    background-color: rgba(0, 255, 0, 0.05);
  }

  100% {
    background-color: transparent;
  }
}

.status-indicator {
  position: relative;
  overflow: hidden;
}

.status-indicator::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 0, 0.1),
    transparent
  );
  animation: status-slide 2s infinite;
}

.terminal.processing {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 25, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 70%
  );
}

/* @keyframes blink defined in second file section */

/* Terminal file list */
.terminal-file-list {
  /* Note: Second file uses .terminal-files for a similar concept */
  margin-bottom: 10px;
  border: 1px solid #ff00ff;
  background-color: rgba(10, 0, 10, 0.7);
}

.terminal-file-list-header {
  padding: 5px 10px;
  color: #ff00ff;
}

.terminal-file-list-content {
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.terminal-file-name {
  /* Note: Second file uses .terminal-file for a similar concept */
  color: #ff00ff;
  padding: 2px 5px;
}

.terminal-file-clickable {
  cursor: pointer;
}

.terminal-file-clickable:hover {
  background-color: rgba(255, 0, 255, 0.2);
}

/* Terminal dialog */
.terminal-dialog {
  /* Note: Second file defines .decrypt-dialog */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 800px;
  background-color: rgba(0, 20, 0, 0.9);
  border: 1px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  z-index: 10;
}

.terminal-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #00ff00;
  color: #000;
}

.terminal-dialog-title {
  font-weight: bold;
}

.terminal-dialog-close {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-weight: bold;
}

.terminal-dialog-content {
  padding: 15px;
}

/* Terminal button */
.terminal-button {
  background-color: rgba(0, 20, 0, 0.8);
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.terminal-button:hover {
  background-color: rgba(0, 40, 0, 0.8);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.terminal-button-active {
  background-color: rgba(0, 60, 0, 0.8);
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.7) inset;
}

.terminal-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Terminal status line */
.terminal-status-line {
  /* Note: Second file uses .terminal-status for a similar concept */
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  font-size: 14px;
  color: #ff00ff;
}

.terminal-status-ip {
  /* Note: Styles for .terminal-status-ip also exist in the second file below. */
  font-weight: bold;
  /* Overridden by color definition below if same element */
}

/* CRT effect */
.crt-effect {
  /* Note: Second file defines .crt-lines, .crt-glow */
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 3;
  mix-blend-mode: overlay;
}

/* --- End of src/components/Terminal/terminal.css --- */

/* --- Start of terminal.css (excluding :root and duplicate @keyframes) --- */

/* Core terminal styling to match the screenshots exactly */

/* Main terminal container */
.terminal-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: var(--terminal-black);
  overflow: hidden;
  font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
  color: var(--terminal-green);
  font-size: 14px;
  line-height: 1.2;
  margin: 0;
  padding: 0;
}

/* Connection status at top */
.terminal-connection-status {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 18px;
  background-color: var(--terminal-black);
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.terminal-connection-text {
  color: var(--terminal-green);
  padding-left: 10px;
  font-weight: bold;
}

.terminal-ip-address {
  color: var(--terminal-bright-green);
  padding-right: 10px;
  font-weight: bold;
}

/* Main terminal content area */
.terminal-content {
  /* Overrides/Complements styles from first file */
  position: absolute;
  /* Overrides relative */
  top: 22px;
  bottom: 22px;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 0 10px;
  /* Overrides 20px */
  background-color: rgba(0, 0, 0, 0.95);
  /* Removes display:flex properties from first file */
  min-height: auto;
  /* Effectively removes min-height: 100% */
  z-index: auto;
  /* Effectively removes z-index: 1 */
}

/* Terminal UI Windows */
.terminal-window {
  /* Overrides/Complements styles from first file */
  margin: 10px 0;
  border: 1px solid var(--terminal-magenta);
  position: relative;
  /* Already relative */
  overflow: hidden;
  /* Already hidden */
  background-color: rgba(15, 0, 15, 0.3);
  /* Overrides #000 */
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
  /* Removes width, height, font, color, line-height from first definition */
  width: auto;
  height: auto;
  font-family: inherit;
  /* Inherits from container */
  color: inherit;
  /* Inherits from container */
  font-size: inherit;
  /* Inherits from container */
  line-height: inherit;
  /* Inherits from container */
}

/* Terminal header with TERMINAL tag */
.terminal-header {
  /* Overrides/Complements styles from first file */
  display: flex;
  /* Already flex */
  align-items: stretch;
  height: 22px;
  border-bottom: none;
  /* Overrides border: 1px solid #ff00ff */
  /* Removes margin-bottom, background-color, box-shadow, overflow from first def */
  margin-bottom: 0;
  background-color: transparent;
  box-shadow: none;
  overflow: visible;
}

.terminal-tag {
  /* Similar to .terminal-header-tag but different styling */
  background-color: var(--terminal-magenta);
  color: var(--terminal-black);
  font-weight: bold;
  padding: 2px 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terminal-title {
  /* Similar to .terminal-header-content but different styling */
  padding: 2px 10px;
  color: var(--terminal-magenta);
  font-size: 14px;
  flex-grow: 1;
  text-align: left;
  /* Overrides text-align: center if applied to same element */
}

/* Terminal window body content */
.terminal-body {
  padding: 5px 10px;
  color: var(--terminal-magenta);
  min-height: 30px;
}

/* File listings */
.terminal-files {
  /* Different structure than .terminal-file-list */
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.terminal-file {
  /* Different structure than .terminal-file-name */
  color: var(--terminal-magenta);
}

/* Command prompt styling */
.terminal-prompt-container {
  /* Different structure than .terminal-prompt */
  margin: 10px 0;
  border: 1px solid var(--terminal-green);
  background-color: rgba(0, 15, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  display: flex;
  height: 22px;
  align-items: center;
}

.terminal-user {
  /* Different structure than .terminal-prompt-user */
  background-color: var(--terminal-green);
  color: var(--terminal-black);
  font-weight: bold;
  padding: 0 5px;
  margin-right: 5px;
  height: 100%;
  display: flex;
  align-items: center;
}

.terminal-path {
  /* Overrides/Complements styles from first file's .terminal-prompt-path */
  color: var(--terminal-bright-green);
  /* Overrides #90EE90 */
  margin-right: 10px;
  /* Already 10px */
}

.terminal-input {
  /* Overrides/Complements styles from first file */
  background: transparent;
  /* Overrides transparent */
  border: none;
  /* Already none */
  outline: none;
  /* Already none */
  color: var(--terminal-green);
  /* Overrides #00ff00 */
  font-family: inherit;
  /* Already inherit */
  font-size: inherit;
  /* Already inherit */
  width: 100%;
  /* Added */
  padding: 0;
  /* Already 0 */
  margin: 0;
  /* Added */
}

/* Blinking cursor */
.terminal-cursor {
  /* Overrides/Complements styles from first file */
  display: inline-block;
  /* Added */
  width: 8px;
  /* Already 8px */
  height: 14px;
  /* Overrides 16px */
  background-color: var(--terminal-green);
  /* Overrides #00ff00 */
  margin-left: 2px;
  /* Already 2px */
  animation: blink 1s step-end infinite;
  /* Already defined */
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* Log messages */
.terminal-log {
  /* Different structure than .terminal-line */
  color: var(--terminal-green);
  margin: 2px 0;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-log-id {
  color: var(--terminal-gray);
  margin-right: 5px;
}

.terminal-log-type {
  color: var(--terminal-green);
  margin-right: 5px;
  font-weight: bold;
}

.terminal-log-type-init {
  color: var(--terminal-cyan);
}

.terminal-log-type-warn {
  color: var(--terminal-yellow);
}

.terminal-log-type-fail {
  color: var(--terminal-red);
}

.terminal-log-type-ok {
  color: var(--terminal-green);
}

/* DECRYPT DIALOG */
.decrypt-dialog {
  /* Different structure than .terminal-dialog */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--terminal-green);
  background-color: rgba(0, 15, 0, 0.9);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  width: 80%;
  max-width: 600px;
  z-index: 100;
  /* Higher z-index than .terminal-dialog */
}

.decrypt-header {
  background-color: var(--terminal-green);
  color: var(--terminal-black);
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.decrypt-title {
  font-weight: bold;
  font-size: 14px;
}

.decrypt-close {
  cursor: pointer;
  font-weight: bold;
}

.decrypt-body {
  padding: 15px;
}

.decrypt-input-field {
  width: 100%;
  background-color: rgba(0, 30, 0, 0.7);
  border: 1px solid var(--terminal-green);
  color: var(--terminal-green);
  padding: 8px;
  margin-bottom: 15px;
  font-family: inherit;
  font-size: inherit;
}

.decrypt-keypad {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
}

.decrypt-key {
  background-color: rgba(0, 30, 0, 0.8);
  border: 1px solid var(--terminal-green);
  color: var(--terminal-green);
  padding: 8px;
  text-align: center;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.decrypt-key:hover {
  background-color: rgba(0, 60, 0, 0.8);
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.7);
}

/* System logs */
.system-log {
  /* Different structure than .terminal-line */
  color: var(--terminal-green);
  margin: 2px 0;
  display: flex;
}

.system-log-id {
  color: var(--terminal-gray);
  white-space: nowrap;
  margin-right: 10px;
}

.system-log-bracket {
  color: var(--terminal-green);
}

.system-log-type {
  margin: 0 5px;
}

.system-log-content {
  color: var(--terminal-green);
  margin-left: 5px;
}

/* Status line at bottom */
.terminal-status {
  /* Different structure than .terminal-status-line */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 18px;
  background-color: var(--terminal-black);
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.terminal-status-ip {
  /* Overrides/Complements styles from first file's .terminal-status-ip */
  color: var(--terminal-magenta);
  /* Overrides font-weight: bold */
  padding-left: 10px;
  font-weight: normal;
  /* Resets font-weight */
}

.terminal-status-time {
  color: var(--terminal-magenta);
  padding-right: 10px;
}

/* CRT and Scanline effects */
/* Note: These complement .terminal-scanlines and .crt-effect from the first file */
.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  animation: scanline 10s linear infinite;
  opacity: 0.3;
  z-index: 8;
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(100%);
  }
}

.crt-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 9;
}

.crt-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 60px rgba(0, 255, 0, 0.3);
  pointer-events: none;
  z-index: 10;
}

.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    transparent 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
  z-index: 7;
}

/* --- End of terminal.css --- */

/* Example HTML Structure Comment from terminal.css (for reference) */
/*
<div class="terminal-container">
  <div class="terminal-connection-status">
    <div class="terminal-connection-text">Opening Connection to Server 0.4.5-46</div>
    <div class="terminal-ip-address">8142.a5.09.1307</div>
  </div>

  <div class="terminal-content">
    <div class="system-log">
      <span class="system-log-id">[ID-317#A3]</span>
      <span class="system-log-bracket">[</span>
      <span class="system-log-type system-log-type-ok">OK</span>
      <span class="system-log-bracket">]</span>
      <span class="system-log-content">Check completed with minor discrepancies (J-1WGX). Integrity check passed.</span>
    </div>

    <div class="terminal-window">
      <div class="terminal-header">
        <div class="terminal-tag">TERMINAL</div>
        <div class="terminal-title"></div>
      </div>
      <div class="terminal-body">
        <div>Welcome to the CyberAcme Systems Inc. Mainframe Terminal!</div>
      </div>
    </div>

    <div class="terminal-prompt-container">
      <div class="terminal-user">USER</div>
      <div class="terminal-path">/</div>
      <input type="text" class="terminal-input" />
      <div class="terminal-cursor"></div>
    </div>

    <div class="terminal-window">
      <div class="terminal-header">
        <div class="terminal-tag">TERMINAL</div>
        <div class="terminal-title"></div>
      </div>
      <div class="terminal-body">
        <div>The folder root contains the following files:</div>
        <div class="terminal-files">
          <span class="terminal-file">Command_History</span>
          <span class="terminal-file">Commerce</span>
          <span class="terminal-file">Diagnostics</span>
          <span class="terminal-file">Education</span>
          <span class="terminal-file">Ethics</span>
          <span class="terminal-file">Innovation</span>
        </div>
      </div>
    </div>
  </div>

  <div class="terminal-status">
    <div class="terminal-status-ip">&lt;931.461.60231.14.vt920&gt;</div>
    <div class="terminal-status-time">13:10:53</div>
  </div>

  <div class="scanline"></div>
  <div class="crt-lines"></div>
  <div class="crt-glow"></div>
  <div class="vignette"></div>
</div>
*/
```
