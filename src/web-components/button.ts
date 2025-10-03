import {
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_CARET_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  buttonClassStyles,
  buttonHostStyles,
} from '@components/Button/button.styles';

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
type ButtonSize = (typeof BUTTON_SIZES)[number];

const template = document.createElement('template');

template.innerHTML = `
  <style>
    ${buttonHostStyles}
    ${buttonClassStyles}
  </style>
  <button
    class="${BUTTON_CLASS_NAME}"
    part="button"
    type="button"
    data-variant="${DEFAULT_BUTTON_VARIANT}"
    data-size="${DEFAULT_BUTTON_SIZE}"
    data-has-label="false"
  >
    <span class="${BUTTON_SPINNER_CLASS}" part="spinner" aria-hidden="true"></span>
    <span class="${BUTTON_ICON_CLASS} ${BUTTON_LEADING_ICON_CLASS}" part="leading-icon" data-empty="true" aria-hidden="true">
      <slot name="leading-icon"></slot>
    </span>
    <span class="${BUTTON_LABEL_CLASS}" part="label" data-empty="true">
      <slot></slot>
    </span>
    <span class="${BUTTON_ICON_CLASS} ${BUTTON_TRAILING_ICON_CLASS}" part="trailing-icon" data-empty="true" aria-hidden="true">
      <slot name="trailing-icon"></slot>
    </span>
    <span class="${BUTTON_CARET_CLASS}" part="caret" aria-hidden="true"></span>
  </button>
`;

