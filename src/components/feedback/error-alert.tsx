import { AlertTriangle } from "lucide-react"

export function ErrorAlert({ title = "Something went wrong", message }: { title?: string; message: string }) {
  return <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-950"><AlertTriangle className="mt-0.5 size-5 shrink-0" /><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-red-800">{message}</p></div></div>
}
