import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderWithProviders, screen, signIn, waitFor } from "../test-utils";
import client, { setAuthToken } from "../api/client";
import Header from "../components/Header";
import Feed from "../pages/Feed";

const realAdapter = client.defaults.adapter;

// Mocking client.get directly would bypass the interceptors, which are the
// thing under test. Replacing the adapter keeps the real axios pipeline.
function rejectWith(status) {
  client.defaults.adapter = (config) => {
    const error = new Error(`Request failed with status ${status}`);
    error.config = config;
    error.response = { status, data: {}, config };
    return Promise.reject(error);
  };
}

describe("session expiry", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    setAuthToken(null);
  });

  afterEach(() => {
    client.defaults.adapter = realAdapter;
  });

  test("a 401 on a normal request signs the user out", async () => {
    // A revoked token used to leave the UI looking signed in: every request
    // 401'd, an error appeared, and the header still showed the user's name.
    signIn();
    rejectWith(401);

    renderWithProviders(
      <>
        <Header />
        <Feed />
      </>,
    );

    expect(screen.getByText("Alice Anderson")).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByText("Log in").length).toBeGreaterThan(0));
    expect(screen.queryByText("Alice Anderson")).not.toBeInTheDocument();
    expect(window.localStorage.getItem("loginData")).toBeNull();
  });

  test("a failed login is not treated as an expired session", async () => {
    // POST /v1/sessions returns 401 for a wrong password. That must surface
    // as a form error, not sign the user out.
    signIn();
    rejectWith(401);

    renderWithProviders(<Header />);
    expect(screen.getByText("Alice Anderson")).toBeInTheDocument();

    await expect(client.post("/v1/sessions", {})).rejects.toBeTruthy();

    expect(screen.getByText("Alice Anderson")).toBeInTheDocument();
    expect(window.localStorage.getItem("loginData")).not.toBeNull();
  });

  test("a 401 while signed out does nothing", async () => {
    rejectWith(401);
    renderWithProviders(<Header />);

    await expect(client.get("/v1/posts")).rejects.toBeTruthy();
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });
});
