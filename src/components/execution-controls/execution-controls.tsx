import { useTranslation } from "react-i18next"

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
  onTriggerInterrupt: () => void
  status: ExecutionStatus
  hasMemoryContent: boolean
  executionPhase: ExecutionPhase
  executionLog: string[]
  pendingInterruptions: number
  resolvedInterruptions: number
  className?: string
}

export function ExecutionControls({
  onLoadSample,
  onStep,
  onStart,
  onStop,
  onReset,
  onTriggerInterrupt,
  status,
  hasMemoryContent,
  executionPhase,
  executionLog,
  pendingInterruptions,
  resolvedInterruptions,
  className,
}: ExecutionControlsProps) {
  const isRunning = status === "running"
  const isHalted = executionPhase === "halted"
  const disableActions = !hasMemoryContent || isRunning || isHalted
  const { t } = useTranslation()

  const phaseLabel = t(`executionPhases.${executionPhase}`)
  const statusLabel = t(`executionControls.info.statusValue.${status}`)
  const tooltipMessage = !hasMemoryContent
    ? t("executionControls.tooltip.needsMemory")
    : t("executionControls.tooltip.halted")

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("executionControls.title")}</CardTitle>
        <CardDescription>{t("executionControls.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={onLoadSample} variant="secondary" disabled={isRunning}>
              {t("executionControls.buttons.loadSample")}
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    onClick={onStep}
                    variant="outline"
                    disabled={disableActions}
                  >
                    {t("executionControls.buttons.step")}
                  </Button>
                </span>
              </TooltipTrigger>
              {(!hasMemoryContent || isHalted) && (
                <TooltipContent>
                  <p className="text-xs">{tooltipMessage}</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button onClick={onStart} disabled={disableActions}>
                    {t("executionControls.buttons.run")}
                  </Button>
                </span>
              </TooltipTrigger>
              {(!hasMemoryContent || isHalted) && (
                <TooltipContent>
                  <p className="text-xs">{tooltipMessage}</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Button onClick={onStop} variant="destructive" disabled={!isRunning}>
              {t("executionControls.buttons.stop")}
            </Button>

            <Button onClick={onReset} variant="secondary">
              {t("executionControls.buttons.reset")}
            </Button>

            <Button 
              onClick={onTriggerInterrupt} 
              variant="outline"
              disabled={!isRunning}
            >
              {t("executionControls.buttons.triggerInterrupt")}
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t("executionControls.info.phase")}: {phaseLabel}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {t("executionControls.info.status")}: {statusLabel}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {t("executionControls.info.pending")}: {pendingInterruptions}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {t("executionControls.info.resolved")}: {resolvedInterruptions}
              </span>
            </div>
          </div>
        </TooltipProvider>

        <Terminal executionLog={executionLog} />
      </CardContent>
    </Card>
  )
}
