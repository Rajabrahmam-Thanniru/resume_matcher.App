import { lazy, Suspense } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { ProtectedRoute } from "@/features/auth/protected-route"

const LoginPage = lazy(() => import("@/features/auth/login-page").then((module) => ({ default: module.LoginPage })))
const AnalyzePage = lazy(() => import("@/features/analysis/analyze-page").then((module) => ({ default: module.AnalyzePage })))
const LegacyMatchPage = lazy(() => import("@/features/legacy/legacy-match-page").then((module) => ({ default: module.LegacyMatchPage })))

function PageLoader() {
  return <div className="grid min-h-[60vh] place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" /></div>
}

const router = createBrowserRouter([
  { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
  { element: <ProtectedRoute />, children: [{ element: <AppShell />, children: [
    { path: "/analyze", element: <Suspense fallback={<PageLoader />}><AnalyzePage /></Suspense> },
    { path: "/text-match", element: <Suspense fallback={<PageLoader />}><LegacyMatchPage /></Suspense> },
  ] }] },
  { path: "*", element: <Navigate to="/analyze" replace /> },
])

export function App() { return <RouterProvider router={router} /> }
