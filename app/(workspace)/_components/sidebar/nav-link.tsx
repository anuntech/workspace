"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
}

export function NavLink({ children, href }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: pathname === href ? "secondary" : "ghost",
        }),
        "w-full px-3 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
        "justify-start"
      )}
    >
      {children}
    </Link>
  );
}
