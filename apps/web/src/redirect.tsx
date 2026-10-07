import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

// Redirect only when the destination changes, after the current render commits.
export function RouteRedirect({ to, redirect }: { to: string; redirect?: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to, search: redirect ? { redirect } : undefined, replace: true });
  }, [navigate, to, redirect]);
  return null;
}
