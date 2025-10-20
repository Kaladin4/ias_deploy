import { useEffect, useState } from "react"

import { Memory } from "@/components/memory/memory"
import { OperationsTable } from "@/components/operations-table/operations-table"
import { CPU, type RegisterKey, INITIAL_REGISTERS, WORD_WIDTH } from "@/components/cpu/cpu"
import { WireArchitecture } from "@/components/buses/wire-architecture"
import { ExecutionControls } from "@/components/execution-controls/execution-controls"
import { getBusActivity } from "@/lib/bus-activity"
import { loadProgramIntoMemory, SAMPLE_PROGRAM } from "@/data/sample-program"
import { executeStep, type ExecutionState } from "@/lib/execution"

const MEMORY_SIZE = 1000

const INITIAL_MEMORY = Array.from({ length: MEMORY_SIZE }, () => "")
function App() {
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

  // Check if memory has any content
  const hasMemoryContent = memory.some((value) => value.length > 0)


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
      Object.entries(programMemory).forEach(([addr, value]) => {
        next[parseInt(addr)] = value
      })
      return next
    })
    setExecutionLog(["Sample program loaded into memory"])
    setExecutionPhase("idle")
    setRegisters((prev) => ({ ...prev, PC: "0000000000" }))
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
    setExecutionLog((prev) => [...prev, result.message])
  }

  const handleStart = () => {
    setStatus("running")
    setIsAutoRunning(true)
    setExecutionPhase("fetch")
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
  }

  // Auto-run effect
  useEffect(() => {
    if (!isAutoRunning || status !== "running") return

    const interval = setInterval(() => {
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
      setExecutionLog((prev) => [...prev, result.message])

      // Stop if we've cycled back to address 0 after starting
      const pc = parseInt(result.registers.PC, 2)
      if (pc >= 3 && result.phase === "fetch") {
        setIsAutoRunning(false)
        setStatus("idle")
        setExecutionPhase("idle")
      }
    }, 800)

    return () => clearInterval(interval)
  }, [isAutoRunning, status, registers, memory, executionPhase, executionLog])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            IAS Computer Simulator
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Configure the IAS memory and registers, then step through the
            execution to observe how instructions move through the machine.
          </p>
        </header>

        <section className="grid gap-8 xl:grid-cols-12 xl:auto-rows-min">
          <CPU
            className="xl:col-span-4 xl:col-start-1 xl:row-span-3 xl:self-start"
            registers={registers}
            setRegisters={setRegisters}
          />

          <OperationsTable className="xl:col-span-4 xl:col-start-1 xl:row-span-3 xl:row-start-4 xl:self-start" />

          <div className="relative xl:col-span-4 xl:col-start-5 xl:row-span-3">
            <WireArchitecture activity={getBusActivity(executionPhase, registers.IR)} />
          </div>

          <Memory
            className="xl:col-span-4 xl:col-start-9 xl:row-span-3 xl:self-start"
            memory={memory}
            wordWidth={WORD_WIDTH}
            onMemoryChange={handleMemoryChange}
          />

          <ExecutionControls
            className="xl:col-span-4 xl:col-start-9 xl:row-span-3 xl:row-start-4"
            onLoadSample={handleLoadProgram}
            onStep={handleStep}
            onStart={handleStart}
            onStop={handleStop}
            onReset={handleReset}
            status={status}
            hasMemoryContent={hasMemoryContent}
            executionPhase={executionPhase}
            executionLog={executionLog}
          />
        </section>
      </div>
    </div>
  )
}

export default App
