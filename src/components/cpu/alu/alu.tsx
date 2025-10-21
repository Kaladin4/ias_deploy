import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ALUProps = {
  isActive: boolean
}

export function ALU({ isActive }: ALUProps) {
  const { t } = useTranslation()

  return (
    <Card className="relative overflow-hidden">
      <div className={cn(
        "absolute inset-0 pointer-events-none bg-blue-500/5 rounded-lg transition-opacity duration-300",
        isActive ? "opacity-100 bg-blue-900/40" : "opacity-0"
      )} />
      <CardHeader className="p-4 pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-200">
            ALU
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 relative z-10">
        <div className="text-xs text-muted-foreground">
          {t("alu.description")}
        </div>
      </CardContent>
    </Card>
  )
}
