"use client"

import * as React from "react"
import { Sparkles, ArrowRight, Search, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ThemePreviewCard() {
  const [sliderValue, setSliderValue] = React.useState<number[]>([65])
  const [switchChecked, setSwitchChecked] = React.useState(true)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <span>Interactive Live Preview</span>
        </h4>
        <span className="text-[11px] text-muted-foreground">
          Adapts in real-time to selected theme and radius
        </span>
      </div>

      <Card className="border border-border/80 bg-card/60 backdrop-blur-xs p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column: Interactive Controls */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Buttons & Radius
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="gap-1.5 text-xs">
                  <span>Primary</span>
                  <ArrowRight className="size-3" />
                </Button>
                <Button variant="secondary" size="sm" className="text-xs">
                  Secondary
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Outline
                </Button>
                <Button variant="destructive" size="sm" className="text-xs">
                  Destructive
                </Button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Badges & Status
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Primary Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Input Field
              </span>
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search project workspace..."
                  className="pl-8 text-xs h-8"
                  defaultValue="Real-time preview"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Mini Dashboard Card */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Component Card & Sliders
              </span>
              <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span className="text-xs font-semibold">Active Pipeline</span>
                  </div>
                  <Tabs defaultValue="overview">
                    <TabsList className="h-6 p-0.5">
                      <TabsTrigger value="overview" className="text-[10px] px-2 h-5">
                        Week
                      </TabsTrigger>
                      <TabsTrigger value="month" className="text-[10px] px-2 h-5">
                        Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Resource Allocation</span>
                    <span className="font-mono font-medium text-foreground">
                      {sliderValue[0]}%
                    </span>
                  </div>
                  <Slider
                    value={sliderValue}
                    onValueChange={(val) => setSliderValue(val as number[])}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">
                    Notifications Enabled
                  </span>
                  <Switch
                    size="sm"
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
