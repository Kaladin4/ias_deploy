import { useTranslation } from "react-i18next"

export function About() {
  const { t } = useTranslation()

  return (
    <article className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("about.title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("about.description")}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("about.howItWorks.title")}
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("about.howItWorks.description")}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("about.designChoices.title")}
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("about.designChoices.description")}
        </p>
      </section>
    </article>
  )
}
