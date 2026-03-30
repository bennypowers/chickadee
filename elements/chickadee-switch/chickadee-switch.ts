import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-switch.css' with { type: 'css' };

/**
 * A toggle switch for binary on/off choices. Authors SHOULD provide a visible
 * label via the default slot or the `label` attribute for accessibility.
 * Form-associated via ElementInternals; supports `name` and `value` for
 * native form submission.
 *
 * @summary A toggle switch for binary on/off choices.
 *
 * @fires {Event} change - Fired when the checked state changes. Native Event with no custom detail; read `event.target.checked` for the new state.
 */
@customElement('chickadee-switch')
export class ChickadeeSwitch extends LitElement {
  static styles = [styles];

  static formAssociated = true;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Whether the switch is currently on. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Whether the switch is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Form name for the switch. */
  @property({ reflect: true }) name?: string;

  /** Form value submitted when the switch is checked. */
  @property({ reflect: true }) value = 'on';

  /** Accessible label for the switch, use when there is no visible label text. */
  @property() label?: string;

  #internals = this.attachInternals();

  override willUpdate() {
    this.#internals.setFormValue(this.checked ? this.value : null);
  }

  render() {
    return html`
      <!-- The switch track. Uses --chickadee-border-radius-pill for shape and --chickadee-color-interactive-primary-default when checked. -->
      <button part="track"
              role="switch"
              aria-checked=${this.checked}
              aria-label=${this.label ?? nothing}
              ?disabled=${this.disabled}
              @click=${this.#onClick}>
      </button>
      <!-- Label text for the switch. SHOULD contain a visible label describing the setting. Provides the accessible name when no label attribute is set. -->
      <slot></slot>
    `;
  }

  #onClick() {
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-switch': ChickadeeSwitch;
  }
}
