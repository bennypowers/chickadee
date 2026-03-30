import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-toggle-group.css' with { type: 'css' };

export { ChickadeeToggle } from './chickadee-toggle.js';

/**
 * A group of toggle buttons that provides a way for users to select one or
 * more options from a set. In single-selection mode (default), toggles
 * behave like radio buttons. When `multiple` is set, toggles behave like
 * checkboxes. Authors MUST provide an accessible label via `aria-label` or
 * `aria-labelledby` on the host element. Authors SHOULD ensure each slotted
 * toggle has a descriptive label for screen readers. Keyboard interaction:
 * Tab moves focus into the group; individual toggle buttons are focusable
 * via Tab and activate on Enter or Space.
 *
 * @summary Groups toggle buttons for single or multiple selection.
 *
 * @csspart container - The group container with `role="group"`. Style to customize layout using the `--chickadee-border-radius-pill` token.
 *
 * @slot - chickadee-toggle elements. Each toggle MUST have a `value` attribute. Slotted toggles SHOULD have accessible label text for screen reader accessibility.
 *
 * @fires {Event} change - Fired when the selection changes. Native Event with no custom detail. Use `querySelectorAll('chickadee-toggle[selected]')` to read the current selection.
 */
@customElement('chickadee-toggle-group')
export class ChickadeeToggleGroup extends LitElement {
  static styles = [styles];

  /** Whether multiple toggles can be selected at once. */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** Whether to render compact (smaller) toggles. */
  @property({ type: Boolean, reflect: true }) compact = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#onClick);
  }

  #onClick(e: Event) {
    const toggle = (e.target as Element).closest?.('chickadee-toggle');
    if (!toggle || toggle.disabled) return;
    if (this.multiple) {
      toggle.selected = !toggle.selected;
    } else {
      for (const t of this.querySelectorAll('chickadee-toggle')) {
        t.selected = (t === toggle);
      }
    }
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #onSlotChange() {
    this.requestUpdate();
  }

  render() {
    return html`
      <div part="container" role="group">
        <!-- chickadee-toggle elements for single or multi selection. -->
        <slot @slotchange="${this.#onSlotChange}"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-toggle-group': ChickadeeToggleGroup;
  }
}
