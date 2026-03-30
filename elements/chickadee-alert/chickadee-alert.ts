import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-alert.css' with { type: 'css' };

const STATUS_ICONS = new Map(Object.entries({
  info: 'info',
  success: 'check-circle-fill',
  warning: 'warning-fill',
  danger: 'error-fill',
}));

/**
 * Displays a status-driven alert for communicating important information.
 * Authors SHOULD set `status` to convey severity. Uses `role="alert"` for
 * danger/warning and `role="status"` for others. When `dismissable`, authors
 * MUST handle the `close` event. Keyboard: Tab to dismiss, Enter/Space to
 * activate.
 *
 * @summary Displays a status-driven alert for communicating important information.
 *
 * @slot - Body content for the alert. SHOULD contain paragraph text or inline elements. Screen readers will announce this content as part of the alert's live region.
 * @slot heading - Heading text for the alert. SHOULD contain inline text. Overrides the `heading` attribute. Screen readers announce this as part of the alert.
 * @slot actions - Action controls for the alert. SHOULD contain `<a>` or `<chickadee-button>` elements. Ensure each action has an accessible label.
 * @slot icon - Overrides the status-derived icon. SHOULD contain a `chickadee-icon` element with an appropriate `label` for screen readers.
 *
 * @csspart container - The outer alert container. Receives the ARIA role attribute.
 * @csspart icon - The icon wrapper. Styled with the `--chickadee-color-status-*` token for the current status.
 * @csspart content - The main content area containing heading, body, and actions.
 * @csspart heading-text - The heading text rendered from the `heading` attribute shorthand.
 * @csspart dismiss - The dismiss button, visible when `dismissable` is set. Styled with `--chickadee-space-xs` padding and `--chickadee-size-icon-sm` icon size.
 *
 * @fires {Event} close - Fired when the dismiss button is clicked. Native Event with no custom detail; use `event.target` to identify the originating alert.
 */
@customElement('chickadee-alert')
export class ChickadeeAlert extends LitElement {
  static styles = [styles];

  /**
   * The visual variant of the alert.
   * - inline: standard block alert (default)
   * - toast: floating notification with rounded corners and shadow
   */
  @property({ reflect: true }) variant: 'inline' | 'toast' = 'inline';

  /**
   * The status of the alert, which controls the accent color and default icon.
   * - info: informational (default)
   * - success: operation completed
   * - warning: caution needed
   * - danger: error or critical issue
   * - neutral: no specific status
   */
  @property({ reflect: true }) status: 'info' | 'success' | 'warning' | 'danger' | 'neutral' = 'info';

  /** Whether the alert can be dismissed by the user. */
  @property({ type: Boolean, reflect: true }) dismissable = false;

  /** Shorthand for the heading slot. Overridden by slotted heading content. */
  @property({ reflect: true }) heading?: string;

  override willUpdate() {
    if (STATUS_ICONS.has(this.status) || this.dismissable) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  #onClose() {
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }

  render() {
    const role = this.status === 'danger' || this.status === 'warning'
      ? 'alert'
      : 'status';
    return html`
      <div part="container" role="${role}">
        <span part="icon">
          <!-- Overrides the status-derived icon. SHOULD contain a chickadee-icon element. For accessibility, icons SHOULD have an appropriate label for screen readers. -->
          <slot name="icon">${STATUS_ICONS.has(this.status) ? html`
            <chickadee-icon icon="${STATUS_ICONS.get(this.status)!}"></chickadee-icon>` : nothing}</slot>
        </span>
        <div part="content">
          <!-- Heading text for the alert. SHOULD contain inline text. Overrides the heading attribute. Screen readers announce this as part of the ARIA alert. -->
          <slot name="heading">${this.heading ? html`
            <strong part="heading-text">${this.heading}</strong>` : nothing}</slot>
          <!-- Body content for the alert. SHOULD contain paragraph text or inline elements. Screen readers announce this within the ARIA live region. -->
          <slot></slot>
          <!-- Action controls for the alert. SHOULD contain button or anchor elements. Ensure each action has an accessible label for screen readers. -->
          <slot name="actions"></slot>
        </div>${this.dismissable ? html`
        <button part="dismiss"
                aria-label="Dismiss"
                @click="${this.#onClose}">
          <chickadee-icon icon="close"></chickadee-icon>
        </button>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-alert': ChickadeeAlert;
  }
}
