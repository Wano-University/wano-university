import { CheckIcon, CopyIcon, TerminalIcon, Trash2Icon } from "lucide-react"
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function stripAnsi(str) {
  return str?.replace(/\x1b\[[0-9;]*m/g, "") ?? "";
}

const TerminalContext = createContext({
  output: "",
  isStreaming: false,
  autoScroll: true,
})

export const Terminal = ({
  output,
  isStreaming = false,
  autoScroll = true,
  onClear,
  onCommand,
  className,
  children,
  ...props
}) => (
  <TerminalContext.Provider value={{ output, isStreaming, autoScroll, onClear, onCommand }}>
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100",
        className
      )}
      {...props}>
      {children ?? (
        <>
          <TerminalHeader>
            <TerminalTitle />
            <div className="flex items-center gap-1">
              <TerminalStatus />
              <TerminalActions>
                <TerminalCopyButton />
                {onClear && <TerminalClearButton />}
              </TerminalActions>
            </div>
          </TerminalHeader>
          <TerminalContent />
          <TerminalInput />
        </>
      )}
    </div>
  </TerminalContext.Provider>
)

export const TerminalHeader = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-between border-zinc-800 border-b px-4 py-2",
      className
    )}
    {...props}>
    {children}
  </div>
)

export const TerminalTitle = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex items-center gap-2 text-sm text-zinc-400", className)}
    {...props}>
    <TerminalIcon className="size-4" />
    {children ?? "Terminal"}
  </div>
)

export const TerminalStatus = ({
  className,
  children,
  ...props
}) => {
  const { isStreaming } = useContext(TerminalContext)

  if (!isStreaming) {
    return null
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-xs text-zinc-400", className)}
      {...props}>
      {children ?? <span className="w-16" />}
    </div>
  );
}

export const TerminalActions = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
)

export const TerminalCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const { output } = useContext(TerminalContext)

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"))
      return
    }

    try {
      await navigator.clipboard.writeText(output)
      setIsCopied(true)
      onCopy?.()
      setTimeout(() => setIsCopied(false), timeout)
    } catch (error) {
      onError?.(error)
    }
  }

  const Icon = isCopied ? CheckIcon : CopyIcon

  return (
    <Button
      className={cn(
        "size-7 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        className
      )}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}>
      {children ?? <Icon size={14} />}
    </Button>
  );
}

export const TerminalClearButton = ({
  children,
  className,
  ...props
}) => {
  const { onClear } = useContext(TerminalContext)

  if (!onClear) {
    return null
  }

  return (
    <Button
      className={cn(
        "size-7 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        className
      )}
      onClick={onClear}
      size="icon"
      variant="ghost"
      {...props}>
      {children ?? <Trash2Icon size={14} />}
    </Button>
  );
}

export const TerminalContent = ({
  className,
  children,
  ...props
}) => {
  const { output, isStreaming, autoScroll } = useContext(TerminalContext)
  const containerRef = useRef(null)

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [output, autoScroll])

  return (
    <div
      className={cn("max-h-96 overflow-auto p-4 font-mono text-sm leading-relaxed", className)}
      ref={containerRef}
      {...props}>
      {children ?? (
        <pre className="whitespace-pre-wrap break-words">
          {stripAnsi(output)}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-zinc-100" />
          )}
        </pre>
      )}
    </div>
  );
}

export const TerminalInput = ({
  className,
  prompt = "~$",
  ...props
}) => {
  const { onCommand } = useContext(TerminalContext)
  const [value, setValue] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      onCommand?.(value.trim())
      setHistory(prev => [value.trim(), ...prev])
      setHistoryIndex(-1)
      setValue("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const nextIndex = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(nextIndex)
      setValue(history[nextIndex] ?? "")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = Math.max(historyIndex - 1, -1)
      setHistoryIndex(nextIndex)
      setValue(nextIndex === -1 ? "" : history[nextIndex])
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-zinc-800 px-4 py-2 font-mono text-sm",
        className
      )}
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      <span className="text-green-400 shrink-0">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-600 caret-green-400"
        placeholder="type a command..."
        autoComplete="off"
        spellCheck={false}
        autoFocus
      />
    </div>
  )
}

/** Demo component for preview */
export default function TerminalDemo() {
  const [output, setOutput] = useState(
    "✓ Compiled successfully in 1.2s\n→ Building pages...\n⚠ Warning: Large bundle size detected\n✓ Generated 24 static pages\n✓ Build completed"
  )

  const handleCommand = (cmd) => {
    setOutput(prev => prev + `\n~ ${cmd}\nCommand not found: ${cmd}`)
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <Terminal
        output={output}
        isStreaming={false}
        onClear={() => setOutput("")}
        onCommand={handleCommand}
      />
    </div>
  );
}
