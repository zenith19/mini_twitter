import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "../test-utils";
import client from "../api/client";
import Login from "../pages/Login";

describe("Login", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test("does not call the API on mount", async () => {
    // The old Login fired a POST with an empty body from a useEffect as soon
    // as it rendered, before the user had typed anything.
    const post = vi.spyOn(client, "post");
    renderWithProviders(<Login />);

    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());
    expect(post).not.toHaveBeenCalled();
  });

  test("does not clear localStorage on render", () => {
    // The old Login called localStorage.clear() in its render body, wiping
    // unrelated keys every time the route was visited.
    window.localStorage.setItem("unrelated", "keep me");
    renderWithProviders(<Login />);

    expect(window.localStorage.getItem("unrelated")).toBe("keep me");
  });

  test("validates before submitting", async () => {
    const post = vi.spyOn(client, "post");
    renderWithProviders(<Login />);

    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("posts the credentials and stores the session on success", async () => {
    const post = vi.spyOn(client, "post").mockResolvedValue({
      data: { id: 1, name: "Alice", username: "alice", authentication_token: "tok" },
    });

    renderWithProviders(<Login />);
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith("/v1/sessions", {
        email: "alice@example.com",
        password: "password123",
      }),
    );
    await waitFor(() =>
      expect(JSON.parse(window.localStorage.getItem("loginData")).authentication_token).toBe("tok"),
    );
  });

  test("shows the API error message on a failed login", async () => {
    vi.spyOn(client, "post").mockRejectedValue({
      response: { data: { error: "Invalid email or password" } },
    });

    renderWithProviders(<Login />);
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    // The old app logged errors to the console and showed the user nothing.
    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(window.localStorage.getItem("loginData")).toBeNull();
  });
});
