import { FileSearch, LogOut, Menu, TextSearch } from "lucide-react"
import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { queryClient } from "@/lib/query-client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { to: "/analyze", label: "Analyze PDF", icon: FileSearch },
  { to: "/text-match", label: "Text matcher", icon: TextSearch },
]

export function AppShell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const logout = useMutation({ mutationFn: api.logout, onSettled: () => { queryClient.clear(); navigate("/login", { replace: true }) } })
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/analyze" className="flex items-center gap-3 font-semibold text-ink"><span className="grid size-9 place-items-center rounded-xl bg-ink text-white"><FileSearch className="size-5" /></span><span>Resume Tailor</span></NavLink>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", isActive ? "bg-white text-ink shadow-sm" : "text-stone-600 hover:text-ink")}><Icon className="size-4" />{label}</NavLink>)}
          <Button variant="ghost" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}><LogOut className="size-4" />Log out</Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}><Menu className="size-5" /></Button>
      </div>
      {open && <nav className="border-t border-stone-200 px-4 py-3 md:hidden" aria-label="Mobile navigation">{links.map(({ to, label }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-medium text-stone-700">{label}</NavLink>)}<button onClick={() => logout.mutate()} className="w-full rounded-lg px-3 py-2 text-left font-medium text-stone-700">Log out</button></nav>}
    </header>
    <main><Outlet /></main>
  </div>
}
