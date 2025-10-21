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
  highlightedRegisters?: RegisterKey[];
}

export function CPU({ registers, setRegisters, className, currentOpcode, highlightedRegisters = [] }: CPUProps) {
  const { t } = useTranslation();
  const registerEntries = useMemo(
    () =>
      REGISTER_CONFIG.map(({ key, label, bits }) => ({
        key,
        label,
        value: registers[key],
        bits,
        isHighlighted: highlightedRegisters.includes(key),
      })),
    [registers, highlightedRegisters],
  );

  const handleRegisterChange = (key: RegisterKey, value: string) => {
    const limit = REGISTER_BITS[key];
    const sanitized = value.replace(/[^01]/g, "").slice(0, limit);
    setRegisters((prev) => ({ ...prev, [key]: sanitized }));
  };

  // ALU is active when AC or MQ is highlighted during a math operation
  // This means the computation is happening and the result is being stored
  const isMathOperation = currentOpcode && ['110', '000', '010', '011'].includes(currentOpcode);
  const isALUActive = !!isMathOperation && (highlightedRegisters.includes('AC') || highlightedRegisters.includes('MQ'));
  
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold uppercase tracking-[0.3em] text-slate-200">
          CPU
        </CardTitle>
        <CardDescription className="text-xs">
          {t("cpu.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid gap-3 sm:grid-cols-2">
                  {registerEntries.map(({ key, label, value, bits, isHighlighted }) => (
                    <Record
                      key={key}
                      label={label}
                      bits={bits}
                      value={value}
                      onChange={(next) => handleRegisterChange(key, next)}
                      isHighlighted={isHighlighted}
                    />
                  ))}
                  <ALU isActive={isALUActive} />
                </div>
              </CardContent>
            </Card>
  )
}