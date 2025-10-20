import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n"

export function LanguageToggleCard() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (language: SupportedLanguage) => {
    i18n.changeLanguage(language)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("language.title")}</CardTitle>
        <CardDescription>{t("language.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              variant={i18n.language === lang ? "default" : "outline"}
              className="flex-1"
            >
              {t(`language.options.${lang}`)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
