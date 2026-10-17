import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, signIn, waitFor } from "../test-utils";
import client from "../api/client";
import Feed from "../pages/Feed";

const EMPTY = { data: { posts: [], meta: { current_page: 1, total_pages: 1, total_count: 0 } } };

describe("Feed", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test("signed out: no tabs, and it reads the public list", async () => {
    const get = vi.spyOn(client, "get").mockResolvedValue(EMPTY);
    renderWithProviders(<Feed />);

    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][0]).toContain("/v1/posts");
    expect(screen.queryByRole("tab", { name: "Following" })).not.toBeInTheDocument();
  });

  test("signed in: defaults to the follow-driven timeline", async () => {
    // Until /v1/timeline existed, following somebody changed a button label
    // and nothing else — the feed showed everyone regardless.
    signIn();
    const get = vi.spyOn(client, "get").mockResolvedValue(EMPTY);
    renderWithProviders(<Feed />);

    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][0]).toContain("/v1/timeline");
  });

  test("the Everyone tab switches back to the public list", async () => {
    signIn();
    const get = vi.spyOn(client, "get").mockResolvedValue(EMPTY);
    renderWithProviders(<Feed />);

    await waitFor(() => expect(get).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("tab", { name: "Everyone" }));

    await waitFor(() =>
      expect(get.mock.calls.at(-1)[0]).toContain("/v1/posts"),
    );
  });

  test("an empty timeline points you at the People page", async () => {
    signIn();
    vi.spyOn(client, "get").mockResolvedValue(EMPTY);
    renderWithProviders(<Feed />);

    expect(await screen.findByText(/Your timeline is empty/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "People" })).toHaveAttribute("href", "/users");
  });
});
