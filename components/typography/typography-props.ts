import { colorScheme } from "@sera-components/theme-provider/theme/color-scheme";

export type TypeVariant = "light" | "link" | "muted" | undefined;

export interface TypographyProps {
  loading?: boolean;
  fontSize?: number;
  fontWeight?: number;
  variant?: TypeVariant;
}

export const getColor = (variant: TypeVariant) => {
  if (variant === "light") return colorScheme.TEXT.LIGHT;
  if (variant === "muted") return colorScheme.TEXT.BODY;
  if (variant === "link") return colorScheme.ACCENT.MAIN;
  return colorScheme.PRIMARY.MAIN;
};
