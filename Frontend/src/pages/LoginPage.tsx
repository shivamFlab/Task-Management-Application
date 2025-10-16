import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/slices/authSlice";
import { Navigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { token, status, error } = useAppSelector((s) => s.auth);

  const {
    register: reg,
    handleSubmit,
    formState,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (token) return <Navigate to="/" replace />;

  return (
    <div className="container flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="muted mt-1">Sign in to continue to your tasks</p>
        </div>
        <div className="card">
          <form
            onSubmit={handleSubmit((v) => dispatch(login(v)))}
            className="space-y-4"
          >
            <div className="grid gap-1">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                placeholder="you@example.com"
                {...reg("email")}
              />
              {formState.errors.email && (
                <p className="text-red-600 text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input"
                placeholder="••••••••"
                type="password"
                {...reg("password")}
              />
              {formState.errors.password && (
                <p className="text-red-600 text-sm">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              className="btn w-full flex justify-center items-center text-center"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm">
          No account?{" "}
          <Link className="font-medium" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
