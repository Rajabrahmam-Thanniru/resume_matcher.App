import { FileText, UploadCloud, X } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PdfDropzone({ file, onChange, error }: { file?: File; onChange: (file?: File) => void; error?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const accept = (files: FileList | null) => { if (files?.[0]) onChange(files[0]) }
  return <div>
    <div
      className={cn("relative grid min-h-52 place-items-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors", dragging ? "border-teal-600 bg-teal-50" : error ? "border-red-300 bg-red-50/50" : "border-stone-300 bg-stone-50/70 hover:border-teal-500")}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); accept(event.dataTransfer.files) }}
    >
      <input ref={input} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => accept(event.target.files)} aria-describedby="pdf-help pdf-error" />
      {file ? <div className="w-full"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-teal-100 text-teal-800"><FileText className="size-6" /></span><p className="mt-4 break-all font-semibold text-ink">{file.name}</p><p className="mt-1 text-sm text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p><div className="mt-4 flex justify-center gap-2"><Button type="button" size="sm" variant="outline" onClick={() => input.current?.click()}>Replace</Button><Button type="button" size="sm" variant="ghost" onClick={() => onChange()}><X className="size-4" />Remove</Button></div></div> : <button type="button" className="group w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-teal-600" onClick={() => input.current?.click()}><UploadCloud className="mx-auto size-9 text-teal-700 transition-transform group-hover:-translate-y-1" /><p className="mt-4 font-semibold text-ink">Drop your resume PDF here</p><p className="mt-2 text-sm text-stone-500">or choose a file · up to 10 MB</p></button>}
    </div>
    <p id="pdf-help" className="mt-2 text-xs leading-5 text-stone-500">Use a text-based PDF. Scanned documents require OCR before upload.</p>{error && <p id="pdf-error" className="mt-1 text-sm text-red-700">{error}</p>}
  </div>
}
