import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type RecordProps = {
  label: string
  bits: number
  value: string
  onChange: (value: string) => void
  isHighlighted?: boolean
}

export function Record({ label, bits, value, onChange, isHighlighted = false }: RecordProps) {
  const { t } = useTranslation()

  return (
    <Card className={isHighlighted ? "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/50 transition-all duration-300" : ""}>
      <CardHeader className="p-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={`text-xs font-semibold tracking-[0.15em] uppercase ${isHighlighted ? "text-yellow-400" : "text-slate-200"}`}>
            {label}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`border text-[10px] px-1.5 py-0 ${isHighlighted ? "border-yellow-500/70 bg-yellow-900/30 text-yellow-300" : "border-slate-700/70 bg-slate-900/80 text-slate-200"}`}
          >
            {t("record.bits", { count: bits })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="numeric"
          placeholder={"0".repeat(bits)}
          maxLength={bits}
          aria-label={t("record.ariaLabel", { label })}
          autoComplete="off"
          className={`font-mono text-xs tracking-tight border-slate-800/70 h-8 px-2 ${isHighlighted ? "bg-yellow-950/30 border-yellow-500/50 text-yellow-100" : "bg-slate-950/70"}`}
        />
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          <span>{t("record.binary")}</span>
          <span>
            {value.length}/{bits}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
