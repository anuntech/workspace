import { Apple, House, Rocket, Turtle } from "lucide-react";

export const workspaceIcons = {
  apple: <Apple className="size-5" />,
  turtle: <Turtle className="size-5" />,
  rocket: <Rocket className="size-5" />,
  house: <House className="size-5" />,
};

type ValueType = "apple" | "turtle" | "rocket" | "house";

export const getWorkspaceIcon = (icon: ValueType) => {
  return workspaceIcons[icon];
};
