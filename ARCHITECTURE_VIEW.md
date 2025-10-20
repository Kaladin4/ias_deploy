# Bus Architecture Visualization

## Overview

The IAS Computer Simulator now features an **architectural view** that visually connects the CPU and Memory components through the three system buses, mimicking a real computer architecture diagram.

## Visual Design

### Desktop View (XL screens and above)
- **Bus Architecture Overlay**: SVG-based bus lines spanning horizontally between CPU (left) and Memory (right)
- **Bus Legend**: Compact legend bar showing current bus activity and execution phase
- **Animated Data Flow**: Moving dots along active buses showing data transfer direction
- **Minimalistic Style**: Thin lines with subtle glows when active, maintaining clean aesthetics

### Mobile/Tablet View
- Falls back to the original **Buses card component** with detailed descriptions
- Ensures functionality on all screen sizes

## Bus Representation

### Address Bus (Blue - Top Line)
- **Position**: Top horizontal line at 15% height
- **Width**: 10 bits
- **Function**: Carries memory addresses from CPU to Memory
- **Active States**: FETCH, DECODE, EXECUTE phases

### Data Bus (Green - Middle Line)
- **Position**: Middle horizontal line at 50% height
- **Width**: 13 bits (instruction/data)
- **Function**: Bidirectional data transfer between CPU and Memory
- **Active States**: FETCH, EXECUTE phases

### Control Bus (Amber - Bottom Line)
- **Position**: Bottom horizontal line at 85% height
- **Function**: Carries control signals (READ/WRITE)
- **Active States**: FETCH, DECODE, EXECUTE phases

## Visual Effects

### Active State
- **Glow Effect**: SVG filters create soft glow around active bus lines
- **Color Intensity**: Bright colors (blue-500, green-500, amber-500)
- **Animated Dots**: Moving circles travel along the bus showing data flow
- **Shadow**: Subtle shadow effect for depth

### Idle State
- **Muted Color**: Dark gray (slate-700/30)
- **No Animation**: Static lines
- **No Glow**: Minimal visual presence

## Connection Points

### CPU Side (Left)
- Three connection dots where buses connect to CPU registers
- Dots light up with corresponding bus color when active

### Memory Side (Right)
- Three connection dots where buses connect to Memory
- Dots light up with corresponding bus color when active

## Implementation Details

### Components Created
1. **`bus-architecture.tsx`** - Main architectural overlay with SVG bus lines
2. **`bus-legend.tsx`** - Compact legend showing bus status and phase
3. **`buses.tsx`** - Original detailed card view (mobile fallback)

### Positioning
- Uses CSS absolute positioning with calculated offsets
- `left-[calc(33.333%-1rem)]` to `right-[calc(66.666%-1rem)]`
- Height fixed at 400px to span CPU component
- `z-index: 10` to overlay on top of components
- `pointer-events-none` to allow interaction with underlying components

### Responsive Behavior
- **Desktop (xl+)**: Shows architectural overlay + legend
- **Mobile/Tablet**: Shows traditional Buses card component
- Uses Tailwind's `xl:` breakpoint for switching

## Technical Features

### SVG Filters
- Custom glow filters for each bus color
- `feGaussianBlur` with `feMerge` for smooth glow effect

### Animations
- **SVG `<animate>`**: Native SVG animation for moving dots
- **CSS Transitions**: Smooth color and opacity changes
- **Duration**: 2-second cycles for data flow animation

### Accessibility
- Labels for each bus (ADDR, DATA, CTRL)
- Color-coded with sufficient contrast
- Maintains functionality when animations are disabled

## Future Enhancements

Possible improvements:
- Show actual data values on the buses
- Directional arrows indicating read vs write
- Individual register connections for control bus
- Zoom/pan functionality for detailed view
- Interactive tooltips on bus lines
- Timing diagrams showing bus activity over multiple cycles
