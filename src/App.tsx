import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { About } from "@/components/about/about"
import { Memory } from "@/components/memory/memory"
import { OperationsTable } from "@/components/operations-table/operations-table"
import { CPU, type RegisterKey, INITIAL_REGISTERS, WORD_WIDTH } from "@/components/cpu/cpu"
import { WireArchitecture } from "@/components/buses/wire-architecture"
import { ExecutionControls } from "@/components/execution-controls/execution-controls"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExecutionSpeedCard } from "@/components/settings/execution-speed-card"
import { TipsCard } from "@/components/settings/tips-card"
import { LanguageToggleCard } from "@/components/settings/language-toggle-card"
import { getBusActivity } from "@/lib/bus-activity"
import { loadProgramIntoMemory, SAMPLE_PROGRAM } from "@/data/sample-program"
import { executeStep, type ExecutionState } from "@/lib/execution"
import { parseCSV } from "@/lib/csv-parser"

const MEMORY_SIZE = 1004

const INITIAL_MEMORY = Array.from({ length: MEMORY_SIZE }, () => "")
function App() {
  const { t } = useTranslation()
  const [memory, setMemory] = useState<string[]>(INITIAL_MEMORY)
  const [registers, setRegisters] = useState<Record<RegisterKey, string>>(
    INITIAL_REGISTERS,
  )
  const [status, setStatus] = useState<"idle" | "running" | "stepping">("idle")
  const [executionPhase, setExecutionPhase] = useState<
    "fetch" | "decode" | "execute" | "idle" | "halted"
  >("idle")
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [isAutoRunning, setIsAutoRunning] = useState(false)
  const [pendingInterruptions, setPendingInterruptions] = useState<number[]>([])
  const [resolvedInterruptions, setResolvedInterruptions] = useState<number>(0)
  const [executionSpeed, setExecutionSpeed] = useState<number>(800)
  const [instructionCount, setInstructionCount] = useState<number>(0)

  // Check if memory has any content
  const hasMemoryContent = memory.some((value) => value.length > 0)

  // Maximum instructions to prevent infinite loops
  const MAX_INSTRUCTIONS = 10000


  const handleMemoryChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^01]/g, "").slice(0, WORD_WIDTH)
    setMemory((prev) => {
      const next = [...prev]
      next[index] = sanitized
      return next
    })
  }


  const handleLoadProgram = () => {
    const programMemory = loadProgramIntoMemory(SAMPLE_PROGRAM)
    setMemory((prev) => {
      const next = [...prev]
      // Clear addresses 0-999 to refresh memory state
      for (let i = 0; i < 1000; i++) {
        next[i] = ""
      }
      // Load new program data
      Object.entries(programMemory).forEach(([addr, value]) => {
        next[parseInt(addr)] = value
      })
      // Addresses 1000-1003 remain untouched (interrupt handlers)
      return next
    })
    setExecutionLog((prev) => [...prev, t("logs.sampleLoaded")])
    setExecutionPhase("idle")
    setRegisters((prev) => ({ ...prev, PC: "0000000000" }))
  }

  const handleLoadCSV = async (file: File) => {
    try {
      const text = await file.text()
      const result = parseCSV(text)

      if (!result.success) {
        const errorMsg = result.lineNumber
          ? t("logs.csvError", { error: result.error, line: result.lineNumber })
          : t("logs.csvError", { error: result.error, line: "" })
        setExecutionLog((prev) => [...prev, errorMsg])
        return
      }

      if (result.memory) {
        const loadedMemory = result.memory
        setMemory((prev) => {
          const next = [...prev]
          // Preserve interrupt handler addresses (1000-1003) before loading CSV
          const preservedInterrupts = {
            1000: prev[1000],
            1001: prev[1001],
            1002: prev[1002],
            1003: prev[1003],
          }
          
          // Clear addresses 0-999 to refresh memory state
          for (let i = 0; i < 1000; i++) {
            next[i] = ""
          }
          
          // Load CSV data (only addresses 0-999)
          Object.entries(loadedMemory).forEach(([addr, value]) => {
            next[parseInt(addr)] = value
          })
          
          // Restore preserved interrupt handlers
          next[1000] = preservedInterrupts[1000]
          next[1001] = preservedInterrupts[1001]
          next[1002] = preservedInterrupts[1002]
          next[1003] = preservedInterrupts[1003]
          
          return next
        })
        const count = Object.keys(loadedMemory).length
        setExecutionLog((prev) => [
          ...prev,
          t("logs.csvLoaded", { count, filename: file.name }),
        ])
        setExecutionPhase("idle")
        setRegisters((prev) => ({ ...prev, PC: "0000000000" }))
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error"
      setExecutionLog((prev) => [
        ...prev,
        t("logs.csvError", { error: errorMsg, line: "" }),
      ])
    }
  }

  const handleStep = () => {
    const state: ExecutionState = {
      registers,
      memory,
      phase: executionPhase,
      currentInstruction: null,
      log: executionLog,
    }

    const result = executeStep(state)
    setRegisters(result.registers)
    setMemory(result.memory)
    setExecutionPhase(result.phase)
    // Use detailed logs if available, otherwise fall back to single message
    if (result.detailedLogs && result.detailedLogs.length > 0) {
      setExecutionLog((prev) => [...prev, ...result.detailedLogs!])
    } else {
      setExecutionLog((prev) => [...prev, result.message])
    }
  }

  const handleStart = () => {
    setStatus("running")
    setIsAutoRunning(true)
    setExecutionPhase("fetch")
    setInstructionCount(0)
  }

  const handleStop = () => {
    setStatus("idle")
    setIsAutoRunning(false)
    setExecutionPhase("idle")
  }

  const handleReset = () => {
    setRegisters(INITIAL_REGISTERS)
    setMemory(INITIAL_MEMORY)
    setExecutionPhase("idle")
    setExecutionLog([])
    setStatus("idle")
    setIsAutoRunning(false)
    setPendingInterruptions([])
    setResolvedInterruptions(0)
    setInstructionCount(0)
  }

  const handleTriggerInterrupt = () => {
    const interruptId = Date.now() % 10000 // Simple interrupt ID
    setPendingInterruptions((prev) => [...prev, interruptId])
    setExecutionLog((prev) => [
      ...prev,
      t("logs.interruptTriggered", { id: interruptId }),
    ])
  }

  // Auto-run effect
  useEffect(() => {
    if (!isAutoRunning || status !== "running") return

    const interval = setInterval(() => {
      // Check for pending interruptions before fetch phase
      if (executionPhase === "fetch" && pendingInterruptions.length > 0) {
        const interruptId = pendingInterruptions[0]
        const currentPC = parseInt(registers.PC, 2)
        
        // Save current PC to memory[1001]
        const newMemory = [...memory]
        newMemory[1001] = registers.PC
        
        // Initialize counter at 1003 if not set
        if (!newMemory[1003]) {
          newMemory[1003] = "0000000000000"
        }
        
        // Fetch and execute instruction at memory[1002] (ADD from address 1003)
        const interruptInstruction = newMemory[1002] || "1100000001111" // ADD from address 1003
        
        // Parse the instruction to get opcode and address
        const address = interruptInstruction.slice(3, 13)
        const memAddr = parseInt(address, 2)
        
        // Execute ADD instruction: AC = AC + Memory[1003]
        const acValue = parseInt(registers.AC, 2)
        const counterValue = parseInt(newMemory[memAddr] || "0000000000000", 2)
        const result = (acValue + counterValue) & 0x1fff

        // Update AC with result
        const newRegisters = { ...registers }
        newRegisters.AC = result.toString(2).padStart(13, "0")
        
        // Also increment the counter at 1003 directly (since we're treating it as a counter)
        const newCounter = (counterValue + 1) & 0x1fff
        newMemory[1003] = newCounter.toString(2).padStart(13, "0")
        
        setRegisters(newRegisters)
        setMemory(newMemory)
        setPendingInterruptions((prev) => prev.slice(1))
        setResolvedInterruptions((prev) => prev + 1)
        setExecutionLog((prev) => [
          ...prev,
          t("logs.interruptHandled", {
            id: interruptId,
            pc: currentPC.toString(10),
            counter: newCounter.toString(10),
          }),
        ])

        return
      }

      const state: ExecutionState = {
        registers,
        memory,
        phase: executionPhase,
        currentInstruction: null,
        log: executionLog,
      }

      const result = executeStep(state)
      setRegisters(result.registers)
      setMemory(result.memory)
      setExecutionPhase(result.phase)
      // Use detailed logs if available, otherwise fall back to single message
      if (result.detailedLogs && result.detailedLogs.length > 0) {
        setExecutionLog((prev) => [...prev, ...result.detailedLogs!])
      } else {
        setExecutionLog((prev) => [...prev, result.message])
      }

      // Increment instruction counter
      setInstructionCount((prev) => prev + 1)

      // Stop if halted phase is reached
      if (result.phase === "halted") {
        setIsAutoRunning(false)
        setStatus("idle")
        setExecutionLog((prev) => [
          ...prev,
          t("logs.programCompleted", { count: resolvedInterruptions }),
        ])
        return
      }

      // Safety: Stop if max instructions exceeded
      if (instructionCount >= MAX_INSTRUCTIONS) {
        setIsAutoRunning(false)
        setStatus("idle")
        setExecutionPhase("idle")
        setExecutionLog((prev) => [
          ...prev,
          `Execution stopped: Maximum instruction limit (${MAX_INSTRUCTIONS}) reached. Possible infinite loop.`,
        ])
      }
    }, executionSpeed)

    return () => clearInterval(interval)
  }, [
    isAutoRunning,
    status,
    registers,
    memory,
    executionPhase,
    executionLog,
    pendingInterruptions,
    resolvedInterruptions,
    executionSpeed,
    instructionCount,
    t,
  ])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <Tabs defaultValue="ias" className="w-full">
          <TabsList className="grid w-full max-w-sm grid-cols-3">
            <TabsTrigger value="ias">{t("app.tabs.ias")}</TabsTrigger>
            <TabsTrigger value="settings">{t("app.tabs.settings")}</TabsTrigger>
            <TabsTrigger value="about">{t("app.tabs.about")}</TabsTrigger>
          </TabsList>

          <TabsContent value="ias" className="mt-6">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {t("app.title")}
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {t("app.description")}
              </p>
            </header>

            <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-6">
                <CPU
                  registers={registers}
                  setRegisters={setRegisters}
                  currentOpcode={executionPhase === "execute" ? registers.IR : undefined}
                />
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <WireArchitecture
                    activity={getBusActivity(executionPhase, registers.IR)}
                  />
                </div>
              </div>

              <div className="lg:col-span-2 xl:col-span-1">
                <Memory
                  memory={memory}
                  wordWidth={WORD_WIDTH}
                  onMemoryChange={handleMemoryChange}
                />
              </div>

              <OperationsTable />

              <div className="lg:col-span-1 xl:col-span-2">
                <ExecutionControls
                  onLoadSample={handleLoadProgram}
                  onLoadCSV={handleLoadCSV}
                  onStep={handleStep}
                  onStart={handleStart}
                  onStop={handleStop}
                  onReset={handleReset}
                  onTriggerInterrupt={handleTriggerInterrupt}
                  status={status}
                  hasMemoryContent={hasMemoryContent}
                  executionPhase={executionPhase}
                  executionLog={executionLog}
                  pendingInterruptions={pendingInterruptions.length}
                  resolvedInterruptions={resolvedInterruptions}
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ExecutionSpeedCard
                executionSpeed={executionSpeed}
                onExecutionSpeedChange={setExecutionSpeed}
              />

              <TipsCard />

              <LanguageToggleCard />
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <About />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
