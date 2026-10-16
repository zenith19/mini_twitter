import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, signIn, SIGNED_IN_USER } from "../test-utils";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

describe("auth-dependent chrome", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  test("the sidebar hides the follow links when signed out", () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.queryByText("Following")).not.toBeInTheDocument();
    expect(screen.queryByText("Followers")).not.toBeInTheDocument();
  });

  test("the sidebar shows the follow links when signed in", () => {
    signIn();
    renderWithProviders(<Sidebar />);

    expect(screen.getByText("Following")).toBeInTheDocument();
    expect(screen.getByText("Followers")).toBeInTheDocument();
  });

  test("the header offers log in / sign up when signed out", () => {
    renderWithProviders(<Header />);

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
  });

  test("the header shows the current user when signed in", () => {
    signIn();
    renderWithProviders(<Header />);

    expect(screen.getByText(SIGNED_IN_USER.name)).toBeInTheDocument();
    expect(screen.getByText(`@${SIGNED_IN_USER.username}`)).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("corrupt localStorage logs the user out instead of crashing", () => {
    // Several of the old components called
    // JSON.parse(localStorage.getItem(...)).id at module scope, which threw.
    window.localStorage.setItem("loginData", "{not json");

    renderWithProviders(<Header />);
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });
});

describe("small-screen navigation", () => {
  beforeEach(() => window.localStorage.clear());

  test("the header exposes a menu button to reach the nav", () => {
    // The sidebar is hidden below the md breakpoint. Without this button
    // there was no way to reach People, Following or Followers on a phone.
    renderWithProviders(<Header onMenuClick={() => {}} />);

    expect(screen.getByLabelText("Open navigation")).toBeInTheDocument();
  });

  test("the menu button calls back so the drawer can open", async () => {
    const onMenuClick = vi.fn();
    renderWithProviders(<Header onMenuClick={onMenuClick} />);

    await userEvent.click(screen.getByLabelText("Open navigation"));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});
