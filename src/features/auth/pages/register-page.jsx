import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/features/auth/hooks/use-register";
import { registerSchema } from "@/features/auth/schemas/register-schema";

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        phone: values.phone || undefined,
      };

      await registerMutation.mutateAsync(payload);

      toast.success("Account created successfully. Please sign in.");

      navigate("/login", {
        replace: true,
        state: location.state,
      });
    } catch (error) {
      toast.error(error?.message ?? "Unable to create your account. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-porcelain text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-12">
        <section className="mx-auto w-full max-w-md">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
            VOQYRA
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            New customer
          </p>

          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em]">
            Join VOQYRA.
          </h1>

          <p className="mt-3 text-base leading-7 text-slate">
            Create your account to shop, save favorites, manage orders and access your customer
            profile.
          </p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>

                <Input
                  id="firstName"
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                  {...register("firstName")}
                />

                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>

                <Input
                  id="lastName"
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.lastName)}
                  {...register("lastName")}
                />

                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
              <Label htmlFor="phone">
                Phone
                <span className="ml-1 text-slate">(optional)</span>
              </Label>

              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+919876543210"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />

              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}

              <p className="text-xs leading-5 text-slate">
                Use at least 8 characters with uppercase, lowercase, number and special character.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>

              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate">
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-ink underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export { RegisterPage };
