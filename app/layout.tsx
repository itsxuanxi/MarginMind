import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { features } from "@/lib/config";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MarginMind — AI Profit Intelligence for Ecommerce",
    template: "%s · MarginMind",
  },
  description:
    "Revenue is visible. Profit is hidden. MarginMind helps ecommerce brands uncover hidden profit leaks, track true profitability by SKU, channel and market, and make smarter decisions in real time.",
  keywords: [
    "ecommerce profit",
    "profit intelligence",
    "margin analytics",
    "Shopify profit",
    "Amazon profit",
    "SKU profitability",
    "profit leak detection",
  ],
  authors: [{ name: "MarginMind" }],
  openGraph: {
    title: "MarginMind — AI Profit Intelligence for Ecommerce",
    description:
      "Revenue is visible. Profit is hidden. Track true profitability across every product, market and channel — and find profit leaks before they hurt the business.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );

  // Only mount Clerk when real keys are present; otherwise the app
  // runs in self-contained demo mode without throwing.
  if (features.clerk) {
    return (
      <ClerkProvider
        appearance={{
          variables: {
            colorPrimary: "#0f9d6e",
            borderRadius: "0.6rem",
          },
        }}
      >
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
