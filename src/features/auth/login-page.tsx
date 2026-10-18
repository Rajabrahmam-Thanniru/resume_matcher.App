import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight, FileCheck2, LockKeyhole, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorAlert } from "@/components/feedback/error-alert"
import { api, ApiError } from "@/lib/api"
import { queryClient } from "@/lib/query-client"
import { useEnterAnimation } from "@/hooks/use-enter-animation"

const schema = z.object({ username: z.string().trim().min(1, "Enter your username"), password: z.string().min(1, "Enter your password") })
type LoginValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const root = useEnterAnimation()
  const session = queryClient.getQueryData(["session"])
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(schema) })
  const login = useMutation({ mutationFn: (values: LoginValues) => api.login(values.username, values.password), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["session"] }); const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname; navigate(from || "/analyze", { replace: true }) } })
  if (session) return <Navigate to="/analyze" replace />
  return <main ref={root} className="relative grid min-h-screen overflow-hidden lg:grid-cols-[1.1fr_.9fr]">
    <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#2dd4bf_0,transparent_26%),radial-gradient(circle_at_85%_75%,#f59e0b_0,transparent_22%)]" />
      <div data-enter className="relative flex items-center gap-3 font-semibold"><span className="grid size-10 place-items-center rounded-xl bg-white/10"><FileCheck2 className="size-5" /></span>Resume Tailor</div>
      <div className="relative max-w-xl"><p data-enter className="mb-4 text-sm font-semibold uppercase tracking-[.18em] text-teal-300">Evidence-led matching</p><h1 data-enter className="font-display text-5xl leading-[1.08]">Make every application more intentional.</h1><p data-enter className="mt-6 max-w-lg text-lg leading-8 text-stone-300">See which job requirements your resume demonstrates, where evidence is missing, and create a tailored version without inventing experience.</p></div>
      <div data-enter className="relative flex gap-6 text-sm text-stone-300"><span className="flex items-center gap-2"><LockKeyhole className="size-4 text-teal-300" />Secure session</span><span className="flex items-center gap-2"><Sparkles className="size-4 text-amber-300" />Factual tailoring</span></div>
    </section>
    <section className="flex items-center justify-center px-5 py-12 sm:px-10">
      <div data-enter className="w-full max-w-md">
        <div className="mb-8 lg:hidden"><div className="flex items-center gap-3 font-semibold"><span className="grid size-10 place-items-center rounded-xl bg-ink text-white"><FileCheck2 className="size-5" /></span>Resume Tailor</div></div>
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-teal-700">Welcome back</p><h2 className="mt-2 font-display text-4xl text-ink">Sign in to continue</h2><p className="mt-3 text-stone-600">Use the account provided by your administrator.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit((values) => login.mutate(values))} noValidate>
          {login.error && <ErrorAlert title="Sign in failed" message={login.error instanceof ApiError ? login.error.message : "Unable to sign in."} />}
          <div><label htmlFor="username" className="mb-2 block text-sm font-semibold text-ink">Username</label><Input id="username" autoComplete="username" aria-invalid={!!errors.username} {...register("username")} />{errors.username && <p className="mt-1 text-sm text-red-700">{errors.username.message}</p>}</div>
          <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">Password</label><Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />{errors.password && <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>}</div>
          <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>{login.isPending ? "Signing in…" : <>Sign in <ArrowRight className="size-4" /></>}</Button>
        </form>
      </div>
    </section>
  </main>
}
