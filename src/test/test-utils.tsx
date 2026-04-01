import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import App from "../app/App";
import { appRoutes } from "../app/router";
import { LanguageProvider } from "../i18n/LanguageProvider";

export function renderWithAppRouter(initialEntries: string[] = ["/"]) {
  const router = createMemoryRouter(appRoutes, { initialEntries });
  return {
    router,
    ...render(
      <LanguageProvider>
        <App router={router} />
      </LanguageProvider>,
    ),
  };
}
