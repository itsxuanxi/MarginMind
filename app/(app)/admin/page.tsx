import { Lock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { getSessionUser } from "@/lib/session";
import { isDemoMode } from "@/lib/config";

export const metadata = { title: "Founder Analytics" };

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user.isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><Lock className="size-6" /></span>
            <h2 className="mt-4 text-lg font-semibold">Restricted area</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The Founder Analytics dashboard is only available to workspace admins. Add your email
              to <code className="rounded bg-secondary px-1">ADMIN_EMAILS</code> to gain access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Founder Analytics" description="Private business metrics — signups, revenue, churn and product usage.">
        <Badge variant="purple" className="h-8 px-3"><ShieldCheck className="size-3.5" /> Admin only</Badge>
      </PageHeader>
      {isDemoMode && (
        <div className="rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-muted-foreground">
          Demo mode — figures are illustrative. Connect Stripe & Supabase for live metrics.
        </div>
      )}
      <AdminAnalytics />
    </div>
  );
}
