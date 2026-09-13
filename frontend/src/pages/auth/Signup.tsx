// src/pages/Signup.tsx
//UI-only version: no state, no hooks, no handlers, no conditional rendering.
import React, {useState, useEffect, type FormEvent} from "react";  //type for the form event
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/layout/Header";
import { useAuth } from "@/hooks/useAuth";

const Signup: React.FC = () => {
    // FIX 1: `username` is the value; `setUsername` is the function that updates it.
    const [username, setUsername] = useState("");
    // FIX 2: A signup form must call `register`, not `login`.
    const { register, loading, isLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();  //a hook from react-router-dom that allows us to navigate programmatically

    // Restore the page requested before the auth guard redirected the visitor.
    const redirect = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [submitting,setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    //triggered when login,register, or logout is called, it will check if the user is logged in and redirect them to the home page if they are
    useEffect(() => {  //sends the user to the home page if they are already logged in and the loading state is false
        if (!loading && isLoggedIn) {
            navigate(redirect, { replace: true });
        }
    }, [loading, isLoggedIn, navigate, redirect]);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();  //we stop the default form submission behavior (stop the page from refreshing) so we can handle the submission with our own logic
        setErr(null);

        if (!email || !password) {   //frontend client-side validation: if the email or password is empty, we set an error message and return early
            setErr("email and password are required");
            return;
        }

        try {
            // FIX 3: `submitting` is a boolean. Only its setter is callable.
            setSubmitting(true);
            // FIX 4: Include the optional username when registering the account.
            await register({ email, password, username: username || undefined });
            navigate(redirect, { replace: true });
        } catch {
            setErr("could not create account. Try a different email/username.");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <>
            <Header />

            <main className="relative grid min-h-screen place-items-center overflow-hidden bg-white p-4 text-gray-900 dark:bg-gradient-to-b dark:from-black dark:via-neutral-950 dark:to-black dark:text-white">
                {/* ambient glow (dark mode only) */}
                <div className="pointer-events-none absolute inset-0 hidden dark:block">
                    <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="absolute -bottom-24 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
                </div>

                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-3 h-11 w-11 rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm dark:bg-white/10 dark:ring-white/15 dark:backdrop-blur">
                            <div className="grid h-full w-full place-items-center">
                                <span className="block h-2 w-2 rounded-full bg-gray-900 dark:bg-white/85" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">Join and get moving fast.</p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-md">
                        {/* Optional error slot (UI only): add/remove 'hidden' to show/hide */}
                        {err &&
                        <div className=" mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">{err}</div>  //conditionally render the error message if there is an error
                        }
                        <form onSubmit={onSubmit} className="space-y-4">
                            {/* Email input field */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Email</label>
                                {/* setting the value of the email input to the email state and updating the email state when the input changes */}
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200 dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/20 dark:focus:bg-black/30 dark:focus-visible:ring-white/10" />
                            </div>
                            {/* Username input field */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Username (optional)</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourhandle" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200 dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/20 dark:focus:bg-black/30 dark:focus-visible:ring-white/10" />
                            </div>
                            {/* Password input field */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Password</label>
                                <div className="relative">
                                     {/* setting the value of the password input to the password state and updating the password state when the input changes */}
                                    <input type="password"value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="••••••••" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200 dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/20 dark:focus:bg-black/30 dark:focus-visible:ring-white/10" />
                                </div>
                            </div>

                            {/* FIX 5: `submit` invokes the form's onSubmit handler. */}
                            <button type="submit" disabled={submitting} className="group relative w-full overflow-hidden rounded-xl bg-gray-900 px-4 py-2.5 text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black">
                                <span className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-white via-neutral-200 to-white opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:block" />
                                {submitting ? "Creating account…" : "Create account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-blue-600 underline underline-offset-4 hover:underline dark:text-white/90 dark:hover:text-white">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-400 dark:text-neutral-500">One account. Session refresh via secure cookies.</p>
                </div>
            </main>
        </>
    );
};

export default Signup;
