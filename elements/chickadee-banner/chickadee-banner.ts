import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-banner.css' with { type: 'css' };

const STATUS_ICONS = new Map(Object.entries({
  info: 'info',
  success: 'check-circle-fill',
  warning: 'warning-fill',
  danger: 'error-fill',
}));

/**
 * A banner for status messages and alerts. Provides severity variants
 * (info, success, warning, danger, neutral). Authors SHOULD choose
 * the variant matching the message severity. Danger banners use
 * `role="alert"` (assertive); others use `role="status"` (polite).
 * When `dismissable` is set, authors MUST handle the `close` event.
 * Tab moves focus to the dismiss button when present.
 *
 * @summary Displays a status message with icon, actions, and optional dismiss.
 *
 * @slot - Banner message content. SHOULD contain inline text describing the status for screen readers. MUST be descriptive enough to convey meaning without the icon.
 * @slot icon - Custom status icon override. SHOULD contain a single chickadee-icon element. When absent, a default icon is derived from the variant.
 * @slot actions - Trailing action controls. SHOULD contain chickadee-button or anchor elements. Screen reader users navigate to these after the message.
 *
 * @csspart container - Outer flex wrapper; receives the ARIA role.
 * @csspart icon - Wrapper around the status icon slot.
 * @csspart body - Wrapper around the default (message) slot.
 * @csspart dismiss - The dismiss/close button, rendered when `dismissable` is set.
 *
 * @cssprop [--chickadee-banner-background] - Banner background color. Defaults to the surface-status token for the current variant (e.g. `--chickadee-color-surface-status-info`).
 * @cssprop [--chickadee-banner-color] - Banner text color.
 * @cssprop [--chickadee-banner-icon-color] - Icon color. Defaults to the status token for the current variant (e.g. `--chickadee-color-status-info`).
 *
 * @fires {Event} close - Fired when the dismiss button is clicked. Native Event with no custom detail. The host MUST handle removal or hiding of the banner.
 */
@customElement('chickadee-banner')
export class ChickadeeBanner extends LitElement {
  static styles = [styles];

  /**
   * The visual variant of the banner, indicating status severity.
   * - info: informational message (default)
   * - success: positive outcome
   * - warning: caution or attention needed
   * - danger: error or critical issue
   * - neutral: generic, no status connotation
   */
  @property({ reflect: true }) variant: 'info' | 'success' | 'warning' | 'danger' | 'neutral' = 'info';

  /** Whether the banner shows a dismiss (close) button. */
  @property({ type: Boolean, reflect: true }) dismissable = false;

  /** Whether the banner sticks to the top of its scroll container. */
  @property({ type: Boolean, reflect: true }) sticky = false;

  override willUpdate() {
    import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
  }

  #onClose() {
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }

  render() {
    return html`
      <div part="container" role="${this.variant === 'danger' ? 'alert' : 'status'}">
        <!-- Custom status icon. Overrides the default state-derived icon. SHOULD contain a chickadee-icon element. -->
        <span part="icon">
          <slot name="icon">${STATUS_ICONS.get(this.variant) ? html`<chickadee-icon icon="${STATUS_ICONS.get(this.variant)}"></chickadee-icon>` : nothing}</slot>
        </span>
        <span part="body">
          <!-- Banner message text. MUST contain descriptive text for screen readers. -->
          <slot></slot>
        </span>
        <!-- Action buttons or links, displayed after the message body. SHOULD contain chickadee-button or anchor elements. -->
        <slot name="actions"></slot>
        ${this.dismissable ? html`
          <button part="dismiss" aria-label="Dismiss banner" @click="${this.#onClose}">
            <chickadee-icon icon="close"></chickadee-icon>
          </button>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-banner': ChickadeeBanner;
  }
}
