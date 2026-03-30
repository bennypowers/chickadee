import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-notification-badge.css' with { type: 'css' };

/**
 * A notification badge provides a numeric count overlay for its slotted
 * content. Intended for use with icon buttons or similar interactive
 * elements. When the count exceeds the threshold, it displays "N+" instead.
 * The badge is hidden when count is 0 or unset. Authors SHOULD set
 * `accessible-label` on the slotted content to ensure screen readers convey
 * the notification context. The badge itself is `aria-hidden`; the element
 * sets an ARIA label via ElementInternals when count is positive. Tab and
 * focus behavior is delegated to the slotted interactive element.
 *
 * @summary Provides a numeric badge overlay for notification counts.
 *
 * @csspart badge - The badge count indicator. Sized via the `--chickadee-size-badge-sm` design token and colored with the `--chickadee-color-status-danger` token.
 */
@customElement('chickadee-notification-badge')
export class ChickadeeNotificationBadge extends LitElement {
  static styles = [styles];

  /** The badge count. When greater than threshold, displays "N+". When 0 or unset, the badge is hidden. */
  @property({ type: Number, reflect: true }) count = 0;

  /** Maximum count before showing truncated display (e.g. "99+"). */
  @property({ type: Number, reflect: true }) threshold = 99;

  #internals = this.attachInternals();

  override willUpdate() {
    if (this.count > 0) {
      this.#internals.ariaLabel = `${this.count} notifications`;
    } else {
      this.#internals.ariaLabel = null;
    }
  }

  render() {
    return html`
      <!-- The element to badge. Slotted content SHOULD be an interactive element like an icon-button for keyboard accessibility. Screen readers rely on the slotted element's own accessible name. -->
      <slot></slot>
      ${this.count > 0 ? html`
        <span part="badge" aria-hidden="true">${this.count > this.threshold ? `${this.threshold}+` : this.count}</span>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-notification-badge': ChickadeeNotificationBadge;
  }
}
