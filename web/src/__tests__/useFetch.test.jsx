import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import client from "../api/client";
import useFetch from "../api/useFetch";

function Probe({ path }) {
  const { data, loading, error } = useFetch(path);
  if (loading) return <div>loading</div>;
  if (error) return <div>error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
}

describe("useFetch", () => {
  beforeEach(() => vi.restoreAllMocks());

  test("fetches once per path, not once per render", async () => {
    // FollowingCheck passed a freshly-allocated array as its effect
    // dependency, so it re-fetched on every render, forever.
    const get = vi.spyOn(client, "get").mockResolvedValue({ data: { ok: true } });
    const { rerender, findByText } = render(<Probe path="/v1/posts" />);

    await findByText('{"ok":true}');
    rerender(<Probe path="/v1/posts" />);
    rerender(<Probe path="/v1/posts" />);

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
  });

  test("surfaces a readable error instead of swallowing it", async () => {
    vi.spyOn(client, "get").mockRejectedValue({
      response: { data: { error: "Not found" } },
    });

    const { findByText } = render(<Probe path="/v1/posts/999" />);
    expect(await findByText("error: Not found")).toBeInTheDocument();
  });

  test("refetches when the path changes", async () => {
    const get = vi.spyOn(client, "get").mockResolvedValue({ data: { ok: true } });
    const { rerender, findByText } = render(<Probe path="/v1/users/1" />);
    await findByText('{"ok":true}');

    rerender(<Probe path="/v1/users/2" />);
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
  });
});
