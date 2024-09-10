import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import PlausibleProvider from "next-plausible";
import config from "@/config";
import ClientLayout from "@/components/LayoutClient";
import { getSEOTags } from "@/libs/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = getSEOTags({
  title: "Anuntech",
  description: "Generated by create next app",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={config.colors.theme}
      className={inter.className}
    >
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <body className={cn("font-medium antialiased", inter.className)}>
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>
          {children}
          <Toaster />
        </ClientLayout>
      </body>
    </html>
  );
}
