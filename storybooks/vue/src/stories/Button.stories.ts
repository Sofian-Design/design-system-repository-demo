import type { PropType } from "vue";
import { computed, defineComponent, h } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import {
  BUTTON_CARET_CLASS,
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from "@components/Button/button.styles";

ensureButtonStyles();

type SemanticTone = "Success" | "Warning" | "Error";

type VueButtonStoryArgs = {
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
  leadingIcon?: unknown;
  trailingIcon?: unknown;
  onClick?: (event: MouseEvent) => void;
};

const createTertiarySemanticStyles = (tone: SemanticTone): Record<string, string> => ({
  "--fivra-button-accent": `var(--textPrimary${tone})`,
  "--fivra-button-text": `var(--textPrimary${tone})`,
  "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
});

const FivraButtonPreview = defineComponent({
  name: "FivraButtonPreview",
  props: {
    children: { type: String, default: "Button" },
    variant: {
      type: String as PropType<ButtonVariant>,
      default: "primary",
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: "md",
    },
    fullWidth: { type: Boolean, default: false },
    iconOnly: { type: Boolean, default: false },
    hasLabel: { type: Boolean as PropType<boolean | null>, default: null },
    dropdown: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: {
      type: String as PropType<"button" | "submit" | "reset">,
      default: "button",
    },
    style: {
      type: Object as PropType<Record<string, string> | null>,
      default: null,
    },
    ariaLabel: { type: String as PropType<string | null>, default: null },
    ariaLabelledby: { type: String as PropType<string | null>, default: null },
    leadingIcon: { type: null as unknown as PropType<unknown>, default: undefined },
    trailingIcon: { type: null as unknown as PropType<unknown>, default: undefined },
    onClick: { type: Function as PropType<((event: MouseEvent) => void) | undefined> },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const resolvedHasLabel = computed(() => {
      if (props.hasLabel !== null && props.hasLabel !== undefined) {
        return props.hasLabel;
      }

      if (props.iconOnly) {
        return false;
      }

      return Boolean(props.children?.trim?.());
    });

    const handleClick = (event: MouseEvent) => {
      if (props.disabled || props.loading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      emit("click", event);
      props.onClick?.(event);
    };

    return () =>
      h(
        "button",
        {
          class: BUTTON_CLASS_NAME,
          type: props.type,
          disabled: props.disabled || props.loading,
          "data-variant": props.variant ?? "primary",
          "data-size": props.size ?? "md",
          "data-full-width": props.fullWidth ? "true" : "false",
          "data-icon-only": props.iconOnly ? "true" : "false",
          "data-has-label": resolvedHasLabel.value ? "true" : "false",
          style: props.style ?? undefined,
          "aria-label": props.ariaLabel ?? undefined,
          "aria-labelledby": props.ariaLabelledby ?? undefined,
          onClick: handleClick,
        },
        [
          props.loading
            ? h("span", {
                class: BUTTON_SPINNER_CLASS,
                "aria-hidden": "true",
              })
            : null,
          props.leadingIcon
            ? h(
                "span",
                {
                  class: `${BUTTON_ICON_CLASS} ${BUTTON_LEADING_ICON_CLASS}`,
                  "aria-hidden": "true",
                },
                typeof props.leadingIcon === "string" ? props.leadingIcon : "★",
              )
            : null,
          resolvedHasLabel.value
            ? h(
                "span",
                { class: BUTTON_LABEL_CLASS },
                props.children ?? "",
              )
            : null,
          props.trailingIcon
            ? h(
                "span",
                {
                  class: `${BUTTON_ICON_CLASS} ${BUTTON_TRAILING_ICON_CLASS}`,
                  "aria-hidden": "true",
                },
                typeof props.trailingIcon === "string" ? props.trailingIcon : "★",
              )
            : null,
          props.dropdown
            ? h(
                "span",
                {
                  class: BUTTON_CARET_CLASS,
                  "aria-hidden": "true",
                },
                "▾",
              )
            : null,
        ],
      );
  },
});

const meta: Meta<VueButtonStoryArgs> = {
  title: "Components/Button/Vue",
  component: FivraButtonPreview,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "primary",
  },
  argTypes: {
    onClick: { action: "clicked" },
    leadingIcon: {
      control: false,
      description: "Optional icon rendered before the label. Placeholder uses a star until the Vue component ships.",
    },
    trailingIcon: {
      control: false,
      description: "Optional icon rendered after the label. Placeholder uses a star until the Vue component ships.",
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
          "Vue 3 placeholder preview of the Fivra button. It injects shared CSS via `ensureButtonStyles()` while the native Vue implementation is under development.",
      },
    },
  },
  render: (args) => ({
    components: { FivraButtonPreview },
    setup() {
      return { args };
    },
    template: `
      <FivraButtonPreview
        v-bind="args"
        :aria-label="args.ariaLabel ?? undefined"
        :aria-labelledby="args.ariaLabelledby ?? undefined"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<VueButtonStoryArgs>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary buttons emphasize the main action using '--backgroundPrimaryInteractive'. Placeholder stories mirror the React/Angular controls until the Vue package lands.",
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
          "Secondary buttons pair `--backgroundNeutral0` with `--borderPrimaryInteractive`. Override CSS custom properties to preview semantic palettes.",
      },
    },
  },
};

export const TertiarySemantic: Story = {
  name: "Tertiary (Semantic)",
  args: {
    children: "Warning",
    variant: "tertiary",
    style: createTertiarySemanticStyles("Warning"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Semantic overrides reuse the same custom properties as React/Angular. Update the Vue adapter to delegate to the production component once available.",
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { FivraButtonPreview },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <FivraButtonPreview v-bind="{ ...args, size: 'sm', children: 'Small' }" />
        <FivraButtonPreview v-bind="{ ...args, size: 'md', children: 'Medium' }" />
        <FivraButtonPreview v-bind="{ ...args, size: 'lg', children: 'Large' }" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Small, medium, and large presets share the same spacing tokens as the other frameworks. This scaffold renders three placeholder buttons until the Vue component arrives.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    children: "Download",
    leadingIcon: true,
    trailingIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Leading and trailing icon slots currently render placeholder stars. Replace them with the Vue Icon component when it becomes available.",
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
          "Loading state toggles the shared spinner styles and disables pointer events. The Vue binding will eventually connect to the production spinner implementation.",
      },
    },
  },
};

export const ImplementationStatus: Story = {
  name: "Implementation Status",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The Vue 3 adapter is in progress. These stories exist to validate shared styling, theming, and controls while the official component is being built.",
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 440px; line-height: 1.5;">
        <p><strong>Vue component coming soon.</strong></p>
        <p>
          The placeholder stories inject the same CSS used by React and Angular so design tokens, themes, and controls can be reviewed in Storybook today.
          Once the Vue component ships, replace <code>FivraButtonPreview</code> with the production implementation.
        </p>
      </div>
    `,
  }),
};
