import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import styles from './chickadee-modal.css' with { type: 'css' };

/**
 * An overlay dialog for presenting focused content or gathering user input.
 * Uses the native `<dialog>` for focus trapping and Escape handling. Authors
 * SHOULD provide a heading for screen reader context. AVOID using modals for
 * non-critical content. Keyboard: Escape closes, Tab cycles focus. ARIA
 * `dialog` role announced on open.
 *
 * @summary Overlay dialog for presenting focused content or gathering user input.
 *
 * @slot heading - Modal title. SHOULD contain an `<h2>` or `<h3>` heading element for proper document outline and screen reader navigation.
 * @slot description - Subtitle text below the heading. SHOULD contain inline text or a `<p>` element.
 * @slot - Modal body content. SHOULD contain block-level elements. Screen readers will navigate this content within the dialog context.
 * @slot footer - Footer action controls. SHOULD contain `<chickadee-button>` elements. The primary action SHOULD appear last for visual flow.
 *
 * @csspart dialog - The native `<dialog>` element. Styled with `--chickadee-color-surface-overlay` background token.
 * @csspart header - The header section containing heading, description, and close button.
 * @csspart body - The scrollable body section.
 * @csspart footer - The footer section. Hidden when empty.
 * @csspart close - The close button in the header. Styled with `--chickadee-size-icon-md` icon size token.
 *
 * @cssprop [--chickadee-modal-max-width=600px] - Maximum width of the dialog. Maps to the `--chickadee-modal-max-width` design token. Overridden by the `variant` attribute.
 *
 * @fires {Event} close - Fired when the modal is closed via dismiss button, Escape key, or backdrop click. Native Event with no custom detail; use `event.target` to identify the originating modal.
 * @fires {Event} open - Fired when the modal is opened by setting `open` to true. Native Event with no custom detail.
 */
@customElement('chickadee-modal')
export class ChickadeeModal extends LitElement {
  static styles = [styles];

  /** Whether the modal is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Size variant controlling the max-width.
   * - small: 400px
   * - default: 600px
   * - large: 900px
   * - full: 100%
   */
  @property({ reflect: true }) variant: 'small' | 'default' | 'large' | 'full' = 'default';

  /** Shorthand for the heading slot. */
  @property() heading?: string;

  @query('dialog') private _dialog!: HTMLDialogElement;

  #previousFocus: HTMLElement | null = null;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this.#previousFocus = document.activeElement as HTMLElement;
        this._dialog.showModal();
        this.dispatchEvent(new Event('open', { bubbles: true }));
      } else if (this._dialog.open) {
        this._dialog.close();
      }
    }
  }

  override willUpdate() {
    import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
  }

  render() {
    return html`
      <dialog part="dialog"
              @close=${this.#onDialogClose}
              @click=${this.#onBackdropClick}>
        <div class="wrapper" @click=${(e: Event) => e.stopPropagation()}>
          <header part="header">
            <div class="header-text">
              <!-- Modal title. SHOULD contain an h2 or h3 heading element for proper document outline. Screen readers use this to identify the ARIA dialog. -->
              <slot name="heading">${this.heading ? html`<h2>${this.heading}</h2>` : nothing}</slot>
              <!-- Subtitle text below the heading. SHOULD contain inline text or a paragraph element. -->
              <slot name="description"></slot>
            </div>
            <button part="close" aria-label="Close dialog" @click=${this.#close}>
              <chickadee-icon icon="close"></chickadee-icon>
            </button>
          </header>
          <div part="body">
            <!-- Modal body content. SHOULD contain block-level elements. Screen readers navigate this within the ARIA dialog context. -->
            <slot></slot>
          </div>
          <footer part="footer">
            <!-- Footer action controls. SHOULD contain button elements. Ensure each action has an accessible label for screen readers. -->
            <slot name="footer"></slot>
          </footer>
        </div>
      </dialog>
    `;
  }

  #close() {
    this.open = false;
    this.#previousFocus?.focus();
    this.#previousFocus = null;
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }

  #onDialogClose() {
    if (!this.open) return;
    this.open = false;
    this.#previousFocus?.focus();
    this.#previousFocus = null;
    this.dispatchEvent(new Event('close', { bubbles: true }));
  }

  #onBackdropClick() {
    this.#close();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-modal': ChickadeeModal;
  }
}
