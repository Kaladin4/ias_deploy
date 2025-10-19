import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type BusActivity = {
  dataBus: boolean
  addressBus: boolean
  controlBus: boolean
}

interface BusesProps {
  activity: BusActivity
  phase: "fetch" | "decode" | "execute" | "idle" | "halted"
}

export function Buses({ activity, phase }: BusesProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-[0.4em] text-slate-200">
          System Buses
        </CardTitle>
        <CardDescription>
          Visual representation of active data transfer pathways
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Bus */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Address Bus</span>
            <span className={cn(
              "text-xs font-mono px-2 py-0.5 rounded",
              activity.addressBus 
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" 
                : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
            )}>
              {activity.addressBus ? "ACTIVE" : "IDLE"}
            </span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden bg-slate-900 border border-slate-800">
            <div 
              className={cn(
                "absolute inset-0 transition-all duration-300",
                activity.addressBus 
                  ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-pulse" 
                  : "bg-slate-800"
              )}
            />
            {activity.addressBus && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Carries memory addresses (10 bits)
          </p>
        </div>

        {/* Data Bus */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Data Bus</span>
            <span className={cn(
              "text-xs font-mono px-2 py-0.5 rounded",
              activity.dataBus 
                ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
            )}>
              {activity.dataBus ? "ACTIVE" : "IDLE"}
            </span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden bg-slate-900 border border-slate-800">
            <div 
              className={cn(
                "absolute inset-0 transition-all duration-300",
                activity.dataBus 
                  ? "bg-gradient-to-r from-green-500 via-green-400 to-green-500 animate-pulse" 
                  : "bg-slate-800"
              )}
            />
            {activity.dataBus && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Transfers data and instructions (13 bits)
          </p>
        </div>

        {/* Control Bus */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Control Bus</span>
            <span className={cn(
              "text-xs font-mono px-2 py-0.5 rounded",
              activity.controlBus 
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
            )}>
              {activity.controlBus ? "ACTIVE" : "IDLE"}
            </span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden bg-slate-900 border border-slate-800">
            <div 
              className={cn(
                "absolute inset-0 transition-all duration-300",
                activity.controlBus 
                  ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 animate-pulse" 
                  : "bg-slate-800"
              )}
            />
            {activity.controlBus && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Signals for read/write operations
          </p>
        </div>

        {/* Current Phase Indicator */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current Phase:</span>
            <span className={cn(
              "font-mono font-semibold uppercase px-2 py-1 rounded",
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
      </CardContent>
    </Card>
  )
}
