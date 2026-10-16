import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import theme from "./theme";

// Renders a component inside the providers the real app supplies.
export function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

export const SIGNED_IN_USER = {
  id: 1,
  name: "Alice Anderson",
  username: "alice",
  email: "alice@example.com",
  authentication_token: "test-token",
};

export function signIn(user = SIGNED_IN_USER) {
  window.localStorage.setItem("loginData", JSON.stringify(user));
}

export * from "@testing-library/react";
