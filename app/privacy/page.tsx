import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 18, 2026"
      sections={[
        {
          heading: "Overview",
          body: [
            "This Privacy Policy describes how MarginMind collects, uses, and protects information when you use the Service. We are committed to handling your financial and business data responsibly.",
          ],
        },
        {
          heading: "Information We Collect",
          body: [
            "Account information such as your name, email and company. Commerce data you upload or connect, including orders, product costs, ad spend, shipping, customs and returns. Usage data such as pages visited and features used, collected to improve the product.",
          ],
        },
        {
          heading: "How We Use Information",
          body: [
            "We use your data to compute profitability analytics, generate AI recommendations, provide support, process payments, and improve the Service. We do not sell your personal or commerce data.",
          ],
        },
        {
          heading: "Data Security",
          body: [
            "Data is encrypted in transit and at rest. Each workspace is isolated using row-level security so your data is never visible to other customers. Access is limited to authorized personnel on a need-to-know basis.",
          ],
        },
        {
          heading: "Third-Party Processors",
          body: [
            "We rely on trusted sub-processors for authentication, database hosting, payments and AI inference. Each is bound by data-protection obligations consistent with this policy.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You can access, export, correct or delete your data at any time from Settings, or by contacting privacy@marginmind.io. We retain data only as long as needed to provide the Service or as required by law.",
          ],
        },
      ]}
    />
  );
}
