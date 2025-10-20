import { cn } from "@/lib/utils"

export type BusActivity = {
  dataBus: boolean
  addressBus: boolean
  controlBus: boolean
}

interface BusLegendProps {
  activity: BusActivity
  phase: "fetch" | "decode" | "execute" | "idle" | "halted"
}

export function BusLegend({ activity, phase }: BusLegendProps) {
  return (
    <div className="hidden xl:flex items-center gap-6 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg">
      {/* Address Bus */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-1 rounded-full transition-all duration-300",
          activity.addressBus 
            ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
            : "bg-slate-700/50"
        )} />
        <span className={cn(
          "text-xs font-mono uppercase tracking-wider transition-colors duration-300",
          activity.addressBus ? "text-blue-400" : "text-slate-500"
        )}>
          Address
        </span>
      </div>

      {/* Data Bus */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-1 rounded-full transition-all duration-300",
          activity.dataBus 
            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
            : "bg-slate-700/50"
        )} />
        <span className={cn(
          "text-xs font-mono uppercase tracking-wider transition-colors duration-300",
          activity.dataBus ? "text-green-400" : "text-slate-500"
        )}>
          Data
        </span>
      </div>

      {/* Control Bus */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-1 rounded-full transition-all duration-300",
          activity.controlBus 
            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
            : "bg-slate-700/50"
        )} />
        <span className={cn(
          "text-xs font-mono uppercase tracking-wider transition-colors duration-300",
          activity.controlBus ? "text-amber-400" : "text-slate-500"
        )}>
          Control
        </span>
      </div>

      {/* Phase indicator */}
      <div className="ml-auto flex items-center gap-2 pl-6 border-l border-slate-700">
        <span className="text-xs text-slate-500">Phase:</span>
        <span className={cn(
          "text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded",
          phase === "fetch" && "bg-blue-500/20 text-blue-400",
          phase === "decode" && "bg-purple-500/20 text-purple-400",
          phase === "execute" && "bg-green-500/20 text-green-400",
          phase === "idle" && "bg-slate-700/50 text-slate-400",
          phase === "halted" && "bg-red-500/20 text-red-400"
        )}>
          {phase}
        </span>
      </div>
    </div>
  )
}
