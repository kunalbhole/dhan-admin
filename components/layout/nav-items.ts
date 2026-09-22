import type { Icon } from "@phosphor-icons/react";
import {
  GearSix,
  IdentificationCard,
  Megaphone,
  ShieldCheck,
  ShieldWarning,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react";

export type NavItem = {
  label: string;
  href: string;
  icon: Icon;
  disabled?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: SquaresFour },
  { label: "Customers", href: "/customers", icon: UsersThree },
  { label: "KYC", href: "/kyc", icon: IdentificationCard, disabled: true },
  { label: "Risk & Security", href: "/risk-security", icon: ShieldWarning },
  { label: "Offers", href: "/offers", icon: Megaphone },
  { label: "Admins", href: "/admins", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: GearSix },
];
