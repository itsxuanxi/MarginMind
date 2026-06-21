import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { DemoAuth } from "@/components/auth/demo-auth";
import { features } from "@/lib/config";

export const metadata = { title: "Start free" };

export default function SignUpPage() {
  return (
    <AuthShell heading="Create your account" sub="Run your first profit analysis free. No credit card required.">
      {features.clerk ? (
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboarding" />
      ) : (
        <DemoAuth mode="sign-up" />
      )}
    </AuthShell>
  );
}
