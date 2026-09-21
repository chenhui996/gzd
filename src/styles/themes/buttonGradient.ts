import type { ThemeConfig } from "antd/es/config-provider/context";
import type { CSSProperties } from "react";

export const goldDarkButtonGradientClassName = "gz-button-gold-dark-gradient";

type CSSVariableProperties = CSSProperties &
  Record<`--${string}`, string | number | undefined>;

type ButtonGradientTokens = {
  primaryGradientStart?: string;
  primaryGradientEnd?: string;
  primaryGradientStartHover?: string;
  primaryGradientEndHover?: string;
  primaryGradientStartActive?: string;
  primaryGradientEndActive?: string;
  primaryText?: string;
  primaryTextHover?: string;
  primaryTextActive?: string;
};

const buttonGradientTokenKeys = [
  "primaryGradientStart",
  "primaryGradientEnd",
  "primaryGradientStartHover",
  "primaryGradientEndHover",
  "primaryGradientStartActive",
  "primaryGradientEndActive",
] as const;

export const isGoldDarkMode = (mode: string) => mode === "gold-dark";

export const getButtonGradientTokens = (
  themeConfig: ThemeConfig,
): ButtonGradientTokens => {
  const buttonTokens = themeConfig.components?.Button;

  if (!buttonTokens || typeof buttonTokens !== "object") {
    return {};
  }

  return buttonTokens as ButtonGradientTokens;
};

export const hasPrimarySolidGradientTokens = (tokens: ButtonGradientTokens) =>
  buttonGradientTokenKeys.every((key) => Boolean(tokens[key]));

export const getButtonGradientStyleVars = (
  tokens: ButtonGradientTokens,
): CSSVariableProperties => ({
  "--gz-button-primary-gradient-start": tokens.primaryGradientStart,
  "--gz-button-primary-gradient-end": tokens.primaryGradientEnd,
  "--gz-button-primary-gradient-start-hover": tokens.primaryGradientStartHover,
  "--gz-button-primary-gradient-end-hover": tokens.primaryGradientEndHover,
  "--gz-button-primary-gradient-start-active":
    tokens.primaryGradientStartActive,
  "--gz-button-primary-gradient-end-active": tokens.primaryGradientEndActive,
  "--gz-button-primary-gradient-text": tokens.primaryText,
  "--gz-button-primary-gradient-text-hover":
    tokens.primaryTextHover ?? tokens.primaryText,
  "--gz-button-primary-gradient-text-active":
    tokens.primaryTextActive ?? tokens.primaryText,
});
