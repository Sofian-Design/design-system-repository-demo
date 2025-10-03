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
    name: {
      control: "select",
      options: iconNames,
      description: "Icon identifier from the generated map (src/icons.generated.ts).",
      table: { category: "Identity" },
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["outline", "solid"],
      description: "Choose the icon style. Outline and Solid are separate assets.",
      table: { category: "Identity" },
    },
    size: {
      control: "text",
      description: "Number in px (e.g. 24) or any CSS size (e.g. '1em'). Defaults to '1em'.",
      table: { category: "Sizing" },
    },
    color: {
      control: "color",
      description: "Applies to fill via currentColor. You can also set it with CSS on a parent.",
      table: { category: "Color" },
    },
    title: {
      control: "text",
      description: "Optional tooltip text (native 'title' attribute). Not a replacement for aria-label.",
      table: { category: "Accessibility" },
    },
    "aria-label": {
      control: "text",
      description: "Accessible name announced by screen readers; switches role to 'img' and unsets aria-hidden.",
      table: { category: "Accessibility" },
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Zt40QOhEylVnVmHOfrbex8/Figma-Icons-Exporter--Demo-File-?node-id=0-1&t=LCoE4lsUxsvxZNg7-1",
    },
    docs: {
      description: {
        component:
          "Renders icons by name and style from the generated map. Props are grouped below: Identity (name, variant), Sizing (size), Color (color), Accessibility (title, aria-label).",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  name: "Outline",
  args: {
    name: defaultIcon,
    variant: "outline",
    size: 24,
    color: "#334155",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outline variant with a fixed size (24px) and a custom color. Use this as the starting point for most icons.",
      },
    },
  },
};

export const Solid: Story = {
  args: {
    ...(Basic.args as any),
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Solid style uses filled shapes only. It shares the same API as the outline variant.",
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates sizing with numeric pixels and relative CSS (em). The default size is '1em', which scales with text.",
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          "Icons inherit 'currentColor'. Set the 'color' prop directly or style a wrapper with CSS 'color'.",
      },
    },
  },
};

// Stroke width control removed: outline thickness is baked in exported icons.

export const WithTitle: Story = {
  args: {
    name: defaultIcon,
    title: "Descriptive title for tooltip",
    variant: "outline",
    size: 28,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Adds a native browser tooltip via the 'title' attribute. For accessibility, prefer 'aria-label' to convey meaning.",
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          "Sets an accessible name that screen readers announce and toggles role to 'img'. Use concise, meaningful labels.",
      },
    },
  },
};
