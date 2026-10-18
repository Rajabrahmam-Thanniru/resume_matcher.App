import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Check, FlaskConical, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ErrorAlert } from "@/components/feedback/error-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"

const schema = z.object({ resumeText: z.string().trim().min(30, "Enter at least 30 characters"), jobDescription: z.string().trim().min(30, "Enter at least 30 characters") })
type Values = z.infer<typeof schema>

export function LegacyMatchPage() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { resumeText: "", jobDescription: "" } })
  const match = useMutation({ mutationFn: (values: Values) => api.match(values.resumeText, values.jobDescription) })
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16"><p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.16em] text-amber-700"><FlaskConical className="size-4" />Legacy tool</p><h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Quick text comparison</h1><p className="mt-4 max-w-2xl text-stone-600">Paste plain text for a lightweight required-skill comparison. For preferred skills, evidence, tailoring, and PDF export, use PDF analysis.</p>
    <form className="mt-9" onSubmit={form.handleSubmit((values) => match.mutate(values))} noValidate>{match.error && <div className="mb-6"><ErrorAlert message={match.error instanceof ApiError ? match.error.message : "Comparison failed."} /></div>}<div className="grid gap-5 lg:grid-cols-2">{(["resumeText", "jobDescription"] as const).map((name) => <Card key={name}><CardHeader><h2 className="font-display text-2xl text-ink">{name === "resumeText" ? "Resume text" : "Job description"}</h2></CardHeader><CardContent><Textarea rows={14} {...form.register(name)} aria-invalid={!!form.formState.errors[name]} />{form.formState.errors[name] && <p className="mt-2 text-sm text-red-700">{form.formState.errors[name]?.message}</p>}</CardContent></Card>)}</div><div className="mt-5 flex justify-end"><Button size="lg" disabled={match.isPending}>{match.isPending ? "Comparing…" : "Compare text"}</Button></div></form>
    {match.data && <section className="mt-10 border-t border-stone-200 pt-9"><h2 className="font-display text-3xl text-ink">Comparison results</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Card><CardHeader><h3 className="flex items-center gap-2 font-semibold"><Check className="size-5 text-emerald-700" />Skills mentioned</h3></CardHeader><CardContent className="flex flex-wrap gap-2">{match.data.mention_skills.length ? match.data.mention_skills.map((skill) => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900">{skill}</span>) : <p className="text-sm text-stone-500">No matched skills returned.</p>}</CardContent></Card><Card><CardHeader><h3 className="flex items-center gap-2 font-semibold"><X className="size-5 text-red-700" />Skills not mentioned</h3></CardHeader><CardContent className="flex flex-wrap gap-2">{match.data.non_mention_skills.length ? match.data.non_mention_skills.map((skill) => <span key={skill} className="rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-900">{skill}</span>) : <p className="text-sm text-stone-500">No missing skills returned.</p>}</CardContent></Card></div><pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-5 font-sans text-sm leading-6 text-stone-700">{match.data.report}</pre></section>}
  </div>
}
