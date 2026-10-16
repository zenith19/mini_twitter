import { describe, expect, test } from "vitest";
import client, { errorMessage, setAuthToken } from "../api/client";

describe("api client", () => {
  test("has a single configured base URL", () => {
    // The URL used to be hard-coded in a dozen components.
    expect(client.defaults.baseURL).toBeTruthy();
  });

  test("attaches the bearer token once set", async () => {
    setAuthToken("abc123");
    const config = await client.interceptors.request.handlers[0].fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBe("Bearer abc123");
  });

  test("sends no Authorization header when signed out", async () => {
    setAuthToken(null);
    const config = await client.interceptors.request.handlers[0].fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });

  test("errorMessage reads the API's error shapes", () => {
    expect(errorMessage({ response: { data: { error: "Unauthorized" } } })).toBe("Unauthorized");
    expect(
      errorMessage({ response: { data: { errors: { title: ["can't be blank"] } } } }),
    ).toBe("can't be blank");
    expect(errorMessage({ message: "Network Error" })).toBe("Network Error");
  });
});
