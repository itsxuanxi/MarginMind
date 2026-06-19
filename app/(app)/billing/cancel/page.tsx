import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Checkout cancelled" };

export default function BillingCancelPage() {
  return (
    <div className="py-10">
      <Card className="mx-auto max-w-lg">
        <CardContent className="flex flex-col items-center p-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <XCircle className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Checkout cancelled</h1>
          <p className="mt-2 max-w-sm text-muted-foreground">
            No charge was made. Whenever you&apos;re ready, you can pick a plan and unlock unlimited
            exports, AI recommendations and continuous profit monitoring.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/pricing">View plans</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard"><ArrowLeft className="size-4" /> Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
