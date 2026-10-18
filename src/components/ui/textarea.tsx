import type { TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full resize-y rounded-xl border border-stone-300 bg-white/80 px-4 py-3 text-sm leading-6 text-ink shadow-sm outline-none placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20", className)} {...props} />
}
