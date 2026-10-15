import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("Storefront App", () => {
  it("renders the Vite starter screen and increments the counter", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "Get started",
      }),
    ).toBeInTheDocument();

    const counterButton = screen.getByRole("button", {
      name: "Count is 0",
    });

    await user.click(counterButton);

    expect(
      screen.getByRole("button", {
        name: "Count is 1",
      }),
    ).toBeInTheDocument();
  });
});
