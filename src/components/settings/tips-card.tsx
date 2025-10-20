import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function TipsCard() {
  const { t } = useTranslation()
  const tips = useMemo(
    () => t("tips.items", { returnObjects: true }) as string[],
    [t],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tips.title")}</CardTitle>
        <CardDescription>{t("tips.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {tips.map((tip, index) => (
          <p key={index}>{tip}</p>
        ))}
      </CardContent>
    </Card>
  )
}
