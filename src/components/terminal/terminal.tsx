import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useEffect, useRef } from "react"

interface TerminalProps {
  executionLog: string[]
}

function getLogColor(log: string): string {
  if (log.startsWith("FETCH:")) return "text-blue-400"
  if (log.startsWith("DECODE:")) return "text-yellow-400"
  if (log.startsWith("EXECUTE:") || log.startsWith("LOAD:") || log.startsWith("ADD:") || log.startsWith("STORE:") || log.startsWith("MUL:") || log.startsWith("DIV:") || log.startsWith("SUB:") || log.startsWith("LDMQ:")) return "text-green-400"
  if (log.startsWith("INTERRUPT")) return "text-purple-400"
  if (log.includes("triggered")) return "text-orange-400"
  if (log.includes("completed") || log.includes("loaded")) return "text-cyan-400"
  if (log.startsWith("Starting")) return "text-emerald-400"
  return "text-slate-300"
}ScrollArea

function downloadLogs(logs: string[]) {
  const content = logs.join("\n")
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `ias-execution-log-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function Terminal({ executionLog }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [executionLog])

  if (executionLog.length === 0) {
    return null
  }

  return (
    <div className="mt-4 rounded-md border border-slate-800 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Execution Log ({executionLog.length} entries)
        </p>
        <Button
          onClick={() => downloadLogs(executionLog)}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          <Download className="mr-1 h-3 w-3" />
          Download
        </Button>
      </div>
      <ScrollArea className="h-64" ref={scrollRef}>
        <div className="space-y-0.5 overflow-x-auto">
          {executionLog.map((log, index) => (
            <p
              key={index}
              className={`font-mono text-xs leading-tight ${getLogColor(log)} whitespace-nowrap`}
            >
              {log}
            </p>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
