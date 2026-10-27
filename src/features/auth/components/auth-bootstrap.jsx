import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-bootstrap";

function AuthBootstrap({ children }) {
  const { isBootstrapping } = useAuthBootstrap();

  if (isBootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-medium text-muted-foreground">Loading storefront...</p>
      </main>
    );
  }

  return children;
}

export { AuthBootstrap };
