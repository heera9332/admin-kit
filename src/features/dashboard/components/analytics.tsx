"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const analyticsData = [
  { time: "00:00", visitors: 120, sessions: 80 },
  { time: "04:00", visitors: 90, sessions: 60 },
  { time: "08:00", visitors: 320, sessions: 240 },
  { time: "12:00", visitors: 580, sessions: 490 },
  { time: "16:00", visitors: 740, sessions: 610 },
  { time: "20:00", visitors: 490, sessions: 390 },
  { time: "23:59", visitors: 220, sessions: 170 },
]

export function Analytics() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.6%</div>
            <p className="text-xs text-emerald-500 font-medium">-4.2% vs last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-emerald-500 font-medium">+18s vs last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pages / Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.8</div>
            <p className="text-xs text-emerald-500 font-medium">+12% vs last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Goal Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.2%</div>
            <p className="text-xs text-emerald-500 font-medium">+1.8% vs last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Real-Time Visitor Traffic</CardTitle>
          <CardDescription>Live visitors vs concurrent user sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="visitors" stroke="var(--primary)" fillOpacity={1} fill="url(#visitorGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
