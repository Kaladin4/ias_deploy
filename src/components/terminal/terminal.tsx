import { ScrollArea } from "@/components/ui/scroll-area"

interface TerminalProps {
  executionLog: string[]
}

export function Terminal({ executionLog }: TerminalProps) {
  if (executionLog.length === 0) {
    return null
  }

  return (
    <div className="mt-4 rounded-md border border-slate-800 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Execution Log
      </p>
      <ScrollArea className="h-24">     
        <div className="space-y-1">
          {executionLog.slice(-10).map((log, index) => (
            <p
              key={index}
              className="font-mono text-xs text-slate-300"
            >
              {log}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
