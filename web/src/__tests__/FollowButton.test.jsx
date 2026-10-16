import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, signIn, waitFor } from "../test-utils";
import client from "../api/client";
import FollowButton from "../components/FollowButton";

describe("FollowButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders nothing when signed out", () => {
    const { container } = renderWithProviders(<FollowButton userId={2} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing on your own profile", () => {
    signIn();
    const { container } = renderWithProviders(<FollowButton userId={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("follows with a single request and no page reload", async () => {
    // The old /follow/:id route called window.location.reload() from inside
    // its JSX, so it looped and POSTed on every pass.
    signIn();
    const post = vi.spyOn(client, "post").mockResolvedValue({ data: {} });
    renderWithProviders(<FollowButton userId={2} initiallyFollowing={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Following" })).toBeInTheDocument());
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/v1/follows", { following_user_id: 2 });
  });

  test("unfollows via DELETE when already following", async () => {
    signIn();
    const del = vi.spyOn(client, "delete").mockResolvedValue({ data: {} });
    renderWithProviders(<FollowButton userId={2} initiallyFollowing />);

    await userEvent.click(screen.getByRole("button", { name: "Following" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument());
    expect(del).toHaveBeenCalledWith("/v1/follows/2");
  });

  test("stays in the previous state when the request fails", async () => {
    signIn();
    vi.spyOn(client, "post").mockRejectedValue({ response: { data: { error: "nope" } } });
    renderWithProviders(<FollowButton userId={2} initiallyFollowing={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument());
  });
});
