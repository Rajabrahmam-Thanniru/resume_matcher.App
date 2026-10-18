import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { api } from "@/lib/api"

export function ProtectedRoute() {
  const location = useLocation()
  const session = useQuery({ queryKey: ["session"], queryFn: api.session })
  if (session.isPending) return <div className="grid min-h-screen place-items-center"><div className="text-center"><span className="mx-auto block size-8 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" /><p className="mt-3 text-sm text-stone-600">Checking your session…</p></div></div>
  if (session.isError) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}
