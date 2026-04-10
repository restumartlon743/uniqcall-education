import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary",
        secondary: "border-transparent bg-secondary/20 text-secondary",
        destructive: "border-transparent bg-destructive/20 text-destructive",
        outline: "text-foreground border-white/20",
        // Archetype cluster variants
        logical: "border-purple-500/30 bg-purple-500/15 text-purple-300",
        creative: "border-pink-500/30 bg-pink-500/15 text-pink-300",
        social: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
        // Per-archetype colors
        thinker: "border-violet-500/30 bg-violet-500/15 text-violet-300",
        engineer: "border-cyan-500/30 bg-cyan-500/15 text-cyan-300",
        guardian: "border-blue-500/30 bg-blue-500/15 text-blue-300",
        strategist: "border-indigo-500/30 bg-indigo-500/15 text-indigo-300",
        creator: "border-pink-500/30 bg-pink-500/15 text-pink-300",
        shaper: "border-orange-500/30 bg-orange-500/15 text-orange-300",
        storyteller: "border-amber-500/30 bg-amber-500/15 text-amber-300",
        performer: "border-rose-500/30 bg-rose-500/15 text-rose-300",
        healer: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
        diplomat: "border-teal-500/30 bg-teal-500/15 text-teal-300",
        explorer: "border-lime-500/30 bg-lime-500/15 text-lime-300",
        mentor: "border-sky-500/30 bg-sky-500/15 text-sky-300",
        visionary: "border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-300",
        // VARK variants
        vark: "border-white/20 bg-white/10 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
export type { BadgeVariant }
