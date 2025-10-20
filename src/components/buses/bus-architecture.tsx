import { cn } from "@/lib/utils"

export type BusActivity = {
  dataBus: boolean
  addressBus: boolean
  controlBus: boolean
}

interface BusArchitectureProps {
  activity: BusActivity
}

// Anchor points aligned with grid layout (1fr left, 1.8fr right)
const CPU_ANCHOR = 28  // Right edge of CPU column
const MEMORY_ANCHOR = 68  // Left edge of Memory column

const BUS_LEVELS = {
  address: 20,
  data: 50,
  control: 80,
} as const

const CONTROL_BRANCHES = [15, 28, 41, 54, 67, 80]

export function BusArchitecture({ activity }: BusArchitectureProps) {
  return (
    <div className="relative w-full h-full pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Address bus wire */}
        <path
          d={`M${CPU_ANCHOR} ${BUS_LEVELS.address} C ${CPU_ANCHOR + 8} ${BUS_LEVELS.address} ${MEMORY_ANCHOR - 8} ${BUS_LEVELS.address} ${MEMORY_ANCHOR} ${BUS_LEVELS.address}`}
          className={cn(
            "fill-none transition-all duration-300",
            activity.addressBus ? "stroke-blue-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.6}
          strokeLinecap="round"
          filter={activity.addressBus ? "url(#glow-blue)" : undefined}
        />

        {/* Address bus connectors - extend to component edges */}
        <line
          x1={CPU_ANCHOR}
          y1={BUS_LEVELS.address}
          x2={CPU_ANCHOR - 2}
          y2={BUS_LEVELS.address - 4}
          className={cn(
            "transition-all duration-300",
            activity.addressBus ? "stroke-blue-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.2}
        />
        <line
          x1={MEMORY_ANCHOR}
          y1={BUS_LEVELS.address}
          x2={MEMORY_ANCHOR + 2}
          y2={BUS_LEVELS.address - 4}
          className={cn(
            "transition-all duration-300",
            activity.addressBus ? "stroke-blue-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.2}
        />

        {/* Data bus wire */}
        <path
          d={`M${CPU_ANCHOR} ${BUS_LEVELS.data} C ${CPU_ANCHOR + 10} ${BUS_LEVELS.data} ${MEMORY_ANCHOR - 10} ${BUS_LEVELS.data} ${MEMORY_ANCHOR} ${BUS_LEVELS.data}`}
          className={cn(
            "fill-none transition-all duration-300",
            activity.dataBus ? "stroke-green-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.6}
          strokeLinecap="round"
          filter={activity.dataBus ? "url(#glow-green)" : undefined}
        />

        {/* Data bus connectors */}
        <line
          x1={CPU_ANCHOR}
          y1={BUS_LEVELS.data}
          x2={CPU_ANCHOR - 2}
          y2={BUS_LEVELS.data}
          className={cn(
            "transition-all duration-300",
            activity.dataBus ? "stroke-green-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.2}
        />
        <line
          x1={MEMORY_ANCHOR}
          y1={BUS_LEVELS.data}
          x2={MEMORY_ANCHOR + 2}
          y2={BUS_LEVELS.data}
          className={cn(
            "transition-all duration-300",
            activity.dataBus ? "stroke-green-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.2}
        />

        {/* Control bus wire */}
        <path
          d={`M${CPU_ANCHOR} ${BUS_LEVELS.control} C ${CPU_ANCHOR + 12} ${BUS_LEVELS.control} ${MEMORY_ANCHOR - 12} ${BUS_LEVELS.control} ${MEMORY_ANCHOR} ${BUS_LEVELS.control}`}
          className={cn(
            "fill-none transition-all duration-300",
            activity.controlBus ? "stroke-amber-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.6}
          strokeLinecap="round"
          filter={activity.controlBus ? "url(#glow-amber)" : undefined}
        />

        {/* Control bus fan-out to registers */}
        {CONTROL_BRANCHES.map((branch, index) => (
          <g key={branch}>
            <polyline
              points={`${CPU_ANCHOR} ${BUS_LEVELS.control} ${CPU_ANCHOR - 3} ${branch} ${CPU_ANCHOR - 7} ${branch}`}
              className={cn(
                "fill-none transition-all duration-300",
                activity.controlBus ? "stroke-amber-500" : "stroke-slate-700/35"
              )}
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={activity.controlBus ? "url(#glow-amber)" : undefined}
            />
            <circle
              cx={CPU_ANCHOR - 7}
              cy={branch}
              r={0.9}
              className={cn(
                activity.controlBus ? "fill-amber-400" : "fill-slate-600"
              )}
            />
            {activity.controlBus && (
              <circle
                cx={CPU_ANCHOR - 5.5}
                cy={branch}
                r={1.2}
                className="fill-amber-400/30"
              >
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur={`${1.4 + index * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}

        {/* Memory side control connector */}
        <line
          x1={MEMORY_ANCHOR}
          y1={BUS_LEVELS.control}
          x2={MEMORY_ANCHOR + 2}
          y2={BUS_LEVELS.control + 4}
          className={cn(
            "transition-all duration-300",
            activity.controlBus ? "stroke-amber-500" : "stroke-slate-700/40"
          )}
          strokeWidth={1.2}
        />

        {/* Connection nodes */}
        <circle
          cx={CPU_ANCHOR}
          cy={BUS_LEVELS.address}
          r={1.6}
          className={cn(
            activity.addressBus ? "fill-blue-400" : "fill-slate-600"
          )}
        />
        <circle
          cx={CPU_ANCHOR}
          cy={BUS_LEVELS.data}
          r={1.6}
          className={cn(
            activity.dataBus ? "fill-green-400" : "fill-slate-600"
          )}
        />
        <circle
          cx={CPU_ANCHOR}
          cy={BUS_LEVELS.control}
          r={1.6}
          className={cn(
            activity.controlBus ? "fill-amber-400" : "fill-slate-600"
          )}
        />

        <circle
          cx={MEMORY_ANCHOR}
          cy={BUS_LEVELS.address}
          r={1.6}
          className={cn(
            activity.addressBus ? "fill-blue-400" : "fill-slate-600"
          )}
        />
        <circle
          cx={MEMORY_ANCHOR}
          cy={BUS_LEVELS.data}
          r={1.6}
          className={cn(
            activity.dataBus ? "fill-green-400" : "fill-slate-600"
          )}
        />
        <circle
          cx={MEMORY_ANCHOR}
          cy={BUS_LEVELS.control}
          r={1.6}
          className={cn(
            activity.controlBus ? "fill-amber-400" : "fill-slate-600"
          )}
        />

        {/* Animated flow indicators */}
        {activity.addressBus && (
          <circle cx={CPU_ANCHOR} cy={BUS_LEVELS.address} r={1.4} className="fill-blue-300 opacity-80">
            <animate attributeName="cx" from={CPU_ANCHOR} to={MEMORY_ANCHOR} dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
        )}
        {activity.dataBus && (
          <circle cx={MEMORY_ANCHOR} cy={BUS_LEVELS.data} r={1.4} className="fill-green-300 opacity-80">
            <animate attributeName="cx" from={MEMORY_ANCHOR} to={CPU_ANCHOR} dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
        {activity.controlBus && (
          <circle cx={CPU_ANCHOR} cy={BUS_LEVELS.control} r={1.4} className="fill-amber-300 opacity-80">
            <animate attributeName="cx" values={`${CPU_ANCHOR};${MEMORY_ANCHOR};${CPU_ANCHOR}`} dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Labels */}
        <text
          x={CPU_ANCHOR + 2}
          y={BUS_LEVELS.address - 4}
          className={cn(
            "text-[8px] font-mono uppercase tracking-[0.3em]",
            activity.addressBus ? "fill-blue-400" : "fill-slate-600"
          )}
        >
          Addr Bus
        </text>
        <text
          x={CPU_ANCHOR + 2}
          y={BUS_LEVELS.data - 4}
          className={cn(
            "text-[8px] font-mono uppercase tracking-[0.3em]",
            activity.dataBus ? "fill-green-400" : "fill-slate-600"
          )}
        >
          Data Bus
        </text>
        <text
          x={CPU_ANCHOR + 2}
          y={BUS_LEVELS.control - 4}
          className={cn(
            "text-[8px] font-mono uppercase tracking-[0.3em]",
            activity.controlBus ? "fill-amber-400" : "fill-slate-600"
          )}
        >
          Control Bus
        </text>
      </svg>
    </div>
  )
}
