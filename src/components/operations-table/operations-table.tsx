import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const OPERATIONS = [
    {
      opcode: "001",
      mnemonic: "LOAD",
      description: "Load variants",
    },
    {
      opcode: "010",
      mnemonic: "MUL",
      description: "AC,MQ ← AC × Mem(X)",
    },
    {
      opcode: "011",
      mnemonic: "DIV",
      description: "AC ← AC ÷ Mem(X); MQ ← AC % Mem(X)",
    },
    {
      opcode: "100",
      mnemonic: "LDMQ",
      description: "MQ ← Mem(X)",
    },
    {
      opcode: "110",
      mnemonic: "ADD",
      description: "AC ← AC + Mem(X)",
    },
    {
      opcode: "111",
      mnemonic: "ST",
      description: "Mem(X) ← AC",
    },
    {
      opcode: "000",
      mnemonic: "SUB",
      description: "AC ← AC - Mem(X)",
    },
  ]

interface OperationsTableProps {
  className?: string
}

export function OperationsTable({ className }: OperationsTableProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold uppercase tracking-[0.35em] text-slate-200">
          ISA Ops
        </CardTitle>
        <CardDescription>
          Minimal IAS instruction set available in this simulator.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Opcode</TableHead>
                <TableHead>Mnemonic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OPERATIONS.map((operation) => (
                <TableRow key={operation.opcode}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {operation.opcode}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help text-sm font-medium text-slate-200">
                          {operation.mnemonic}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">{operation.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
