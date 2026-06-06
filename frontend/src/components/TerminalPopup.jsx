import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { Terminal } from "./ui/terminal";
import { sendCommand } from "@/lib/lss";


const TerminalCtx = createContext(null);

export function TerminalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState("");

  const openTerminal = () => setIsOpen(true);
  const closeTerminal = () => setIsOpen(false);

  const handleCommand = async (cmd) => {

    setOutput(prev => prev + `\n~ ${cmd}\n`);
try{

    const response = await sendCommand(cmd);
    setOutput(prev => prev + `${response.message}\n`);
}catch{}
  }

const clearOutput = () => setOutput("");

return (
  <TerminalCtx.Provider value={{ isOpen, output, openTerminal, closeTerminal, handleCommand, clearOutput }}>
    {children}
  </TerminalCtx.Provider>
);
}

export const useTerminal = () => useContext(TerminalCtx);


export function TerminalPopup() {
  const { isOpen, output, closeTerminal, handleCommand, clearOutput } = useTerminal();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeTerminal}
    >
      <div
        className="relative w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeTerminal}
          className="absolute -top-3 -right-3 z-10 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 p-1 transition-colors"
          aria-label="Close terminal"
        >
          <X className="h-4 w-4" />
        </button>
        <Terminal
          output={output}
          isStreaming={false}
          onClear={clearOutput}
          onCommand={handleCommand}
        />
      </div>
    </div>
  );
}
