import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 18, 2026"
      sections={[
        {
          heading: "Agreement to Terms",
          body: [
            "By accessing or using MarginMind (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.",
            "These Terms apply to all visitors, users, and others who access the Service, including merchants, team members and agencies acting on behalf of a brand.",
          ],
        },
        {
          heading: "Accounts & Subscriptions",
          body: [
            "You must provide accurate information when creating an account and are responsible for safeguarding your credentials. Paid plans are billed in advance on a recurring monthly basis through our payment processor.",
            "Your first profit analysis is free, with no payment required. Paid plans are billed immediately when you subscribe. You may cancel at any time; cancellation takes effect at the end of the current billing period and does not entitle you to a prorated refund except where required by law.",
          ],
        },
        {
          heading: "Acceptable Use",
          body: [
            "You agree not to misuse the Service, including by attempting to access data that is not yours, reverse-engineering the platform, or uploading unlawful content. You retain ownership of the data you upload.",
          ],
        },
        {
          heading: "Data & Analytics",
          body: [
            "MarginMind computes profitability estimates from the data you provide or connect. Recommendations and figures are decision-support tools and not financial, tax, or legal advice. You are responsible for verifying outputs before acting on them.",
          ],
        },
        {
          heading: "Limitation of Liability",
          body: [
            "To the maximum extent permitted by law, MarginMind shall not be liable for any indirect, incidental, or consequential damages, or any loss of profits or revenues, arising from your use of the Service.",
          ],
        },
        {
          heading: "Changes to These Terms",
          body: [
            "We may update these Terms from time to time. Material changes will be communicated via the Service or email. Continued use after changes constitutes acceptance.",
          ],
        },
      ]}
    />
  );
}
