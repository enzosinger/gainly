import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useLanguage } from "../../i18n/LanguageProvider";

type AuthMode = "signIn" | "signUp";

export default function PasswordAuthForm() {
  const { signIn } = useAuthActions();
  const { copy } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", mode);
      await signIn("password", formData);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.auth.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle>{mode === "signIn" ? copy.auth.welcomeBack : copy.auth.createAccount}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="block text-[hsl(var(--muted-foreground))]">{copy.auth.email}</span>
            <Input
              className="mt-1.5"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="block text-[hsl(var(--muted-foreground))]">{copy.auth.password}</span>
            <Input
              className="mt-1.5"
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {errorMessage ? (
            <div className="rounded-2xl border border-[hsl(var(--border))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button type="submit" className="sm:flex-1" disabled={isSubmitting}>
              {isSubmitting ? copy.auth.submitLoading : mode === "signIn" ? copy.auth.signIn : copy.auth.createAccountAction}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="sm:flex-1"
              onClick={() => {
                setErrorMessage(null);
                setMode((current) => (current === "signIn" ? "signUp" : "signIn"));
              }}
            >
              {mode === "signIn" ? copy.auth.toggleToSignUp : copy.auth.toggleToSignIn}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
