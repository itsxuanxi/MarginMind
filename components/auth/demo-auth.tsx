"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, User, Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "sign-in" | "sign-up";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** localStorage keys for the demo auth fallback. */
export const DEMO_USER_KEY = "marginmind_demo_user";
export const DEMO_AUTH_KEY = "marginmind_demo_auth";

interface FormValues {
  name: string;
  email: string;
  password: string;
  company: string;
}

export function DemoAuth({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState<FormValues>({
    name: isSignUp ? "Xuanxi Zhang" : "",
    email: "zhang2543723434@gmail.com",
    password: "demo1234",
    company: isSignUp ? "Northwind Goods Co." : "",
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});

  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormValues, string>> = {};
    if (isSignUp && values.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!EMAIL_RE.test(values.email.trim())) e.email = "Enter a valid email address.";
    if (values.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (isSignUp && values.company.trim().length < 2) e.company = "Enter your company or store name.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Demo fallback: persist a lightweight session in localStorage.
    try {
      const user = {
        name: isSignUp ? values.name.trim() : values.email.trim().split("@")[0],
        email: values.email.trim(),
        company: isSignUp ? values.company.trim() : "Demo Store",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
      localStorage.setItem(DEMO_AUTH_KEY, "true");
    } catch {
      /* localStorage unavailable — continue anyway */
    }

    // Sign-up → onboarding (if available), sign-in → dashboard.
    const dest = isSignUp ? "/onboarding" : "/dashboard";
    setTimeout(() => router.push(dest), 550);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand/20 bg-[var(--brand-soft)]/50 px-3 py-2 text-xs text-brand-strong">
        Demo mode — no real account is created. Your details are stored locally so you can explore the full product.
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        {isSignUp && (
          <Field
            id="name"
            label="Full name"
            icon={User}
            value={values.name}
            onChange={set("name")}
            placeholder="Xuanxi Zhang"
            error={errors.name}
          />
        )}

        <Field
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          value={values.email}
          onChange={set("email")}
          placeholder="you@store.com"
          error={errors.email}
        />

        {isSignUp && (
          <Field
            id="company"
            label="Company / store name"
            icon={Building2}
            value={values.company}
            onChange={set("company")}
            placeholder="Northwind Goods Co."
            error={errors.company}
          />
        )}

        <Field
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          value={values.password}
          onChange={set("password")}
          placeholder="••••••••"
          error={errors.password}
        />

        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {isSignUp ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-brand hover:underline">Sign in</Link>
          </>
        ) : (
          <>
            New to MarginMind?{" "}
            <Link href="/sign-up" className="font-medium text-brand hover:underline">Start free</Link>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  error,
  type = "text",
  ...props
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          className={cn("pl-9", error && "border-red-400 focus-visible:ring-red-200")}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
