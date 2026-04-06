import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordAuthForm from "./PasswordAuthForm";
import { LanguageProvider } from "../../i18n/LanguageProvider";

const mockSignIn = vi.fn();

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signIn: mockSignIn,
  }),
}));

function renderForm() {
  return render(
    <LanguageProvider>
      <PasswordAuthForm />
    </LanguageProvider>,
  );
}

describe("PasswordAuthForm", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    window.localStorage.clear();
    Object.defineProperty(window.navigator, "language", {
      value: "en-US",
      configurable: true,
    });
  });

  it("blocks invalid email submit with an inline message", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/enter a valid email address/i);
  });

  it("shows a friendly sign-in failure message and trims the email before submit", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderForm();

    await user.type(screen.getByLabelText(/email/i), "  test@example.com  ");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    const [, formData] = mockSignIn.mock.calls[0];

    expect((formData as FormData).get("email")).toBe("test@example.com");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /unable to sign in with that email and password/i,
    );
  });

  it("shows the account-exists message for sign-up failures", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error("Account test@example.com already exists"));
    renderForm();

    await user.click(screen.getByRole("button", { name: /need an account/i }));
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    const [, formData] = mockSignIn.mock.calls[0];

    expect((formData as FormData).get("flow")).toBe("signUp");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /an account with that email already exists/i,
    );
  });

  it("shows a password guidance message for sign-up validation failures", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error("Invalid password"));
    renderForm();

    await user.click(screen.getByRole("button", { name: /need an account/i }));
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /use at least 8 characters for your password/i,
    );
  });

  it("shows a generic message when sign-up attempts are rate limited", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error("Too many sign-up attempts."));
    renderForm();

    await user.click(screen.getByRole("button", { name: /need an account/i }));
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong\. please try again\./i,
    );
  });
});
