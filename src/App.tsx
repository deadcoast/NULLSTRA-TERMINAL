import React, { useState } from 'react';
import { TerminalManager } from './components';

const App: React.FC = () => {
  const [showTerminal, setShowTerminal] = useState(true);

  return (
    <div className="min-h-screen bg-black">
      {showTerminal && (
        <TerminalManager
          initialSessions={[
            {
              id: 'main-terminal',
              name: 'Main Terminal',
              ipAddress: '931.461.60231.14.vt920',
            },
          ]}
          maxSessions={4}
        />
      )}
    </div>
  );
};

export default App;
