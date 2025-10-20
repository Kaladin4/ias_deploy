import { cn } from "@/lib/utils"
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

type MemoryProps = {
  memory: string[]
  wordWidth: number
  onMemoryChange: (index: number, value: string) => void
  className?: string
}

export function Memory({ memory, wordWidth, onMemoryChange, className }: MemoryProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Memory</CardTitle>
        <CardDescription>
          1000-word main memory. Enter instructions or data as {wordWidth}-bit
          binary words.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[480px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Address</TableHead>
                <TableHead>Contents ({wordWidth} bits)</TableHead>
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
