import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Icon from "./Icon";
import { icons as ICONS } from "../icons.generated";

const iconNames = Object.keys(ICONS).sort();
const defaultIcon = iconNames.includes("chevron-right")
  ? "chevron-right"
  : iconNames[0];

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "select", options: iconNames },
    variant: { control: { type: "inline-radio" }, options: ["outline", "solid"] },
    size: { control: "text", description: "Number (px) or string (e.g. '1em')" },
    color: { control: "color" },
    title: { control: "text" },
    "aria-label": { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Versatile Icon component rendering from a map, inline paths, or raw SVG. Defaults to the auto-generated icons map (src/icons.generated.ts).",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  name: "Basic (outline)",
  args: {
    name: defaultIcon,
    variant: "outline",
    size: 24,
    color: "#334155",
  },
};

export const Solid: Story = {
  args: {
    ...(Basic.args as any),
    variant: "solid",
  },
};

export const Sizes: Story = {
  args: {
    name: defaultIcon,
    variant: "outline",
    color: "#334155",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Icon {...args} size={16} />
      <Icon {...args} size={24} />
      <Icon {...args} size={32} />
      <Icon {...args} size={"2em"} />
    </div>
  ),
};

export const Colors: Story = {
  args: {
    name: defaultIcon,
    variant: "solid",
    size: 24,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: 16 }}>
      <Icon {...args} color="#0ea5e9" />
      <Icon {...args} color="#16a34a" />
      <Icon {...args} color="#f59e0b" />
      <Icon {...args} color="#ef4444" />
    </div>
  ),
};

// Stroke width control removed: outline thickness is baked in exported icons.

export const WithTitle: Story = {
  args: {
    name: defaultIcon,
    title: "Descriptive title for tooltip",
    variant: "outline",
    size: 28,
  },
};

export const WithAriaLabel: Story = {
  args: {
    name: defaultIcon,
    variant: "solid",
    size: 28,
    color: "#111827",
    "aria-label": "Notifications",
  },
};

// Icons gallery moved to its own story file (src/stories/IconsGallery.stories.tsx)
