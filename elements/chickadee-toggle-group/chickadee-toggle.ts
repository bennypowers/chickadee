import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { ChickadeeToggleGroup } from './chickadee-toggle-group.js';

import styles from './chickadee-toggle.css' with { type: 'css' };

/**
 * A single toggle button, used inside chickadee-toggle-group. This element
 * provides a selectable button that renders with `role="radio"` or
 * `role="checkbox"` depending on whether the parent group allows multiple
 * selection. The `aria-checked` attribute reflects the selected state for
 * screen readers. Keyboard interaction: the button is focusable via Tab
 * and activates on Enter or Space.
 *
 * Authors MUST provide visible label text in the default slot. The `icon`
 * attribute or `icon` slot can add a leading icon.
 *
 * @summary A selectable toggle button for use in a toggle group.
 *
 * @csspart button - The inner button element. Style to customize padding, colors, and focus ring. Uses the `--chickadee-color-interactive-primary-default` design token for selection state.
 *
 * @slot - Label text for the toggle. MUST be provided for accessibility.
 * @slot icon - Optional leading icon. SHOULD contain a chickadee-icon element.

 */
@customElement('chickadee-toggle')
export class ChickadeeToggle extends LitElement {
  static styles = [styles];

  /** Whether this toggle is currently selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Whether this toggle is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The value associated with this toggle. */
  @property() value = '';

  /** Shorthand for the icon slot. When set, renders a chickadee-icon element. */
  @property() icon?: string;

  override willUpdate() {
    if (this.icon) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  get #role(): 'checkbox' | 'radio' {
    return (this.closest('chickadee-toggle-group') as ChickadeeToggleGroup)?.multiple
      ? 'checkbox'
      : 'radio';
  }

  render() {
    return html`
      <button part="button"
              role="${this.#role}"
              aria-checked="${this.selected}"
              ?disabled="${this.disabled}">
        <!-- Optional icon content, placed before the label. SHOULD be a chickadee-icon element. -->
        <slot name="icon">${this.icon ? html`
          <chickadee-icon icon="${this.icon}"></chickadee-icon>` : nothing}</slot>
        <!-- Label text for the toggle. MUST be descriptive for screen readers. -->
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-toggle': ChickadeeToggle;
  }
}
