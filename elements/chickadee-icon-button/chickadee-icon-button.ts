import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './chickadee-icon-button.css' with { type: 'css' };

/**
 * An icon-only button for toolbar actions, menus, and compact UI controls.
 * Authors MUST provide an `accessible-label` attribute, since there is no
 * visible text for screen readers to announce. The `accessible-label` value
 * SHOULD describe the action (e.g. "Close dialog"), not the icon
 * (e.g. "X icon"). AVOID using this element when a text label would fit --
 * prefer chickadee-button with an icon slot instead.
 *
 * Keyboard interaction: activates on Enter or Space. Focus delegates to the
 * internal button element via delegatesFocus. The `accessible-label` attribute
 * sets `aria-label` on the inner button for WCAG compliance.
 *
 * @summary Icon-only push button for toolbar and compact UI actions.
 *
 * @fires {MouseEvent} click - Fired when the button is clicked. Native MouseEvent with no custom detail; use `event.target` to identify the originating button.
 */
@customElement('chickadee-icon-button')
export class ChickadeeIconButton extends LitElement {
  static styles = [styles];

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether to render a compact (smaller) button. */
  @property({ type: Boolean, reflect: true }) compact = false;

  /**
   * Accessible label for the icon button. Required for accessibility
   * since icon-only buttons have no visible text.
   */
  @property({ attribute: 'accessible-label' }) accessibleLabel?: string;

  /** Shorthand for the default slot. When set, renders a chickadee-icon element. */
  @property() icon?: string;

  override willUpdate() {
    if (this.icon) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    return html`
      <!-- The inner button element -->
      <button part="button"
              ?disabled=${this.disabled}
              aria-disabled=${String(!!this.disabled) as 'true' | 'false'}
              aria-label=${ifDefined(this.accessibleLabel)}>
        <!-- Icon content (e.g. SVG or icon element). MUST contain exactly one icon. The icon SHOULD use currentColor for fill so it inherits the button's color. The slotted content is decorative; the accessible-label attribute provides the accessible name. -->
        <slot>${this.icon ? html`
          <chickadee-icon icon=${this.icon}></chickadee-icon>` : ''}</slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-icon-button': ChickadeeIconButton;
  }
}
