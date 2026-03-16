import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-icon-button.css' with { type: 'css' };

/**
 * An icon-only button for toolbar actions, menus, and compact UI controls.
 * Authors MUST provide an `accessible-label` attribute, since there is no
 * visible text for screen readers to announce. The `accessible-label` value
 * SHOULD describe the action (e.g. "Close dialog"), not the icon
 * (e.g. "X icon"). AVOID using this element when a text label would fit —
 * prefer `<chickadee-button>` with an icon slot instead.
 *
 * Keyboard interaction: activates on Enter or Space. Focus is managed via
 * the internal `<button>` element, which receives focus via Tab. The
 * `accessible-label` attribute sets `aria-label` on the inner button for
 * WCAG compliance.
 *
 * @summary Icon-only push button for toolbar and compact UI actions.
 *
 * @fires {MouseEvent} click - Fired when the button is clicked. The event is a native MouseEvent with no custom detail; use `event.target` to identify the originating button.
 */
@customElement('chickadee-icon-button')
export class ChickadeeIconButton extends LitElement {
  static styles = [styles];

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether to render a compact (smaller) button. */
  @property({ type: Boolean, reflect: true }) compact = false;

  /**
   * Accessible label for the icon button. Required for accessibility
   * since icon-only buttons have no visible text.
   */
  @property({ attribute: 'accessible-label' }) accessibleLabel?: string;

  render() {
    return html`
      <!-- The inner button element -->
      <button part="button"
              ?disabled=${this.disabled}
              aria-disabled=${this.disabled ? 'true' : 'false'}
              aria-label=${this.accessibleLabel ?? ''}>
        <!-- Icon content (e.g. SVG or icon element). MUST contain exactly one icon. The icon SHOULD use currentColor for fill so it inherits the button's color. The slotted content is decorative; the accessible-label attribute provides the accessible name. -->
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-icon-button': ChickadeeIconButton;
  }
}
