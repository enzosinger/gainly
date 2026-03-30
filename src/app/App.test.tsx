import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import App from "./App";
import { renderWithAppRouter } from "../test/test-utils";

const mockUseConvexAuth = vi.fn();
const mockUseMutation = vi.fn();
const mockUseQuery = vi.fn();

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");

  return {
    ...actual,
    useConvexAuth: () => mockUseConvexAuth(),
    useMutation: () => mockUseMutation,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
  };
});

vi.mock("@convex-dev/auth/react", () => ({
  ConvexAuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuthActions: () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("../state/gainly-store", async () => {
  const actual = await vi.importActual<typeof import("../state/gainly-store")>("../state/gainly-store");

  return {
    ...actual,
    ConvexGainlyStoreProvider: ({ children }: { children: ReactNode }) => (
      <actual.GainlyStoreProvider>{children}</actual.GainlyStoreProvider>
    ),
  };
});

vi.mock("../pages/WorkoutPage", () => ({
  default: () => <h1 className="screen-title">Push workout</h1>,
}));

describe("App shell", () => {
  beforeEach(() => {
    mockUseConvexAuth.mockReset();
    mockUseMutation.mockReset();
    mockUseQuery.mockReset();
    mockUseMutation.mockResolvedValue({ seeded: false });
    mockUseQuery.mockReturnValue(null);
  });

  it("renders the public landing page while signed out", () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    render(<App />);

    expect(screen.getByRole("heading", { name: /training os for lifters/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /primary navigation/i })).not.toBeInTheDocument();
  });

  it("renders each primary destination route once authenticated", async () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    const dashboard = renderWithAppRouter(["/"]);
    expect(await screen.findByRole("heading", { name: /your training week/i })).toBeInTheDocument();
    dashboard.unmount();

    const routines = renderWithAppRouter(["/routines"]);
    expect(await screen.findByRole("heading", { name: /^routines$/i })).toBeInTheDocument();
    routines.unmount();

    const routineDetail = renderWithAppRouter(["/routines/routine-upper-a"]);
    expect(await screen.findByRole("heading", { name: /push builder/i })).toBeInTheDocument();
    routineDetail.unmount();

    const exercises = renderWithAppRouter(["/exercises"]);
    expect(await screen.findByRole("heading", { name: /^exercises$/i })).toBeInTheDocument();
    exercises.unmount();

    const profile = renderWithAppRouter(["/profile"]);
    expect(await screen.findByRole("heading", { name: /profile/i })).toBeInTheDocument();
    profile.unmount();

    const workout = renderWithAppRouter(["/workout"]);
    expect(await screen.findByRole("heading", { name: /push workout/i })).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);
    workout.unmount();
  });

  it("exposes a dashboard link to the workout logger once authenticated", async () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    renderWithAppRouter(["/"]);
    const logLink = await screen.findByRole("link", { name: /^log push workout$/i });

    expect(logLink).toHaveAttribute("href", "/workout/routine-upper-a");

    const pushCard = logLink.closest(".panel-card");

    expect(pushCard).toBeInTheDocument();
    expect(within(pushCard as HTMLElement).getByText("Monday")).toBeInTheDocument();
    expect(within(pushCard as HTMLElement).getByTestId("status-glyph")).toHaveClass(
      "bg-[hsl(var(--panel-inset))]",
      "text-[hsl(var(--muted-foreground))]",
    );
  });

  it("renders the authenticated shell once the user is signed in", async () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    renderWithAppRouter(["/"]);

    const desktopAside = await screen.findByRole("navigation", { name: /primary navigation/i });
    const mobileNavigation = screen.getByRole("navigation", { name: /primary mobile navigation/i });
    const mainRegion = screen.getByRole("main");

    expect(desktopAside.closest("aside")).toHaveClass("app-shell-sidebar");
    expect(mobileNavigation).toHaveClass("app-shell-mobile-nav");
    expect(mainRegion).toHaveClass("app-shell-main");
    expect(screen.getByText(/monochrome athletic/i)).toBeInTheDocument();
  });
});
