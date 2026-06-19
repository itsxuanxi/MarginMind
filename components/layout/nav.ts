import {
  LayoutDashboard,
  Table2,
  TrendingDown,
  Sparkles,
  Upload,
  Plug,
  CreditCard,
  Settings,
  LifeBuoy,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  adminOnly?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Intelligence",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "SKU Analysis", href: "/sku-analysis", icon: Table2 },
      { label: "Profit Leaks", href: "/profit-leaks", icon: TrendingDown },
      { label: "AI Profit Agent", href: "/ai-agent", icon: Sparkles, badge: "AI" },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "Upload Data", href: "/upload", icon: Upload },
      { label: "Integrations", href: "/integrations", icon: Plug },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help Center", href: "/help", icon: LifeBuoy },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Founder Analytics", href: "/admin", icon: BarChart3, adminOnly: true },
    ],
  },
];

export const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Your profit at a glance" },
  "/sku-analysis": { title: "SKU Analysis", subtitle: "Per-product profitability" },
  "/profit-leaks": { title: "Profit Leaks", subtitle: "Where you're losing money" },
  "/ai-agent": { title: "AI Profit Agent", subtitle: "Recommendations & chat" },
  "/upload": { title: "Upload Data", subtitle: "Import your store data" },
  "/integrations": { title: "Integrations", subtitle: "Connect your stack" },
  "/billing": { title: "Billing", subtitle: "Plan & invoices" },
  "/settings": { title: "Settings", subtitle: "Workspace preferences" },
  "/profile": { title: "Profile", subtitle: "Your account" },
  "/help": { title: "Help Center", subtitle: "Guides & support" },
  "/admin": { title: "Founder Analytics", subtitle: "Business metrics" },
};
