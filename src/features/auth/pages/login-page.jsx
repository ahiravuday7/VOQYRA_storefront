import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema } from "@/features/auth/schemas/login-schema";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await loginMutation.mutateAsync(values);

      const destination = location.state?.from?.pathname ?? "/";

      navigate(destination, {
        replace: true,
      });
    } catch {
      toast.error("Unable to sign in. Check your email and password.");
    }
  };

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-12">
        <section className="mx-auto w-full max-w-md">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
            VOQYRA
          </Link>

          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.04em]">
            Welcome back.
          </h1>

          <p className="mt-3 text-base leading-7 text-slate">
            Sign in to access your account, orders, wishlist and saved details.
          </p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />

              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate">
            New to VOQYRA?{" "}
            <Link to="/register" className="font-semibold text-ink underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export { LoginPage };
