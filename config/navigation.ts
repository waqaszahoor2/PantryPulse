import {
  Bell,
  ChartNoAxesColumnIncreasing,
  CirclePlus,
  Gauge,
  HelpCircle,
  Lightbulb,
  PackageSearch,
  Settings,
  ShoppingBasket,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon?: any;
  badgeKey?: string;
  isExternal?: boolean;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: "/#hero", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How It Works" },
  { href: "/demo", label: "Interactive Demo" },
  { href: "/food-safety", label: "Food Safety" },
  { href: "/support", label: "Support" },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/pantry", label: "My Pantry", icon: PackageSearch },
  { href: "/add-item", label: "Add Grocery", icon: CirclePlus },
  { href: "/shopping-list", label: "Shopping List", icon: ShoppingBasket },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/insights", label: "Insights", icon: ChartNoAxesColumnIncreasing },
  { href: "/notifications", label: "Notifications", icon: Bell, badgeKey: "notifications" },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/support", label: "Support", icon: HelpCircle },
];

export const DEMO_NAV_ITEMS: NavItem[] = [
  { href: "dashboard", label: "Dashboard", icon: Gauge },
  { href: "pantry", label: "Pantry", icon: PackageSearch },
  { href: "recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "insights", label: "Insights", icon: ChartNoAxesColumnIncreasing },
];
