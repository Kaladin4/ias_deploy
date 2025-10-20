import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function TipsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tips</CardTitle>
        <CardDescription>
          Helpful notes for configuring memory, interrupts, and logs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Load the sample program to populate memory addresses required for the
          interrupt handler (1001–1003).
        </p>
        <p>
          Triggered interrupts are queued during the fetch phase and processed
          sequentially to preserve program flow.
        </p>
        <p>
          Execution logs persist until you reset the simulation. Use the
          download button in the IAS tab to archive them.
        </p>
      </CardContent>
    </Card>
  )
}
