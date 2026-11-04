import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

vi.mock("@/features/categories/hooks/use-categories", () => ({
  useCategories: () => ({
    data: [],
    isPending: false,
    isError: false,
  }),
}));

vi.mock("@/features/categories/hooks/use-category-tree", () => ({
  useCategoryTree: () => ({
    data: [],
    isPending: false,
    isError: false,
  }),
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe("Storefront App", () => {
  it("renders the VOQYRA editorial storefront homepage", () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole("heading", {
        name: /dress\s*beyond\s*ordinary/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("link", {
        name: /shop new arrivals/i,
      }).length,
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByRole("link", {
        name: /explore collections/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "New Drop",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Featured collections",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Right now",
      }),
    ).toBeInTheDocument();
  });
});
