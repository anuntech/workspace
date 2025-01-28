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
		.filter(([iconName]) => !iconName.endsWith("Icon"))
		// .slice(200, 600)
		.find(([iconName]) => iconName === name)?.[1] as React.FC<
		React.SVGProps<SVGSVGElement>
	>;

	if (!Icon) {
		return null;
	}

	return <Icon className={className} />;
};
