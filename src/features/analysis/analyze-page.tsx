import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Clock3, FileSearch, ShieldCheck, Sparkles } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import * as Switch from "@radix-ui/react-switch"
import { z } from "zod"
import { ErrorAlert } from "@/components/feedback/error-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useEnterAnimation } from "@/hooks/use-enter-animation"
import { api, ApiError } from "@/lib/api"
import { AnalysisResults } from "./analysis-results"
import { PdfDropzone } from "./pdf-dropzone"

const MAX_SIZE = 10 * 1024 * 1024
const schema = z.object({ resume: z.instanceof(File, { message: "Choose a PDF resume" }).refine((file) => file.name.toLowerCase().endsWith(".pdf"), "Only PDF files are supported").refine((file) => file.size <= MAX_SIZE, "PDF must be 10 MB or smaller"), jobDescription: z.string().trim().min(30, "Paste a fuller job description (at least 30 characters)"), tailor: z.boolean() })
type AnalysisValues = z.infer<typeof schema>

export function AnalyzePage() {
  const root = useEnterAnimation()
  const form = useForm<AnalysisValues>({ resolver: zodResolver(schema), defaultValues: { jobDescription: "", tailor: true } })
  const analysis = useMutation({ mutationFn: api.analyze })
  if (analysis.data) return <AnalysisResults result={analysis.data} onReset={() => { analysis.reset(); form.reset({ jobDescription: "", tailor: true }) }} />
  return <div ref={root} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
    <div className="max-w-3xl"><p data-enter className="text-sm font-semibold uppercase tracking-[.16em] text-teal-700">Resume analysis</p><h1 data-enter className="mt-3 font-display text-4xl leading-tight text-ink sm:text-6xl">Turn a job description into a focused application.</h1><p data-enter className="mt-5 text-lg leading-8 text-stone-600">Upload your resume, add the role, and see the evidence already working in your favor—without made-up experience.</p></div>
    <div data-enter className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-600"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-teal-700" />Evidence-checked</span><span className="flex items-center gap-2"><FileSearch className="size-4 text-teal-700" />Required vs preferred</span><span className="flex items-center gap-2"><Sparkles className="size-4 text-teal-700" />Optional tailoring</span></div>
    <form data-enter className="mt-10" onSubmit={form.handleSubmit((values) => analysis.mutate(values))} noValidate>
      {analysis.error && <div className="mb-6"><ErrorAlert title={analysis.error instanceof ApiError && analysis.error.status === 504 ? "Analysis timed out" : "Analysis failed"} message={analysis.error instanceof ApiError ? analysis.error.message : "The service could not analyze this resume."} /></div>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardContent className="pt-6"><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-stone-500">Step 1</p><h2 className="mt-1 font-display text-2xl text-ink">Add your resume</h2></div><Controller control={form.control} name="resume" render={({ field, fieldState }) => <PdfDropzone file={field.value} onChange={field.onChange} error={fieldState.error?.message} />} /></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-stone-500">Step 2</p><h2 className="mt-1 font-display text-2xl text-ink">Paste the job description</h2></div><Textarea rows={11} placeholder="Paste the full role description, including required and preferred skills…" aria-invalid={!!form.formState.errors.jobDescription} {...form.register("jobDescription")} />{form.formState.errors.jobDescription && <p className="mt-2 text-sm text-red-700">{form.formState.errors.jobDescription.message}</p>}</CardContent></Card>
      </div>
      <Card className="mt-6"><CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><Controller control={form.control} name="tailor" render={({ field }) => <Switch.Root checked={field.value} onCheckedChange={field.onChange} className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-stone-300 outline-none transition-colors data-[state=checked]:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"><Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[1.35rem]" /></Switch.Root>} /><div><p className="font-semibold text-ink">Create a tailored version</p><p className="mt-1 text-sm leading-6 text-stone-500">Rewrites emphasis and wording using only facts already in your resume. Turn off for faster analysis.</p></div></div><Button size="lg" type="submit" disabled={analysis.isPending} className="shrink-0">{analysis.isPending ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Analyzing…</> : <><FileSearch className="size-5" />Analyze resume</>}</Button></CardContent></Card>
      {analysis.isPending && <div aria-live="polite" className="mt-5 flex items-center justify-center gap-2 text-sm text-stone-600"><Clock3 className="size-4" />Extracting evidence and requirements. This can take several minutes.</div>}
    </form>
  </div>
}
