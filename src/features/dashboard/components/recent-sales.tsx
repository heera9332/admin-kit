import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  const sales = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
      fallback: "OM",
      avatar: "/avatars/01.png",
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "+$39.00",
      fallback: "JL",
      avatar: "/avatars/02.png",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$299.00",
      fallback: "IN",
      avatar: "/avatars/03.png",
    },
    {
      name: "William Kim",
      email: "will@email.com",
      amount: "+$99.00",
      fallback: "WK",
      avatar: "/avatars/04.png",
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "+$39.00",
      fallback: "SD",
      avatar: "/avatars/05.png",
    },
  ]

  return (
    <div className="space-y-6">
      {sales.map((sale) => (
        <div key={sale.email} className="flex items-center gap-4">
          <Avatar className="size-9">
            <AvatarImage src={sale.avatar} alt={sale.name} />
            <AvatarFallback>{sale.fallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-wrap items-center justify-between min-w-0">
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">{sale.name}</p>
              <p className="text-xs text-muted-foreground truncate">{sale.email}</p>
            </div>
            <div className="font-semibold text-sm font-mono">{sale.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
