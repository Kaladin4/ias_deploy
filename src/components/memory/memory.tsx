import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type MemoryProps = {
  memory: string[]
  wordWidth: number
  onMemoryChange: (index: number, value: string) => void
  className?: string
}

export function Memory({ memory, wordWidth, onMemoryChange, className }: MemoryProps) {
  const { t } = useTranslation()

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("memory.title")}</CardTitle>
        <CardDescription>
          {t("memory.description", { wordWidth })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[900px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">
                  {t("memory.headers.address")}
                </TableHead>
                <TableHead>
                  {t("memory.headers.contents", { wordWidth })}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memory.map((word, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {index.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={word}
                      onChange={(event) =>
                        onMemoryChange(index, event.target.value)
                      }
                      placeholder={"0".repeat(wordWidth)}
                      inputMode="numeric"
                      maxLength={wordWidth}
                      className="font-mono text-xs"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
