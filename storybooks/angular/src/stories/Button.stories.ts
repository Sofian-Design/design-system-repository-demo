import { CommonModule } from "@angular/common";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { FivraButtonComponent, FivraButtonModule } from "@internal/angular/button";
import {
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from "@components/Button/button.styles";

ensureButtonStyles();

const SEMANTIC_TONES = ["Success", "Warning", "Error"] as const;
type SemanticTone = (typeof SEMANTIC_TONES)[number];

type ButtonStoryArgs = {
  children?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  hasLabel?: boolean | null;
  dropdown?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: Record<string, string> | null;
  ariaLabel?: string | null;
  ariaLabelledby?: string | null;
  "aria-label"?: string;
  leadingIcon?: unknown;
  trailingIcon?: unknown;
  onClick?: (event: MouseEvent) => void;
};

const createPrimarySemanticStyles = (tone: SemanticTone): Record<string, string> => ({
  "--fivra-button-surface": `var(--backgroundPrimary${tone})`,
  "--fivra-button-accent": `var(--backgroundPrimary${tone})`,
  "--fivra-button-border": `var(--borderPrimary${tone})`,
  "--fivra-button-text": "var(--backgroundNeutral0)",
  "--fivra-button-hover-fallback": `var(--backgroundPrimary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundPrimary${tone})`,
});

const createSecondarySemanticStyles = (tone: SemanticTone): Record<string, string> => ({
  "--fivra-button-accent": `var(--textPrimary${tone})`,
  "--fivra-button-border": `var(--borderPrimary${tone})`,
  "--fivra-button-text": `var(--textPrimary${tone})`,
  "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
});

const createTertiarySemanticStyles = (tone: SemanticTone): Record<string, string> => ({
  "--fivra-button-accent": `var(--textPrimary${tone})`,
  "--fivra-button-text": `var(--textPrimary${tone})`,
  "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
});

const defaultRender = (args: ButtonStoryArgs) => {
  const { children, style, onClick, "aria-label": ariaLabelOverride, ...rest } = args;
  const ariaLabel = ariaLabelOverride ?? rest.ariaLabel ?? null;

  return {
    props: {
      ...rest,
      style: style ?? null,
      children,
      ariaLabel,
      onClick,
    },
    template: `
      <fivra-button
        [variant]="variant"
        [size]="size"
        [fullWidth]="fullWidth"
        [iconOnly]="iconOnly"
        [hasLabel]="hasLabel"
        [dropdown]="dropdown"
        [loading]="loading"
        [type]="type"
        [disabled]="disabled"
        [ngStyle]="style"
        [ariaLabel]="ariaLabel"
        [ariaLabelledby]="ariaLabelledby"
        (click)="onClick?.($event)"
      >
        <ng-container *ngIf="children">{{ children }}</ng-container>
      </fivra-button>
    `,
  };
};

const meta: Meta<ButtonStoryArgs> = {
  title: "Components/Button/Angular",
  component: FivraButtonComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FivraButtonModule],
    }),
  ],
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
  render: defaultRender,
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

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
  render: () => ({
    template: `
      <div
        style="
          display: flex;
          gap: calc(var(--spacingL) * 1px);
          align-items: center;
          flex-wrap: wrap;
        "
      >
        <fivra-button variant="primary" disabled>Primary</fivra-button>
        <fivra-button variant="secondary" disabled>Secondary</fivra-button>
        <fivra-button variant="tertiary" disabled>Tertiary</fivra-button>
      </div>
    `,
  }),
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
  render: () => ({
    props: {
      tones: SEMANTIC_TONES,
      createPrimarySemanticStyles,
      createSecondarySemanticStyles,
      createTertiarySemanticStyles,
    },
    template: `
      <div style="display: grid; gap: calc(var(--spacingM) * 1px);">
        <div
          style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;"
        >
          <fivra-button
            *ngFor="let tone of tones"
            variant="primary"
            [ngStyle]="createPrimarySemanticStyles(tone)"
          >
            {{ tone }} Primary
          </fivra-button>
        </div>
        <div
          style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;"
        >
          <fivra-button
            *ngFor="let tone of tones"
            variant="secondary"
            [ngStyle]="createSecondarySemanticStyles(tone)"
          >
            {{ tone }} Secondary
          </fivra-button>
        </div>
        <div
          style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;"
        >
          <fivra-button
            *ngFor="let tone of tones"
            variant="tertiary"
            [ngStyle]="createTertiarySemanticStyles(tone)"
          >
            {{ tone }} Tertiary
          </fivra-button>
        </div>
      </div>
    `,
  }),
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
  },
  render: (args) => {
    const { "aria-label": ariaLabelOverride, ariaLabel, ...rest } = args;
    const resolvedAriaLabel = ariaLabelOverride ?? ariaLabel ?? null;

    return {
      props: {
        ...rest,
        ariaLabel: resolvedAriaLabel,
      },
      template: `
        <ng-template #leadingIconTemplate>
          <span aria-hidden="true">⬇</span>
        </ng-template>
        <ng-template #trailingIconTemplate>
          <span aria-hidden="true">→</span>
        </ng-template>
        <fivra-button
          [variant]="variant"
          [size]="size"
          [fullWidth]="fullWidth"
          [iconOnly]="iconOnly"
          [dropdown]="dropdown"
          [loading]="loading"
          [type]="type"
          [disabled]="disabled"
          [ariaLabel]="ariaLabel"
          [ariaLabelledby]="ariaLabelledby"
          [leadingIcon]="leadingIconTemplate"
          [trailingIcon]="trailingIconTemplate"
        >
          {{ children }}
        </fivra-button>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates leading and trailing icon slots using Angular templates.",
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    children: "Responsive",
    variant: "primary",
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div
        style="
          display: flex;
          gap: calc(var(--spacingL) * 1px);
          align-items: center;
          flex-wrap: wrap;
        "
      >
        <fivra-button [variant]="variant" size="sm">Small</fivra-button>
        <fivra-button [variant]="variant" size="md">Medium</fivra-button>
        <fivra-button [variant]="variant" size="lg">Large</fivra-button>
      </div>
    `,
  }),
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
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div style="width: 320px;">
        <fivra-button
          [variant]="variant"
          [size]="size"
          [fullWidth]="fullWidth"
        >
          {{ children }}
        </fivra-button>
      </div>
    `,
  }),
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
    children: undefined,
    "aria-label": "Next",
  },
  render: (args) => ({
    props: {
      ...args,
      ariaLabel: args["aria-label"] ?? args.ariaLabel ?? null,
    },
    template: `
      <ng-template #leadingIconTemplate>
        <span aria-hidden="true">→</span>
      </ng-template>
      <fivra-button
        [iconOnly]="iconOnly"
        [ariaLabel]="ariaLabel"
        [leadingIcon]="leadingIconTemplate"
      ></fivra-button>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only buttons collapse to a circular hit area via `--radiusMax`. Remember to supply an accessible `aria-label`.",
      },
    },
  },
};
