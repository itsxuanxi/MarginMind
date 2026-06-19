import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { DemoAuth } from "@/components/auth/demo-auth";
import { features } from "@/lib/config";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell heading="Welcome back" sub="Sign in to your MarginMind workspace.">
      {features.clerk ? (
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
      ) : (
        <DemoAuth mode="sign-in" />
      )}
    </AuthShell>
  );
}
