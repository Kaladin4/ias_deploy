import { Label } from "@/components/ui/label"
import type { BusActivity } from "@/lib/bus-activity"
import { cn } from "@/lib/utils"

type BusColor = "blue" | "green" | "amber"

const BUS_STYLES: Record<BusColor, {
  wireActive: string
  wireInactive: string
  glowOverlay: string
  particle: string
  connectorActive: string
  labelActive: string
}> = {
  blue: {
    wireActive:
      "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.45)]",
    wireInactive: "bg-slate-800/60",
    glowOverlay: "bg-blue-400 animate-pulse",
    particle: "bg-blue-300",
    connectorActive: "bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.65)]",
    labelActive:
      "border-blue-500/60 text-blue-200 shadow-[0_0_12px_rgba(59,130,24 6,0.35)]",
  },
  green: {
    wireActive:
      "bg-gradient-to-r from-green-500 via-green-400 to-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)]",
    wireInactive: "bg-slate-800/60",
    glowOverlay: "bg-green-400 animate-pulse",
    particle: "bg-green-300",
    connectorActive: "bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.65)]",
    labelActive:
      "border-green-500/60 text-green-200 shadow-[0_0_12px_rgba(34,197,94,0.35)]",
  },
  amber: {
    wireActive:
      "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.45)]",
    wireInactive: "bg-slate-800/60",
    glowOverlay: "bg-amber-400 animate-pulse",
    particle: "bg-amber-300",
    connectorActive: "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.65)]",
    labelActive:
      "border-amber-500/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.35)]",
  },
}

interface WireArchitectureProps {
  activity: BusActivity
}

export function WireArchitecture({ activity }: WireArchitectureProps) {
  return (
    <div className="pointer-events-none grid h-full min-h-[600px] grid-cols-12 grid-rows-[repeat(6,minmax(0,1fr))]">
      <BusRow
        label="Address Bus"
        color="blue"
        active={activity.addressBus}
        animationClass="animate-flow-right"
        rowClass="row-start-2"
      />
      <BusRow
        label="Data Bus"
        color="green"
        active={activity.dataBus}
        animationClass="animate-flow-left"
        rowClass="row-start-4"
      />
      <BusRow
        label="Control Bus"
        color="amber"
        active={activity.controlBus}
        animationClass="animate-flow-both"
        rowClass="row-start-6"
      />
    </div>
  )
}

interface BusRowProps {
  label: string
  color: BusColor
  active: boolean
  animationClass: string
  rowClass: string
}

function BusRow({ label, color, active, animationClass, rowClass }: BusRowProps) {
  const styles = BUS_STYLES[color]

  return (
    <div
      className={cn(
        "relative col-span-12 grid grid-cols-12 items-center",
        rowClass,
      )}
    >
      <Label
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -translate-y-full rounded border bg-slate-900/80 px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.4em] transition-all duration-300",
          active ? styles.labelActive : "border-slate-700/60 text-slate-400",
        )}
      >
        {label}
      </Label>

      <div className="col-start-2 col-end-3 flex justify-center">
        <span
          className={cn(
            "h-3 w-3 rounded-full transition-all duration-300",
            active ? styles.connectorActive : "bg-slate-600",
          )}
        />
      </div>

      <div className="col-start-3 col-end-11 relative h-1">
        <span
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            active ? styles.wireActive : styles.wireInactive,
          )}
        />
        {active && (
          <>
            <span
              className={cn(
                "absolute inset-0 rounded-full opacity-60",
                styles.glowOverlay,
              )}
            />
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full opacity-80",
                styles.particle,
                animationClass,
              )}
            />
          </>
        )}
      </div>

      <div className="col-start-11 col-end-12 flex justify-center">
        <span
          className={cn(
            "h-3 w-3 rounded-full transition-all duration-300",
            active ? styles.connectorActive : "bg-slate-600",
          )}
        />
      </div>
    </div>
  )
}

