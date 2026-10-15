import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("Storefront App", () => {
  it("renders the VOQYRA design-system foundation", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /fashion,\s*without the ordinary/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Shop the drop",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Explore collection",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Color system",
      }),
    ).toBeInTheDocument();
  });
});
