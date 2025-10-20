import { cn } from "@/lib/utils"

export type WireSegment = {
  type: "horizontal" | "vertical" | "corner"
  startCol?: number
  endCol?: number
  startRow?: number
  endRow?: number
  col?: number
  row?: number
}

interface WireProps {
  segments: WireSegment[]
  active: boolean
  color: "blue" | "green" | "amber"
  label?: string
}

const colorClasses = {
  blue: {
    active: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]",
    inactive: "bg-slate-700/40",
    glow: "shadow-blue-500/50",
  },
  green: {
    active: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    inactive: "bg-slate-700/40",
    glow: "shadow-green-500/50",
  },
  amber: {
    active: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    inactive: "bg-slate-700/40",
    glow: "shadow-amber-500/50",
  },
}

export function Wire({ segments, active, color, label }: WireProps) {
  const colors = colorClasses[color]
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {segments.map((segment, index) => {
        if (segment.type === "horizontal") {
          return (
            <div
              key={index}
              className={cn(
                "absolute h-1 transition-all duration-300",
                active ? colors.active : colors.inactive
              )}
              style={{
                left: `${segment.startCol}%`,
                width: `${(segment.endCol || 0) - (segment.startCol || 0)}%`,
                top: `${segment.row}%`,
              }}
            >
              {active && (
                <div className="absolute inset-0 animate-pulse opacity-60" />
              )}
            </div>
          )
        }
        
        if (segment.type === "vertical") {
          return (
            <div
              key={index}
              className={cn(
                "absolute w-1 transition-all duration-300",
                active ? colors.active : colors.inactive
              )}
              style={{
                left: `${segment.col}%`,
                top: `${segment.startRow}%`,
                height: `${(segment.endRow || 0) - (segment.startRow || 0)}%`,
              }}
            >
              {active && (
                <div className="absolute inset-0 animate-pulse opacity-60" />
              )}
            </div>
          )
        }
        
        if (segment.type === "corner") {
          return (
            <div
              key={index}
              className={cn(
                "absolute w-2 h-2 rounded-full transition-all duration-300",
                active ? colors.active : colors.inactive
              )}
              style={{
                left: `calc(${segment.col}% - 4px)`,
                top: `calc(${segment.row}% - 4px)`,
              }}
            />
          )
        }
        
        return null
      })}
      
      {label && (
        <div
          className={cn(
            "absolute text-[10px] font-mono uppercase tracking-wider transition-all duration-300",
            active ? `text-${color}-400` : "text-slate-600"
          )}
          style={{
            left: `${segments[0]?.startCol || segments[0]?.col || 0}%`,
            top: `calc(${segments[0]?.row || segments[0]?.startRow || 0}% - 16px)`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
