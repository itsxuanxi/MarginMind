"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Upload, Bell, Info } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INTEGRATIONS, type Integration, type IntegrationStatus } from "@/lib/integrations";

const CATEGORY_ORDER = ["Sales Channel", "Advertising", "Payments", "Logistics"] as const;

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect your sales channels, ad platforms, payments and logistics into one profit picture."
      >
        <Button asChild variant="brand" size="sm">
          <Link href="/upload"><Upload className="size-4" /> Upload CSV instead</Link>
        </Button>
      </PageHeader>

      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          One-click live sync (OAuth) is on the roadmap. Today you can analyze your real numbers by{" "}
          <Link href="/upload" className="font-medium text-brand-strong underline underline-offset-2">uploading a CSV</Link>.
          Tap <span className="font-medium text-foreground">Notify me</span> to be told when a provider goes live.
        </p>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const group = INTEGRATIONS.filter((i) => i.category === cat);
        if (!group.length) return null;
        return (
          <section key={cat} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{cat}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((i) => <IntegrationCard key={i.id} item={i} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function StatusPill({ status }: { status: IntegrationStatus }) {
  if (status === "Coming Soon") return <Badge variant="default"><Clock className="size-3" /> Coming Soon</Badge>;
  return <Badge variant="outline">Available soon</Badge>;
}

function IntegrationCard({ item }: { item: Integration }) {
  const initials = item.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">
            {initials}
          </span>
          <StatusPill status={item.status} />
        </div>
        <h3 className="mt-3 font-semibold">{item.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-4">
          {item.status === "Coming Soon" ? (
            <Button variant="outline" size="sm" className="w-full" disabled>Coming Soon</Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.success(`We'll email you when live ${item.name} sync is ready.`)}
            >
              <Bell className="size-4" /> Notify me
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
