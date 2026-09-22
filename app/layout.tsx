import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dhan Admin Console",
  description: "Internal admin console for Dhan",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
