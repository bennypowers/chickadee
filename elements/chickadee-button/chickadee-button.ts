import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './chickadee-button.css' with { type: 'css' };

/**
 * A button for triggering actions on the page or in the background. Provides
 * primary, secondary, tertiary, and plain variants for visual hierarchy. The
 * `danger` attribute SHOULD be used when the action is destructive or
 * irreversible. Authors MUST ensure button text clearly describes the action.
 *
 * Form-associated: supports `type`, `name`, and `value` attributes for
 * native form submission and reset. Uses ElementInternals for ARIA and form
 * state management.
 *
 * Keyboard interaction: activates on Enter or Space. Focus delegates to the
 * internal button element via `delegatesFocus`. Screen readers announce the
 * slotted text content as the accessible name, or the `label` attribute if
 * provided.
 *
 * @summary Triggers actions on the page or in the background.
 *
 * @fires {MouseEvent} click - Fired when the button is clicked. Native MouseEvent with no custom detail; use `event.target` to identify the originating button.
 */
@customElement('chickadee-button')
export class ChickadeeButton extends LitElement {
  static styles = [styles];

  static formAssociated = true;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * The visual variant of the button.
   * - primary: filled background, high emphasis
   * - secondary: outlined, medium emphasis
   * - tertiary: subtle border, low emphasis
   * - plain: text only, minimal emphasis (no background or border)
   */
  @property({ reflect: true }) variant: 'primary' | 'secondary' | 'tertiary' | 'plain' = 'primary';

  /** Whether the button represents a dangerous or destructive action. */
  @property({ type: Boolean, reflect: true }) danger = false;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether to render a compact (smaller) button. */
  @property({ type: Boolean, reflect: true }) compact = false;

  /**
   * Button type for form association.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type
   */
  @property({ reflect: true }) type?: 'button' | 'submit' | 'reset';

  /** Form name for the button. */
  @property() name?: string;

  /** Form value for the button. */
  @property() value?: string;

  /** Accessible label for the button, use when the button has no visible text. */
  @property() label?: string;

  /** Shorthand for the icon slot. When set, renders a chickadee-icon element. */
  @property() icon?: string;

  #internals = this.attachInternals();

  override willUpdate() {
    if (this.icon) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    const ariaDisabled = String(!!this.disabled) as 'true' | 'false';
    return html`
      <!-- The inner button element -->
      <button part="button"
              ?disabled=${this.disabled}
              aria-disabled=${ariaDisabled}
              aria-label=${ifDefined(this.label)}
              type=${ifDefined(this.type)}
              name=${ifDefined(this.name)}
              value=${ifDefined(this.value)}>
        <!-- Optional icon content, placed before the label. SHOULD be a decorative SVG or icon element; the default slot provides the accessible name. -->
        <slot name="icon">${this.icon ? html`
          <chickadee-icon icon=${this.icon}></chickadee-icon>` : ''}</slot>
        <!-- Button label text content. MUST contain descriptive text for screen readers. -->
        <slot></slot>
      </button>
    `;
  }

  #onClick() {
    switch (this.type) {
      case 'reset':
        return this.#internals.setFormValue(null);
      case 'submit':
        return this.#internals.form?.requestSubmit();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-button': ChickadeeButton;
  }
}
