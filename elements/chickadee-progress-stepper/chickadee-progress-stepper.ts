import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import styles from './chickadee-progress-stepper.css' with { type: 'css' };

export { ChickadeeProgressStep } from './chickadee-progress-step.js';

/**
 * A progress stepper shows the steps needed to complete a process and the
 * status of each step. Authors SHOULD use 3-5 steps. Each step MUST have
 * a title. The stepper uses `role="list"` for screen reader navigation.
 *
 * Supports horizontal and vertical orientations. In horizontal mode, the
 * stepper automatically switches to vertical below 768px container width
 * via container queries.
 *
 * @summary Shows steps needed to complete a process and their status.
 *
 * @slot - chickadee-progress-step elements. Each step MUST have a state attribute.
 */
@customElement('chickadee-progress-stepper')
export class ChickadeeProgressStepper extends LitElement {
  static styles = [styles];

  /**
   * Orientation of the stepper.
   * - horizontal: steps in a row (default), switches to vertical below 768px
   * - vertical: steps in a column
   */
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** Whether to use compact (smaller) step indicators. */
  @property({ type: Boolean, reflect: true }) compact = false;

  override connectedCallback() {
    super.connectedCallback();
    this.role = 'list';
  }

  render() {
    const vertical = this.orientation === 'vertical';
    return html`
      <div id="container" class=${classMap({ vertical, compact: this.compact })}>
        <!-- Use this slot for chickadee-progress-step elements. -->
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-progress-stepper': ChickadeeProgressStepper;
  }
}
