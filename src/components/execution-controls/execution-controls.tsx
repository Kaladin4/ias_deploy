import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Terminal } from "@/components/terminal/terminal"
import { cn } from "@/lib/utils"

export type ExecutionPhase = "fetch" | "decode" | "execute" | "idle" | "halted"
export type ExecutionStatus = "idle" | "running" | "stepping"

interface ExecutionControlsProps {
  onLoadSample: () => void
  onStep: () => void
  onStart: () => void
  onStop: () => void
  onReset: () => void
  status: ExecutionStatus
  hasMemoryContent: boolean
  executionPhase: ExecutionPhase
  executionLog: string[]
  className?: string
}

export function ExecutionControls({
  onLoadSample,
  onStep,
  onStart,
  onStop,
  onReset,
  status,
  hasMemoryContent,
  executionPhase,
  executionLog,
  className,
}: ExecutionControlsProps) {
  const isRunning = status === "running"
  const isHalted = executionPhase === "halted"
  const disableActions = !hasMemoryContent || isRunning || isHalted

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Execution Controls</CardTitle>
        <CardDescription>
          Begin the fetch-decode-execute simulation. Visualization steps will
          appear here in upcoming iterations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={onLoadSample} variant="secondary" disabled={isRunning}>
              Load Sample Program
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    onClick={onStep}
                    variant="outline"
                    disabled={disableActions}
                  >
                    Step
                  </Button>
                </span>
              </TooltipTrigger>
              {(!hasMemoryContent || isHalted) && (
                <TooltipContent>
                  <p className="text-xs">
                    {!hasMemoryContent
                      ? "Load a program or add memory content first"
                      : "Execution halted"}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button onClick={onStart} disabled={disableActions}>
                    Run
                  </Button>
                </span>
              </TooltipTrigger>
              {(!hasMemoryContent || isHalted) && (
                <TooltipContent>
                  <p className="text-xs">
                    {!hasMemoryContent
                      ? "Load a program or add memory content first"
                      : "Execution halted"}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>

            <Button onClick={onStop} variant="destructive" disabled={!isRunning}>
              Stop
            </Button>

            <Button onClick={onReset} variant="secondary">
              Reset
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Phase: {executionPhase.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Status: {isRunning ? "Running" : "Idle"}
              </span>
            </div>
          </div>
        </TooltipProvider>

        <Terminal executionLog={executionLog} />
      </CardContent>
    </Card>
  )
}
