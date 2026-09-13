import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/layout/Header";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
    const { login, loading, isLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const redirect = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/dashboard";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && isLoggedIn) navigate(redirect, { replace: true });
    }, [isLoggedIn, loading, navigate, redirect]);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        try {
            setSubmitting(true);
            await login({ email, password });
            navigate(redirect, { replace: true });
        } catch {
            setError("Email or password is incorrect.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <><Header /><main className="grid min-h-screen place-items-center bg-white p-4 text-gray-900 dark:bg-black dark:text-white"><div className="w-full max-w-md"><div className="mb-6 text-center"><h1 className="text-2xl font-semibold">Welcome back</h1><p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">Sign in to continue.</p></div><div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5">{error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}<form onSubmit={onSubmit} className="space-y-4"><div><label htmlFor="login-email" className="mb-1 block text-sm font-medium">Email</label><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900" /></div><div><label htmlFor="login-password" className="mb-1 block text-sm font-medium">Password</label><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="••••••••" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900" /></div><button type="submit" disabled={submitting} className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black">{submitting ? "Signing in…" : "Sign in"}</button></form><p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">No account? <Link to="/signup" state={location.state} className="font-medium text-blue-600 underline">Create one</Link></p></div></div></main></>
    );
};

export default Login;
