# Key Components

## Core Terminal UI Components

TerminalWindow: Pure container component
```tsx
<TerminalWindow>
{/_ Your content goes here _/}
</TerminalWindow>
```

TerminalHeader: Header component that takes only a title
```tsx
<TerminalHeader title="Your Title Here" />
```

TerminalOutput: Generic container for output content
```tsx
<TerminalOutput>
{/_ Your terminal output lines go here _/}
</TerminalOutput>
```

TerminalOutputLine: Individual line with styling options
```tsx
<TerminalOutputLine type="error" prefix="FAIL" timestamp="13:07:45">
Error message here
</TerminalOutputLine>
```

TerminalPrompt: Input component that takes a path and callback
```tsx
<TerminalPrompt 
  path="Legislation/Security" 
  onCommand={handleCommand} 
/>
```

TerminalFileList: Takes only a title and array of files
```tsx
<TerminalFileList 
  title="Directory contents:" 
  files={yourFilesArray}
  onFileClick={handleFileClick} 
/>

TerminalDialog: Modal dialog container
```tsx
<TerminalDialog title="DECRYPT INPUT" onClose={closeDialog}>
{/_ Dialog content _/}
</TerminalDialog>
```

Visual Effect Components

CRTEffect: Configurable screen effect component
```tsx
<CRTEffect intensity={0.7} flickerFrequency={0.03} scanlineSpacing={4} />
```

These components are completely decoupled from your data and logic. They're designed to be styled containers that you can populate with your command system's output. No example data, no hardcoded content - just the visual UI elements.

## Integration Example

Here's how you'd integrate these with your existing command system:

```tsx
// Inside your terminal component
return (
  <TerminalWindow>
    <CRTEffect />

    {showHeader && <TerminalHeader title={headerTitle} />}

    <TerminalOutput>
      {commandOutputs.map((output, index) => (
        <TerminalOutputLine
          key={index}
          type={output.type}
          prefix={output.prefix}
          timestamp={output.timestamp}
        >
          {output.content}
        </TerminalOutputLine>
      ))}
    </TerminalOutput>

    {currentDirectory && (
      <TerminalFileList
        title={`The folder ${currentDirectory} contains the following files:`}
        files={directoryContents}
        onFileClick={handleFileClick}
      />
    )}

    <TerminalPrompt
      path={currentPath}
      onCommand={executeCommand}
      disabled={isProcessing}
    />

    <TerminalStatusLine ipAddress={ipAddress} />

    {showDecryptDialog && (
      <TerminalDialog
        title="DECRYPT INPUT"
        onClose={() => setShowDecryptDialog(false)}
      >
        {/* Your decrypt UI */}
      </TerminalDialog>
    )}
  </TerminalWindow>
);
```
