import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-slider.css' with { type: 'css' };

/**
 * A range slider for selecting a numeric value. Provides a
 * form-associated control wrapping a native range input for full
 * keyboard and assistive technology support. Authors SHOULD set a
 * `label` for screen readers. Arrow keys allow fine-grained control;
 * Tab moves focus to the thumb.
 *
 * @summary Selects a numeric value within a range.
 *
 * @slot label - Visible label for the slider. SHOULD contain inline text content. Associates with the input for accessibility.
 * @slot min-label - Label at the minimum end. SHOULD contain short inline text like a number or word.
 * @slot max-label - Label at the maximum end. SHOULD contain short inline text like a number or word.
 *
 * @csspart label - The label element wrapping the label slot and optional value output.
 * @csspart value - The output element showing the current value when `show-value` is set.
 * @csspart track-container - Flex container holding min-label, input, and max-label.
 * @csspart input - The native range input element.
 *
 * @cssprop [--chickadee-slider-track-color] - Track background color. Defaults to `--chickadee-color-border-subtle`.
 * @cssprop [--chickadee-slider-fill-color] - Filled portion of the track. Defaults to `--chickadee-color-interactive-primary-default`.
 * @cssprop [--chickadee-slider-thumb-color] - Thumb handle color. Defaults to `--chickadee-color-interactive-primary-default`.
 *
 * @fires {Event} input - Fired continuously during drag or keyboard interaction. Native Event with no custom detail.
 * @fires {Event} change - Fired when the value is committed on pointer release. Native Event with no custom detail.
 */
@customElement('chickadee-slider')
export class ChickadeeSlider extends LitElement {
  static styles = [styles];

  static formAssociated = true;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Minimum allowed value. */
  @property({ type: Number, reflect: true }) min = 0;

  /** Maximum allowed value. */
  @property({ type: Number, reflect: true }) max = 100;

  /** Step increment between allowed values. */
  @property({ type: Number, reflect: true }) step = 1;

  /** Current slider value. */
  @property({ type: Number, reflect: true }) value = 50;

  /** Whether the slider is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Form name for the slider. */
  @property() name?: string;

  /** Accessible label for the slider. */
  @property() label?: string;

  /** Whether to display the current value. */
  @property({ type: Boolean, reflect: true, attribute: 'show-value' }) showValue = false;

  /** Whether to display tick marks at each step. */
  @property({ type: Boolean, reflect: true, attribute: 'show-ticks' }) showTicks = false;

  #internals = this.attachInternals();

  override willUpdate() {
    this.#internals.setFormValue(String(this.value));
    const pct = ((this.value - this.min) / (this.max - this.min)) * 100;
    this.style.setProperty('--_fill-percent', `${pct}%`);
  }

  render() {
    return html`
      <label part="label">
        <!-- Visible label text for the slider. -->
        <slot name="label">${this.label ?? nothing}</slot>
        ${this.showValue ? html`<output part="value">${this.value}</output>` : nothing}
      </label>
      <div part="track-container">
        <!-- Label at the minimum end of the slider range. -->
        <slot name="min-label"></slot>
        <input part="input"
               type="range"
               .value=${String(this.value)}
               min=${this.min}
               max=${this.max}
               step=${this.step}
               ?disabled=${this.disabled}
               aria-label=${this.label ?? nothing}
               @input=${this.#onInput}
               @change=${this.#onChange}>
        <!-- Label at the maximum end of the slider range. -->
        <slot name="max-label"></slot>
      </div>
    `;
  }

  #onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = Number(input.value);
    this.dispatchEvent(new Event('input', { bubbles: true }));
  }

  #onChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = Number(input.value);
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-slider': ChickadeeSlider;
  }
}
