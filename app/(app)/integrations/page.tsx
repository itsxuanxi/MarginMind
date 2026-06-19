"use client";

import * as React from "react";
import { Check, Plug, Clock, Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INTEGRATIONS, type Integration, type IntegrationStatus } from "@/lib/integrations";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["Sales Channel", "Advertising", "Payments", "Logistics"] as const;

export default function IntegrationsPage() {
  const [items, setItems] = React.useState<Integration[]>(INTEGRATIONS);

  const connect = (id: string) => {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, status: "Connected", syncedAt: new Date().toISOString() } : i)));
    toast.success("Connected — initial sync started.");
  };
  const disconnect = (id: string) => {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, status: "Available", syncedAt: undefined } : i)));
    toast("Disconnected.");
  };

  const connected = items.filter((i) => i.status === "Connected").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" description="Connect your sales channels, ad platforms, payments and logistics into one profit picture.">
        <Badge variant="success" className="h-8 px-3"><Plug className="size-3.5" /> {connected} connected</Badge>
      </PageHeader>

      {CATEGORY_ORDER.map((cat) => {
        const group = items.filter((i) => i.category === cat);
        if (!group.length) return null;
        return (
          <section key={cat} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{cat}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((i) => <IntegrationCard key={i.id} item={i} onConnect={connect} onDisconnect={disconnect} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function StatusPill({ status }: { status: IntegrationStatus }) {
  if (status === "Connected") return <Badge variant="success"><span className="size-1.5 rounded-full bg-brand" /> Connected</Badge>;
  if (status === "Coming Soon") return <Badge variant="default"><Clock className="size-3" /> Coming Soon</Badge>;
  return <Badge variant="outline">Available</Badge>;
}

function IntegrationCard({ item, onConnect, onDisconnect }: { item: Integration; onConnect: (id: string) => void; onDisconnect: (id: string) => void }) {
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
        {item.status === "Connected" && item.syncedAt && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="size-3" /> Synced {relativeTime(item.syncedAt)}
          </p>
        )}
        <div className="mt-4">
          {item.status === "Connected" ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success("Re-syncing now…")}>
                <RefreshCw className="size-4" /> Sync
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDisconnect(item.id)}>Disconnect</Button>
            </div>
          ) : item.status === "Available" ? (
            <Button variant="brand" size="sm" className="w-full" onClick={() => onConnect(item.id)}>
              <Link2 className="size-4" /> Connect
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>Coming Soon</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
