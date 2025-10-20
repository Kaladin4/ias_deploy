import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type RecordProps = {
  label: string
  bits: number
  value: string
  onChange: (value: string) => void
}

export function Record({ label, bits, value, onChange }: RecordProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-200">
            {label}
          </CardTitle>
          <Badge
            variant="secondary"
            className="border border-slate-700/70 bg-slate-900/80 text-slate-200"
          >
            {t("record.bits", { count: bits })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="numeric"
          placeholder={"0".repeat(bits)}
          maxLength={bits}
          aria-label={t("record.ariaLabel", { label })}
          autoComplete="off"
          className="font-mono text-sm tracking-wide border-slate-800/70 bg-slate-950/70"
        />
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{t("record.binary")}</span>
          <span>
            {value.length}/{bits}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
