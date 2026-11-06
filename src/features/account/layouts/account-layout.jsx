import { LogOut, Package, RefreshCcw, RotateCcw, UserRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";

import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getAuthUser } from "@/features/auth/utils/get-auth-user";

const accountNavigation = [
  {
    label: "Profile",
    to: "/account",
    end: true,
    icon: UserRound,
  },
  {
    label: "Orders",
    to: "/account/orders",
    icon: Package,
  },
  {
    label: "Returns",
    to: "/account/returns",
    icon: RotateCcw,
  },
  {
    label: "Replacements",
    to: "/account/replacements",
    icon: RefreshCcw,
  },
];

function AccountLayout() {
  const navigate = useNavigate();

  const currentUserQuery = useCurrentUser();

  const logoutMutation = useLogout();

  const user = currentUserQuery.data ? getAuthUser(currentUserQuery.data) : null;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      toast.success("Signed out successfully.");

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.message ?? "Unable to sign out. Please try again.");
    }
  };

  if (currentUserQuery.isPending) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <div className="animate-pulse">
            <div className="h-4 w-36 rounded bg-cloud" />
            <div className="mt-8 h-12 w-64 rounded bg-cloud" />

            <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="h-96 rounded-2xl bg-cloud/50" />
              <div className="h-96 rounded-2xl bg-cloud/50" />
            </div>
          </div>
        </PageContainer>
      </main>
    );
  }

  if (currentUserQuery.isError || !user) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <PageContainer>
          <div className="mx-auto max-w-xl rounded-2xl border border-cloud bg-soft-white p-8 text-center">
            <h1 className="font-display text-3xl font-semibold">We couldn't load your account.</h1>

            <p className="mt-3 text-sm leading-6 text-slate">
              Please refresh the page or sign in again.
            </p>

            <Button type="button" className="mt-6" onClick={() => currentUserQuery.refetch()}>
              Try again
            </Button>
          </div>
        </PageContainer>
      </main>
    );
  }

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "V";

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <PageContainer>
        <Breadcrumbs
          items={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "My account",
            },
          ]}
        />

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            Customer account
          </p>

          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            My account.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
            View your profile and manage your orders, returns and replacements.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside>
            <div className="rounded-2xl border border-cloud bg-soft-white p-5">
              <div className="flex items-center gap-4">
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.fullName ?? "Customer"}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-mint font-semibold">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {user.fullName ||
                      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                      "Customer"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate">{user.email}</p>
                </div>
              </div>

              <nav className="mt-6 border-t border-cloud pt-4" aria-label="Account navigation">
                <div className="space-y-1">
                  {accountNavigation.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                            isActive
                              ? "bg-ink !text-[#F7F3ED] [&_svg]:!text-[#F7F3ED]"
                              : "text-slate hover:bg-cloud/40 hover:text-ink",
                          ].join(" ")
                        }
                      >
                        <Icon className="size-4" aria-hidden="true" />

                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </nav>

              <Button
                type="button"
                variant="outline"
                className="mt-5 w-full"
                disabled={logoutMutation.isPending}
                onClick={handleLogout}
              >
                <LogOut className="size-4" aria-hidden="true" />

                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </aside>

          <section className="min-w-0">
            <Outlet context={{ user }} />
          </section>
        </div>
      </PageContainer>
    </main>
  );
}

export { AccountLayout };
