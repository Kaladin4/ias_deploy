import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Record } from "./record/record";
import { ALU } from "./alu/alu";

export type RegisterKey = "PC" | "MAR" | "MBR" | "IR" | "AC" | "MQ";

const ADDRESS_WIDTH = 10;
const OPCODE_WIDTH = 3;
const WORD_WIDTH = OPCODE_WIDTH + ADDRESS_WIDTH;

const REGISTER_CONFIG: { key: RegisterKey; label: string; bits: number }[] = [
  { key: "PC", label: "PC", bits: ADDRESS_WIDTH },
  { key: "MAR", label: "MAR", bits: ADDRESS_WIDTH },
  { key: "MBR", label: "MBR", bits: WORD_WIDTH },
  { key: "IR", label: "IR", bits: OPCODE_WIDTH },
  { key: "AC", label: "AC", bits: WORD_WIDTH },
  { key: "MQ", label: "MQ", bits: WORD_WIDTH },
];

const REGISTER_BITS: Record<RegisterKey, number> = REGISTER_CONFIG.reduce(
  (acc, { key, bits }) => {
    acc[key] = bits;
    return acc;
  },
  {} as Record<RegisterKey, number>,
);

const INITIAL_REGISTERS: Record<RegisterKey, string> = REGISTER_CONFIG.reduce(
  (acc, { key }) => {
    acc[key] = "";
    return acc;
  },
  {} as Record<RegisterKey, string>,
);

export { INITIAL_REGISTERS, REGISTER_CONFIG, ADDRESS_WIDTH, OPCODE_WIDTH, WORD_WIDTH };

interface CPUProps {
  registers: Record<RegisterKey, string>;
  setRegisters: React.Dispatch<React.SetStateAction<Record<RegisterKey, string>>>;
  className?: string;
  currentOpcode?: string;
}

export function CPU({ registers, setRegisters, className, currentOpcode }: CPUProps) {
  const { t } = useTranslation();
  const registerEntries = useMemo(
    () =>
      REGISTER_CONFIG.map(({ key, label, bits }) => ({
        key,
        label,
        value: registers[key],
        bits,
      })),
    [registers],
  );

  const handleRegisterChange = (key: RegisterKey, value: string) => {
    const limit = REGISTER_BITS[key];
    const sanitized = value.replace(/[^01]/g, "").slice(0, limit);
    setRegisters((prev) => ({ ...prev, [key]: sanitized }));
  };

  // Math opcodes: ADD (110), SUB (000), MUL (010), DIV (011)
  const isMathOperation = currentOpcode && ['110', '000', '010', '011'].includes(currentOpcode);
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-[0.4em] text-slate-200">
          CPU
        </CardTitle>
        <CardDescription>
          {t("cpu.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {registerEntries.map(({ key, label, value, bits }) => (
                    <Record
                      key={key}
                      label={label}
                      bits={bits}
                      value={value}
                      onChange={(next) => handleRegisterChange(key, next)}
                    />
                  ))}
                  <ALU isActive={!!isMathOperation} />
                </div>
              </CardContent>
            </Card>
  )
}