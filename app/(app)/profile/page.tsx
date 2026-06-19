"use client";

import * as React from "react";
import { Check, Shield, Monitor, Smartphone, LogOut, Camera } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionHeading } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, Switch } from "@/components/ui/misc";
import { DEMO_USER } from "@/lib/config";

const SESSIONS = [
  { device: "MacBook Pro · Chrome", location: "New York, US", current: true, icon: Monitor },
  { device: "iPhone 15 · Safari", location: "New York, US", current: false, icon: Smartphone },
];

export default function ProfilePage() {
  const [twoFa, setTwoFa] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Your Profile" description="Manage your personal account and security." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="relative">
              <Avatar name={DEMO_USER.name} className="size-20 text-2xl" />
              <button onClick={() => toast("Photo upload coming soon")} className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                <Camera className="size-3.5" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{DEMO_USER.name}</h2>
            <p className="text-sm text-muted-foreground">{DEMO_USER.email}</p>
            <Badge variant="success" className="mt-3 capitalize">{DEMO_USER.role} · {DEMO_USER.plan} plan</Badge>
            <p className="mt-4 text-xs text-muted-foreground">{DEMO_USER.company}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><SectionHeading title="Personal information" /></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>First name</Label><Input defaultValue="Alex" /></div>
              <div className="space-y-1.5"><Label>Last name</Label><Input defaultValue="Rivera" /></div>
            </div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue={DEMO_USER.email} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Role</Label><Input defaultValue="Founder" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+1 (555) 012-3456" /></div>
            </div>
            <div className="flex justify-end"><Button variant="brand" onClick={() => toast.success("Profile updated.")}><Check className="size-4" /> Save</Button></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><SectionHeading title="Security" description="Keep your account protected." /></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary"><Shield className="size-5 text-muted-foreground" /></span>
              <div><p className="text-sm font-medium">Two-factor authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p></div>
            </div>
            <Switch checked={twoFa} onCheckedChange={(v) => { setTwoFa(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="text-sm font-medium">Password</p><p className="text-xs text-muted-foreground">Last changed 3 months ago</p></div>
            <Button variant="outline" size="sm" onClick={() => toast("Password reset email sent")}>Change password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Active sessions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {SESSIONS.map((s) => (
            <div key={s.device} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary"><s.icon className="size-5 text-muted-foreground" /></span>
                <div><p className="text-sm font-medium">{s.device}</p><p className="text-xs text-muted-foreground">{s.location}</p></div>
              </div>
              {s.current ? <Badge variant="success">This device</Badge> : <Button variant="ghost" size="sm" onClick={() => toast("Session revoked")}><LogOut className="size-4" /> Revoke</Button>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
