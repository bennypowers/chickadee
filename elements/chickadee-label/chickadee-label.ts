import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-label.css' with { type: 'css' };

/**
 * A label for categorizing, tagging, or marking status. Provides filled and
 * outlined variants with a range of semantic colors. The `closable` attribute
 * adds a dismiss button that fires a `close` event. Authors SHOULD choose a
 * `color` that conveys the label's semantic meaning. Authors MUST ensure
 * label text is concise. The close button is keyboard-focusable and activates
 * on Enter or Space. Screen readers announce the close button via its
 * `aria-label`.
 *
 * @summary Categorizes or marks status with color-coded labels.
 *
 * @fires {Event} close - Fired when the close button is clicked. Native Event with no custom detail. Bubbles.
 *
 * @csspart container - The outer span wrapping label content, icon, and close button.
 * @csspart close - The dismiss button rendered when `closable` is true.
 *
 */
@customElement('chickadee-label')
export class ChickadeeLabel extends LitElement {
  static styles = [styles];

  /** The visual variant of the label. */
  @property({ reflect: true }) variant: 'filled' | 'outlined' = 'filled';

  /** The color of the label. */
  @property({ reflect: true }) color: 'gray' | 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'teal' = 'gray';

  /** Shorthand for the icon slot. When set, renders a chickadee-icon element. */
  @property() icon?: string;

  /** Whether to show a close button. */
  @property({ type: Boolean, reflect: true }) closable = false;

  /** Whether to render a compact (smaller) label. */
  @property({ type: Boolean, reflect: true }) compact = false;

  /** Whether the label is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override willUpdate() {
    if (this.icon || this.closable) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    return html`
      <span part="container">
        <!-- Optional icon content, placed before the label text. SHOULD be a decorative SVG or icon element. Slotted icons SHOULD have aria-hidden="true" if purely decorative. -->
        <slot name="icon">${this.icon ? html`
          <chickadee-icon icon=${this.icon}></chickadee-icon>` : nothing}</slot>
        <!-- Label text content. SHOULD be short, descriptive text. Screen readers announce this content directly. -->
        <slot></slot>
        ${this.closable ? html`
          <button part="close"
                  aria-label="Remove"
                  @click="${this.#onClose}"
                  ?disabled="${this.disabled}">
            <chickadee-icon icon="close"></chickadee-icon>
          </button>` : nothing}
      </span>
    `;
  }

  #onClose() {
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-label': ChickadeeLabel;
  }
}
