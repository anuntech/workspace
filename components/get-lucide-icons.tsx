"use client";
import * as lucideIcons from "lucide-react";

export const IconComponent = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const Icon = Object.entries(lucideIcons)
    .slice(200, 600)
    .find((icon) => icon[0] === name)?.[1] as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

  return <Icon className={className} />;
};
