import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-hint.css' with { type: 'css' };

/**
 * A hint provides contextual feedback to the user. Status variants convey
 * the nature of the message (info, success, warning, danger, or neutral).
 * When dismissable, a close button is rendered and a `close` event is
 * dispatched on click. Authors SHOULD use the default slot for hint text
 * and the `actions` slot for inline action links or buttons. Authors MUST
 * choose a `status` that matches the severity of the message. The dismiss
 * button is keyboard-focusable and activates on Enter or Space. Screen
 * readers SHOULD be able to reach the hint content and its ARIA label.
 *
 * @summary Contextual feedback message with status variants.
 *
 * @fires {Event} close - Dispatched when the dismiss button is clicked. Native Event with no custom detail. Bubbles.
 *
 * @csspart container - The outer flex container. Styled with `--chickadee-color-surface-status-*` design tokens for background.
 * @csspart body - The content area containing hint text and actions.
 * @csspart dismiss - The dismiss/close button. Uses `--chickadee-size-icon-sm` design token for icon sizing.
 */
@customElement('chickadee-hint')
export class ChickadeeHint extends LitElement {
  static styles = [styles];

  /**
   * The status variant of the hint.
   * - neutral: default, no specific status
   * - info: informational message
   * - success: positive outcome
   * - warning: caution or attention needed
   * - danger: error or destructive outcome
   */
  @property({ reflect: true }) status: 'info' | 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';

  /** Whether the hint can be dismissed by the user. */
  @property({ type: Boolean, reflect: true }) dismissable = false;

  override willUpdate() {
    if (this.dismissable) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    return html`
      <div part="container">
        <div part="body">
          <!-- Hint text content. SHOULD be plain text or inline elements. Screen readers announce this content directly. -->
          <slot></slot>
          <!-- Optional inline action links or buttons. Slotted elements SHOULD be focusable interactive elements like links or buttons for keyboard accessibility. -->
          <slot name="actions"></slot>
        </div>
        ${this.dismissable ? html`
          <button part="dismiss" aria-label="Dismiss" @click="${this.#onClose}">
            <chickadee-icon icon="close"></chickadee-icon>
          </button>` : nothing}
      </div>
    `;
  }

  #onClose() {
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-hint': ChickadeeHint;
  }
}
