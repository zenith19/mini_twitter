import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, signIn, waitFor } from "../test-utils";
import client from "../api/client";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";

const MY_POST = {
  id: 7,
  title: "Mine",
  content: "Body",
  created_at: new Date().toISOString(),
  comments_count: 0,
  user: { id: 1, name: "Alice Anderson", username: "alice" },
};

const THEIR_POST = { ...MY_POST, id: 8, user: { id: 2, name: "Bob", username: "bob" } };

describe("owner actions", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  test("no menu when signed out", () => {
    renderWithProviders(<PostCard post={MY_POST} />);
    expect(screen.queryByLabelText("Post actions")).not.toBeInTheDocument();
  });

  test("no menu on somebody else's post", () => {
    signIn();
    renderWithProviders(<PostCard post={THEIR_POST} />);
    expect(screen.queryByLabelText("Post actions")).not.toBeInTheDocument();
  });

  test("your own post offers Edit and Delete", async () => {
    // The API has supported update and destroy from the start; nothing in the
    // UI reached them, so you could not delete your own post.
    signIn();
    renderWithProviders(<PostCard post={MY_POST} />);

    await userEvent.click(screen.getByLabelText("Post actions"));
    expect(await screen.findByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("deleting asks first, then calls the API and refreshes", async () => {
    signIn();
    const del = vi.spyOn(client, "delete").mockResolvedValue({ data: {} });
    const onChanged = vi.fn();
    renderWithProviders(<PostCard post={MY_POST} onChanged={onChanged} />);

    await userEvent.click(screen.getByLabelText("Post actions"));
    await userEvent.click(await screen.findByText("Delete"));

    expect(await screen.findByText("Delete this post?")).toBeInTheDocument();
    expect(del).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(del).toHaveBeenCalledWith("/v1/posts/7"));
    await waitFor(() => expect(onChanged).toHaveBeenCalled());
  });

  test("cancelling the confirmation deletes nothing", async () => {
    signIn();
    const del = vi.spyOn(client, "delete").mockResolvedValue({ data: {} });
    renderWithProviders(<PostCard post={MY_POST} />);

    await userEvent.click(screen.getByLabelText("Post actions"));
    await userEvent.click(await screen.findByText("Delete"));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(del).not.toHaveBeenCalled();
  });

  test("editing PATCHes the post", async () => {
    signIn();
    const patch = vi.spyOn(client, "patch").mockResolvedValue({ data: {} });
    renderWithProviders(<PostCard post={MY_POST} onChanged={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Post actions"));
    await userEvent.click(await screen.findByText("Edit"));

    const title = await screen.findByLabelText(/title/i);
    await userEvent.clear(title);
    await userEvent.type(title, "Edited");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith("/v1/posts/7", {
        post: { title: "Edited", content: "Body" },
      }),
    );
  });

  test("your own reply can be deleted", async () => {
    signIn();
    const del = vi.spyOn(client, "delete").mockResolvedValue({ data: {} });
    const comment = {
      id: 3,
      content: "Hi",
      created_at: new Date().toISOString(),
      user: { id: 1, name: "Alice Anderson", username: "alice" },
    };
    renderWithProviders(<CommentCard comment={comment} onChanged={vi.fn()} />);

    await userEvent.click(screen.getByLabelText("Reply actions"));
    await userEvent.click(await screen.findByText("Delete"));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(del).toHaveBeenCalledWith("/v1/comments/3"));
  });
});
