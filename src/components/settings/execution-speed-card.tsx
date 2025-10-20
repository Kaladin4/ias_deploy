import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const SLIDER_MIN = 200
const SLIDER_MAX = 2000
const SLIDER_STEP = 100

const sliderToInterval = (value: number) => SLIDER_MAX - value + SLIDER_MIN
const intervalToSlider = (value: number) => SLIDER_MAX - value + SLIDER_MIN

export interface ExecutionSpeedCardProps {
  executionSpeed: number
  onExecutionSpeedChange: (value: number) => void
}

export function ExecutionSpeedCard({
  executionSpeed,
  onExecutionSpeedChange,
}: ExecutionSpeedCardProps) {
  const { t } = useTranslation()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = Number(event.target.value)
    onExecutionSpeedChange(sliderToInterval(sliderValue))
  }

  const delaySeconds = (executionSpeed / 1000).toFixed(1)
  const stepsPerSecond = Math.round(1000 / executionSpeed)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("executionSpeed.title")}</CardTitle>
        <CardDescription>{t("executionSpeed.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-between text-foreground">
          <span>{t("executionSpeed.delay", { seconds: delaySeconds })}</span>
          <span>
            {t("executionSpeed.stepsPerSecond", { count: stepsPerSecond })}
          </span>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="execution-speed"
            className="text-xs uppercase tracking-wide text-muted-foreground"
          >
            {t("executionSpeed.sliderLabel")}
          </Label>
          <input
            id="execution-speed"
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={intervalToSlider(executionSpeed)}
            onChange={handleChange}
            className="w-full accent-primary"
            aria-valuemin={SLIDER_MIN}
            aria-valuemax={SLIDER_MAX}
            aria-valuenow={executionSpeed}
            aria-label={t("executionSpeed.sliderLabel")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
