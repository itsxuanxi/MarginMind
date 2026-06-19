import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { features } from "@/lib/config";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MarginMind — AI Profit Agent for Cross-Border E-commerce",
    template: "%s · MarginMind",
  },
  description:
    "Know your real profit across every product, market, and channel. MarginMind tracks true margins, detects profit leaks, and recommends actions that improve profitability.",
  keywords: [
    "ecommerce profit",
    "margin analytics",
    "Shopify profit",
    "Amazon profit",
    "cross-border ecommerce",
    "profit leak detection",
  ],
  authors: [{ name: "MarginMind" }],
  openGraph: {
    title: "MarginMind — AI Profit Agent for Cross-Border E-commerce",
    description:
      "Track true margins, detect profit leaks, and let an AI agent recommend the actions that grow your bottom line.",
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
