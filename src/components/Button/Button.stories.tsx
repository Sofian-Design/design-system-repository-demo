import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@components/Button";
import { Icon } from "@components/Icon";

const SEMANTIC_TONES = ["Success", "Warning", "Error"] as const;
type SemanticTone = (typeof SEMANTIC_TONES)[number];

const createPrimarySemanticStyles = (tone: SemanticTone): React.CSSProperties =>
  ({
    "--fivra-button-surface": `var(--backgroundPrimary${tone})`,
    "--fivra-button-accent": `var(--backgroundPrimary${tone})`,
    "--fivra-button-border": `var(--borderPrimary${tone})`,
    "--fivra-button-text": "var(--backgroundNeutral0)",
    "--fivra-button-hover-fallback": `var(--backgroundPrimary${tone})`,
    "--fivra-button-active-fallback": `var(--backgroundPrimary${tone})`,
  }) as React.CSSProperties;

const createSecondarySemanticStyles = (tone: SemanticTone): React.CSSProperties =>
  ({
    "--fivra-button-accent": `var(--textPrimary${tone})`,
    "--fivra-button-border": `var(--borderPrimary${tone})`,
    "--fivra-button-text": `var(--textPrimary${tone})`,
    "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
    "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
  }) as React.CSSProperties;

const createTertiarySemanticStyles = (tone: SemanticTone): React.CSSProperties =>
  ({
    "--fivra-button-accent": `var(--textPrimary${tone})`,
    "--fivra-button-text": `var(--textPrimary${tone})`,
    "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
    "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
  }) as React.CSSProperties;

const meta: Meta<typeof Button> = {
  title: "Components/Button/React",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "primary",
  },
  argTypes: {
    onClick: { action: "clicked" },
    leadingIcon: {
      control: false,
      description: "Optional icon rendered before the label.",
    },
    trailingIcon: {
      control: false,
      description: "Optional icon rendered after the label.",
    },
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"],
      description:
        "Visual treatment of the button mapped to `--backgroundPrimaryInteractive`, `--backgroundNeutral0`, and transparent tiers.",
      table: { category: "Appearance" },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Sizing scale for padding and typography.",
      table: { category: "Sizing" },
    },
    fullWidth: {
      control: "boolean",
      description: "Stretches the button to fill its container width.",
      table: { category: "Layout" },
    },
    iconOnly: {
      control: "boolean",
      description: "Removes the visible label and switches to `--radiusMax`. Provide `aria-label` for accessibility.",
      table: { category: "Appearance" },
    },
    hasLabel: {
      control: "boolean",
      description: "Override automatic label detection when rendering screen-reader-only copy.",
      table: { category: "Accessibility" },
    },
    dropdown: {
      control: "boolean",
      description: "Appends a disclosure caret for menu triggers.",
      table: { category: "Appearance" },
    },
    loading: {
      control: "boolean",
      description: "Displays a spinner with `aria-busy` set on the underlying `<button>`.",
      table: { category: "State" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Accessible button primitive with primary, secondary, and tertiary variants mapped directly to the spec token palette. Supports icons, dropdown affordances, loading states, and forwards native button attributes.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary buttons emphasize the main action using '--backgroundPrimaryInteractive'. The default mixes keep brand overlays weighting the state layer and surface through `--fivra-button-hover-color`, `--fivra-button-active-color`, and `--fivra-button-focus-ring-color`.",
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary buttons pair `--backgroundNeutral0` with `--borderPrimaryInteractive` and now reweight their hover, active, and focus mixes so the accent receives the intensity percentage. The result keeps outline tiers neutral by default while adopting semantic hues when `--fivra-button-accent` is overridden.",
      },
    },
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary",
    variant: "tertiary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tertiary buttons stay transparent until interaction and mirror the secondary overlay logic so `--fivra-button-hover-color` and friends tint directly toward the accent color.",
      },
    },
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "calc(var(--spacingL) * 1px)",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="tertiary" disabled>
        Tertiary
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled states pull from `--backgroundPrimaryDisabled`, `--backgroundSecondaryDisabled`, and `--textPrimaryDisabled` ensuring consistent contrast and borders via `--borderPrimaryDisabled`.",
      },
    },
  },
};

export const SemanticOverrides: Story = {
  name: "Semantic Overrides",
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "calc(var(--spacingM) * 1px)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "calc(var(--spacingL) * 1px)",
          flexWrap: "wrap",
        }}
      >
        {SEMANTIC_TONES.map((tone) => (
          <Button
            key={`primary-${tone}`}
            variant="primary"
            style={createPrimarySemanticStyles(tone)}
          >
            {tone} Primary
          </Button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: "calc(var(--spacingL) * 1px)",
          flexWrap: "wrap",
        }}
      >
        {SEMANTIC_TONES.map((tone) => (
          <Button
            key={`secondary-${tone}`}
            variant="secondary"
            style={createSecondarySemanticStyles(tone)}
          >
            {tone} Secondary
          </Button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: "calc(var(--spacingL) * 1px)",
          flexWrap: "wrap",
        }}
      >
        {SEMANTIC_TONES.map((tone) => (
          <Button
            key={`tertiary-${tone}`}
            variant="tertiary"
            style={createTertiarySemanticStyles(tone)}
          >
            {tone} Tertiary
          </Button>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Setting the `--fivra-button-accent` custom property enables success, warning, and error palettes while the new per-variant color-mix state layers adapt automatically. Fallback variables keep neutral overlays for browsers without color-mix support.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    children: "Download",
    leadingIcon: <Icon name="chevron-right" variant="solid" aria-hidden="true" />,
    trailingIcon: <Icon name="chevron-right" variant="outline" aria-hidden="true" />,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates leading and trailing icon slots using the shared Icon component.",
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    children: "Responsive",
    variant: "primary",
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "calc(var(--spacingL) * 1px)",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Small, medium, and large presets use explicit padding (12×4, 16×8, 24×12) with heights 24/32/40px and radii mapped to `--radiusXs`, `--radiusS`, and `--radiusM`.",
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    children: "Continue",
    fullWidth: true,
    variant: "primary",
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Button {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Full-width mode is useful for responsive layouts or stacked mobile actions.",
      },
    },
  },
};

export const Dropdown: Story = {
  args: {
    children: "Menu",
    dropdown: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown mode adds a built-in caret to communicate nested actions while still supporting manual icon slots if needed.",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    children: "Saving...",
    loading: true,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Setting `loading` renders the centered spinner, sets `aria-busy`, and works alongside `disabled` to block duplicate submissions.",
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    'aria-label': 'Next',
    leadingIcon: <Icon name="chevron-right" variant="outline" aria-hidden="true" />,
  },
  render: (args) => <Button {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only buttons collapse to a circular hit area via `--radiusMax`. Remember to supply an accessible `aria-label`.",
      },
    },
  },
};

const WebComponentPreview: React.FC = () => {
  React.useEffect(() => {
    defineFivraButton();
  }, []);

  return (
    <fivra-button variant="secondary" size="md" dropdown>
      <span slot="leading-icon" aria-hidden="true">
        ★
      </span>
      Web component
    </fivra-button>
  );
};

export const WebComponent: Story = {
  name: "Web Component",
  render: () => <WebComponentPreview />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Custom element preview. Call `defineFivraButton()` before first render to register `<fivra-button>`.",
      },
    },
  },
};

declare global {
  // Allow JSX usage of the custom element in stories without tsconfig tweaks.
  namespace JSX {
    interface IntrinsicElements {
      'fivra-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'full-width'?: boolean;
        variant?: string;
        size?: string;
        type?: string;
      };
    }
  }
}
