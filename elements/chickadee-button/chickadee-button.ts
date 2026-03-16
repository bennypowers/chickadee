import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-button.css' with { type: 'css' };

/**
 * A button element for triggering actions and navigation. Provides primary,
 * secondary, tertiary, and link variants for visual hierarchy. The `danger`
 * attribute SHOULD be used when the action is destructive or irreversible.
 * Authors MUST ensure button text clearly describes the action. When used
 * inside a form, the button SHOULD NOT submit by default — use a native
 * `<button type="submit">` instead.
 *
 * Keyboard interaction: activates on Enter or Space. Focus is managed via
 * the internal `<button>` element, which receives focus via Tab. Screen
 * readers announce the slotted text content as the accessible name.
 *
 * @summary Push button with multiple visual variants for actions and navigation.
 *
 * @fires {MouseEvent} click - Fired when the button is clicked. The event is a native MouseEvent with no custom detail; use `event.target` to identify the originating button.
 */
@customElement('chickadee-button')
export class ChickadeeButton extends LitElement {
  static styles = [styles];

  /** The visual variant of the button. */
  @property({ reflect: true }) variant: 'primary' | 'secondary' | 'tertiary' | 'link' = 'primary';

  /** Whether the button represents a dangerous or destructive action. */
  @property({ type: Boolean, reflect: true }) danger = false;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether to render a compact (smaller) button. */
  @property({ type: Boolean, reflect: true }) compact = false;

  render() {
    return html`
      <!-- The inner button element -->
      <button part="button"
              ?disabled=${this.disabled}
              aria-disabled=${this.disabled ? 'true' : 'false'}>
        <!-- Optional icon content, placed before the label. SHOULD be a decorative SVG or icon element; the default slot provides the accessible name. -->
        <slot name="icon"></slot>
        <!-- Button label text content. MUST contain descriptive text for screen readers. -->
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-button': ChickadeeButton;
  }
}
