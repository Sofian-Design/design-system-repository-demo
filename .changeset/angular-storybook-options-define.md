---
"design-system-icons": patch
---

Ensure Angular Storybook injects STORYBOOK_ANGULAR_OPTIONS through Vite define so runtime builds always receive framework options, load Zone.js before Angular bootstraps, and import the shared stylesheet so stories render with design system theming.