export class FivraButtonElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      'variant',
      'size',
      'disabled',
      'full-width',
      'type',
      'icon-only',
      'dropdown',
      'loading',
      'has-label',
      'aria-label',
      'aria-labelledby',
    ];
  }

  private readonly buttonEl: HTMLButtonElement;
  private readonly leadingWrapper: HTMLElement;
  private readonly trailingWrapper: HTMLElement;
  private readonly labelWrapper: HTMLElement;
  private readonly leadingSlot: HTMLSlotElement;
  private readonly trailingSlot: HTMLSlotElement;
  private readonly labelSlot: HTMLSlotElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));

    this.buttonEl = root.querySelector('button') as HTMLButtonElement;
    this.leadingWrapper = root.querySelector('[part="leading-icon"]') as HTMLElement;
    this.trailingWrapper = root.querySelector('[part="trailing-icon"]') as HTMLElement;
    this.labelWrapper = root.querySelector('[part="label"]') as HTMLElement;
    this.leadingSlot = this.leadingWrapper.querySelector('slot') as HTMLSlotElement;
    this.trailingSlot = this.trailingWrapper.querySelector('slot') as HTMLSlotElement;
    this.labelSlot = this.labelWrapper.querySelector('slot') as HTMLSlotElement;
  }

  connectedCallback(): void {
    this.syncAll();
    this.leadingSlot.addEventListener('slotchange', this.syncSlots);
    this.trailingSlot.addEventListener('slotchange', this.syncSlots);
    this.labelSlot.addEventListener('slotchange', this.syncSlots);
  }

  disconnectedCallback(): void {
    this.leadingSlot.removeEventListener('slotchange', this.syncSlots);
    this.trailingSlot.removeEventListener('slotchange', this.syncSlots);
    this.labelSlot.removeEventListener('slotchange', this.syncSlots);
  }

  attributeChangedCallback(): void {
    this.syncAll();
  }

  focus(options?: FocusOptions): void {
    this.buttonEl.focus(options);
  }

  click(): void {
    this.buttonEl.click();
  }

  get variant(): ButtonVariant {
    return (this.buttonEl.dataset.variant as ButtonVariant) ?? DEFAULT_BUTTON_VARIANT;
  }

  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value);
  }

  get size(): ButtonSize {
    return (this.buttonEl.dataset.size as ButtonSize) ?? DEFAULT_BUTTON_SIZE;
  }

  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }

  get disabled(): boolean {
    return this.buttonEl.disabled;
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
    this.syncDisabled();
  }

  get fullWidth(): boolean {
    return this.hasAttribute('full-width');
  }

  set fullWidth(value: boolean) {
    this.toggleAttribute('full-width', value);
    this.syncFullWidth();
  }

  get type(): string {
    return this.buttonEl.type;
  }

  set type(value: string) {
    this.setAttribute('type', value);
  }

  get iconOnly(): boolean {
    return this.hasAttribute('icon-only');
  }

  set iconOnly(value: boolean) {
    this.toggleAttribute('icon-only', value);
    this.syncIconOnly();
    this.syncHasLabel();
  }

  get dropdown(): boolean {
    return this.hasAttribute('dropdown');
  }

  set dropdown(value: boolean) {
    this.toggleAttribute('dropdown', value);
    this.syncDropdown();
  }

  get loading(): boolean {
    return this.hasAttribute('loading');
  }

  set loading(value: boolean) {
    this.toggleAttribute('loading', value);
    this.syncLoading();
  }

  get hasLabel(): boolean {
    const attr = this.getAttribute('has-label');
    if (attr !== null) {
      return attr !== 'false';
    }

    return !this.iconOnly && this.hasLabelSlotContent();
  }

  set hasLabel(value: boolean) {
    this.setAttribute('has-label', value ? 'true' : 'false');
    this.syncHasLabel();
  }

  private syncAll = (): void => {
    this.syncVariant();
    this.syncSize();
    this.syncDisabled();
    this.syncFullWidth();
    this.syncType();
    this.syncSlots();
    this.syncIconOnly();
    this.syncDropdown();
    this.syncLoading();
    this.syncHasLabel();
    this.syncAriaAttributes();
  };

  private syncVariant(): void {
    const variantAttr = this.getAttribute('variant');
    const variant: ButtonVariant = variantAttr && BUTTON_VARIANTS.includes(variantAttr as ButtonVariant)
      ? (variantAttr as ButtonVariant)
      : DEFAULT_BUTTON_VARIANT;

    this.buttonEl.dataset.variant = variant;
  }

  private syncSize(): void {
    const sizeAttr = this.getAttribute('size');
    const size: ButtonSize = sizeAttr && BUTTON_SIZES.includes(sizeAttr as ButtonSize)
      ? (sizeAttr as ButtonSize)
      : DEFAULT_BUTTON_SIZE;

    this.buttonEl.dataset.size = size;
  }

  private syncDisabled(): void {
    const isDisabled = this.hasAttribute('disabled');
    this.buttonEl.disabled = isDisabled;
    if (isDisabled) {
      this.buttonEl.setAttribute('aria-disabled', 'true');
    } else {
      this.buttonEl.removeAttribute('aria-disabled');
    }
  }

  private syncFullWidth(): void {
    const fullWidth = this.hasAttribute('full-width');
    this.toggleAttribute('full-width', fullWidth);
    if (fullWidth) {
      this.buttonEl.dataset.fullWidth = 'true';
    } else {
      delete this.buttonEl.dataset.fullWidth;
    }
  }

  private syncType(): void {
    const typeAttr = this.getAttribute('type');
    this.buttonEl.type = typeAttr === 'submit' || typeAttr === 'reset' ? typeAttr : 'button';
  }

  private syncSlots = (): void => {
    const hasLeading = this.updateWrapper(this.leadingSlot, this.leadingWrapper);
    const hasTrailing = this.updateWrapper(this.trailingSlot, this.trailingWrapper);
    const hasLabel = this.updateLabel();

    this.buttonEl.dataset.leadingIcon = hasLeading ? 'true' : 'false';
    this.buttonEl.dataset.trailingIcon = hasTrailing ? 'true' : 'false';
    this.buttonEl.dataset.slotLabel = hasLabel ? 'true' : 'false';
  };

  private syncIconOnly(): void {
    if (this.iconOnly) {
      this.buttonEl.dataset.iconOnly = 'true';
    } else {
      delete this.buttonEl.dataset.iconOnly;
    }
  }

  private syncDropdown(): void {
    if (this.dropdown) {
      this.buttonEl.dataset.dropdown = 'true';
    } else {
      delete this.buttonEl.dataset.dropdown;
    }
  }

  private syncLoading(): void {
    if (this.loading) {
      this.buttonEl.dataset.loading = 'true';
      this.buttonEl.setAttribute('aria-busy', 'true');
    } else {
      delete this.buttonEl.dataset.loading;
      this.buttonEl.removeAttribute('aria-busy');
    }
  }

  private syncHasLabel(): void {
    const attr = this.getAttribute('has-label');
    const iconOnly = this.buttonEl.dataset.iconOnly === 'true';
    let hasLabel: boolean;

    if (attr !== null) {
      hasLabel = attr !== 'false';
    } else {
      hasLabel = !iconOnly && this.buttonEl.dataset.slotLabel === 'true';
    }

    this.buttonEl.dataset.hasLabel = hasLabel ? 'true' : 'false';
  }

  private syncAriaAttributes(): void {
    const ariaLabel = this.getAttribute('aria-label');
    const ariaLabelledBy = this.getAttribute('aria-labelledby');

    if (ariaLabel !== null) {
      this.buttonEl.setAttribute('aria-label', ariaLabel);
    } else {
      this.buttonEl.removeAttribute('aria-label');
    }

    if (ariaLabelledBy !== null) {
      this.buttonEl.setAttribute('aria-labelledby', ariaLabelledBy);
    } else {
      this.buttonEl.removeAttribute('aria-labelledby');
    }
  }

  private updateWrapper(slot: HTMLSlotElement, wrapper: HTMLElement): boolean {
    const hasContent = this.hasAssignedNodes(slot);
    wrapper.dataset.empty = hasContent ? 'false' : 'true';
    return hasContent;
  }

  private updateLabel(): boolean {
    const hasContent = this.hasLabelSlotContent();
    this.labelWrapper.dataset.empty = hasContent ? 'false' : 'true';
    return hasContent;
  }

  private hasAssignedNodes(slot: HTMLSlotElement): boolean {
    return slot
      .assignedNodes()
      .some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0);
  }

  private hasLabelSlotContent(): boolean {
    return this.hasAssignedNodes(this.labelSlot);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fivra-button': FivraButtonElement;
  }
}

export function defineFivraButton(): void {
  if (typeof window === 'undefined' || window.customElements.get('fivra-button')) {
    return;
  }

  window.customElements.define('fivra-button', FivraButtonElement);
}
