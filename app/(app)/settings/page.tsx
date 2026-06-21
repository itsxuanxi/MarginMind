"use client";

import * as React from "react";
import { Plus, Trash2, Mail, Building2, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader, SectionHeading } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch, Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { STORES } from "@/lib/mock-data";
import { ExportMenu } from "@/components/export-menu";

const TEAM = [
  { name: "Alex Rivera", email: "zhang2543723434@gmail.com", role: "Owner", status: "Active" },
  { name: "Jordan Lee", email: "jordan@northwind.co", role: "Admin", status: "Active" },
  { name: "Sam Patel", email: "sam@northwind.co", role: "Analyst", status: "Invited" },
];

export default function SettingsPage() {
  const [notif, setNotif] = React.useState({ weekly: true, leaks: true, ai: true, billing: true, product: false });
  const [invite, setInvite] = React.useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your workspace, team and preferences." />

      <div className="rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm text-muted-foreground">
        Preferences apply to your current session. Permanent saving, team invites and store
        management activate once you connect a workspace.
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><SectionHeading title="Workspace" description="Basic information about your business." /></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Company name</Label><Input defaultValue="Northwind Goods Co." /></div>
                <div className="space-y-1.5"><Label>Website</Label><Input defaultValue="northwind.co" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5"><Label>Reporting currency</Label>
                  <Select defaultValue="USD"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option></Select>
                </div>
                <div className="space-y-1.5"><Label>Timezone</Label>
                  <Select defaultValue="America/New_York"><option>America/New_York</option><option>America/Los_Angeles</option><option>Europe/London</option><option>Europe/Berlin</option></Select>
                </div>
                <div className="space-y-1.5"><Label>Fiscal year start</Label>
                  <Select defaultValue="January"><option>January</option><option>April</option><option>July</option><option>October</option></Select>
                </div>
              </div>
              <div className="flex justify-end"><Button variant="brand" onClick={() => toast.success("Settings updated for this session.")}><Check className="size-4" /> Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <SectionHeading title="Connected stores" description="Stores feeding profit data into MarginMind." />
              <Button asChild variant="outline" size="sm"><Link href="/integrations"><Plus className="size-4" /> Add store</Link></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {STORES.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-secondary"><Building2 className="size-5 text-muted-foreground" /></span>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.channel} · {s.market} · {s.currency}</p>
                    </div>
                  </div>
                  <Badge variant="success"><span className="size-1.5 rounded-full bg-brand" /> Active</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader><SectionHeading title="Invite teammates" description="Bring your team into the profit conversation." /></CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => { e.preventDefault(); if (invite) { toast.success("Team invites activate once your workspace is connected."); setInvite(""); } }}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={invite} onChange={(e) => setInvite(e.target.value)} placeholder="teammate@company.com" type="email" className="pl-9" />
                </div>
                <Select defaultValue="Analyst" className="sm:w-40"><option>Admin</option><option>Analyst</option><option>Viewer</option></Select>
                <Button type="submit" variant="brand">Send invite</Button>
              </form>
              <div className="space-y-2">
                {TEAM.map((m) => (
                  <div key={m.email} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} />
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={m.status === "Active" ? "success" : "info"}>{m.status}</Badge>
                      <span className="text-sm text-muted-foreground">{m.role}</span>
                      {m.role !== "Owner" && (
                        <Button variant="ghost" size="icon" onClick={() => toast("Team management activates once your workspace is connected.")}><Trash2 className="size-4 text-muted-foreground" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><SectionHeading title="Notifications" description="Choose what we email you about." /></CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "weekly", title: "Weekly profit report", desc: "A Monday summary of last week's profit and margin." },
                { key: "leaks", title: "New profit leaks", desc: "Get alerted when a new leak crosses a severity threshold." },
                { key: "ai", title: "AI recommendations", desc: "Notify me when high-impact recommendations are ready." },
                { key: "billing", title: "Billing & usage", desc: "Receipts, plan changes and usage limits." },
                { key: "product", title: "Product updates", desc: "Occasional news about new features." },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                  <div><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
                  <Switch checked={(notif as any)[n.key]} onCheckedChange={(v) => { setNotif((s) => ({ ...s, [n.key]: v })); toast.success("Preference updated for this session."); }} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Export your data</CardTitle><CardDescription>Download a full copy of your profit data as CSV or an executive PDF.</CardDescription></CardHeader>
              <CardContent><ExportMenu variant="outline" align="left" /></CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader><CardTitle className="text-red-600">Delete workspace</CardTitle><CardDescription>Permanently delete this workspace and all of its data. This cannot be undone.</CardDescription></CardHeader>
              <CardContent><Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => toast.error("Type your workspace name to confirm deletion.")}>Delete workspace</Button></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
