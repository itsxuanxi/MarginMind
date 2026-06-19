import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 radial-fade" />
      <div className="relative">
        <Logo className="justify-center" />
        <p className="mt-10 text-7xl font-semibold tracking-tight text-foreground">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back
          to your profit.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/"><ArrowLeft className="size-4" /> Back home</Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/dashboard"><Compass className="size-4" /> Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
