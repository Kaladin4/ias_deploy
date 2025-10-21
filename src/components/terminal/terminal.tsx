import { useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface TerminalProps {
  executionLog: string[]
}

const LOG_PREFIXES = [
  { key: "fetch", prefix: "FETCH:" },
  { key: "fetchEs", prefix: "BUSCA" },
  { key: "decode", prefix: "DECODE:" },
  { key: "decodeEs", prefix: "DECODE:" },
  { key: "load", prefix: "LOAD:" },
  { key: "add", prefix: "ADD:" },
  { key: "store", prefix: "STORE:" },
  { key: "mul", prefix: "MUL:" },
  { key: "div", prefix: "DIV:" },
  { key: "sub", prefix: "SUB:" },
  { key: "ldmq", prefix: "LDMQ:" },
  { key: "interrupt", prefix: "INTERRUPT" },
  { key: "interruptEs", prefix: "INTERRUPCIÓN" },
]

function getLogColor(log: string, activePrefixes: string[]): string {
  if (activePrefixes.some((prefix) => log.startsWith(prefix))) return "text-green-400"
  if (log.startsWith("FETCH:") || log.startsWith("BUSCA")) return "text-blue-400"
  if (log.startsWith("DECODE:")) return "text-yellow-400"
  if (log.startsWith("INTERRUPT") || log.startsWith("INTERRUPCIÓN")) return "text-purple-400"
  if (log.includes("triggered") || log.includes("activada")) return "text-orange-400"
  if (log.includes("completed") || log.includes("completado") || log.includes("loaded") || log.includes("cargado")) return "text-cyan-400"
  if (log.startsWith("Starting") || log.startsWith("Iniciando")) return "text-emerald-400"
  return "text-slate-300"
}

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
  const { t } = useTranslation()
  const actionPrefixes = useMemo(
    () =>
      LOG_PREFIXES.filter(({ key }) =>
        ["load", "add", "store", "mul", "div", "sub", "ldmq"].includes(key),
      ).map(({ prefix }) => prefix),
    [],
  )
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
    <div className="mb-4 rounded-md border border-slate-800 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t("terminal.title")} ({t("terminal.entries", { count: executionLog.length })})
        </p>
        <Button
          onClick={() => downloadLogs(executionLog)}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          <Download className="mr-1 h-3 w-3" />
          {t("terminal.download")}
        </Button>
      </div>
      <ScrollArea className="h-64" ref={scrollRef}>
        <div className="space-y-0.5 overflow-x-auto">
          {executionLog.map((log, index) => (
            <p
              key={index}
              className={`font-mono text-xs leading-tight ${getLogColor(log, actionPrefixes)} whitespace-nowrap`}
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
