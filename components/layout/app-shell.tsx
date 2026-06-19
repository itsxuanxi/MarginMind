"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DEMO_USER_KEY, DEMO_AUTH_KEY } from "@/components/auth/demo-auth";
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronsUpDown,
  LogOut,
  User as UserIcon,
  CreditCard,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { NAV, PAGE_META } from "./nav";

export interface SessionUser {
  name: string;
  email: string;
  company: string;
  plan: string;
  isAdmin: boolean;
}

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => setMobileOpen(false), [pathname]);

  const meta =
    PAGE_META[pathname] ||
    PAGE_META[Object.keys(PAGE_META).find((k) => pathname.startsWith(k)) || ""] ||
    { title: "MarginMind", subtitle: "" };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar lg:flex">
        <SidebarContent user={user} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar animate-fade-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 text-sidebar-muted hover:text-white"
            >
              <X className="size-5" />
            </button>
            <SidebarContent user={user} pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 sm:px-6">
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-tight">{meta.title}</h1>
            {meta.subtitle && (
              <p className="truncate text-xs text-muted-foreground">{meta.subtitle}</p>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search SKUs, markets…"
                className="h-9 w-56 rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <Button asChild size="sm" variant="brand" className="hidden sm:inline-flex">
              <Link href="/ai-agent">
                <Sparkles className="size-4" /> Ask AI
              </Link>
            </Button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent">
              <Bell className="size-[18px]" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand ring-2 ring-card" />
            </button>
            <UserMenu user={user} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, pathname }: { user: SessionUser; pathname: string }) {
  return (
    <>
      <div className="flex h-16 items-center px-5">
        <Logo tone="light" />
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV.map((section) => {
          const items = section.items.filter((i) => !i.adminOnly || user.isAdmin);
          if (!items.length) return null;
          return (
            <div key={section.title}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-white"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-[18px] shrink-0",
                          active ? "text-brand" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/billing"
          className="block rounded-xl bg-sidebar-accent p-3 transition-colors hover:bg-sidebar-accent/80"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground">Current plan</span>
            <Badge variant="success" className="capitalize">{user.plan}</Badge>
          </div>
          <p className="mt-2 text-[11px] text-sidebar-muted">
            3,240 / 5,000 orders this month
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sidebar">
            <div className="h-full rounded-full bg-brand" style={{ width: "65%" }} />
          </div>
          <span className="mt-2 inline-block text-[11px] font-medium text-brand">
            Manage plan →
          </span>
        </Link>
      </div>
    </>
  );
}

function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const signOut = () => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(DEMO_AUTH_KEY);
    } catch {
      /* ignore */
    }
    router.push("/sign-in");
  };
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent"
      >
        <Avatar name={user.name} className="size-8" />
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl animate-fade-up">
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">{user.company}</p>
          </div>
          <div className="my-1 h-px bg-border" />
          {[
            { label: "Profile", href: "/profile", icon: UserIcon },
            { label: "Billing", href: "/billing", icon: CreditCard },
          ].map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-accent"
            >
              <i.icon className="size-4 text-muted-foreground" /> {i.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-border" />
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground">
            <Check className="size-4 text-brand" /> Demo session
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
