import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './chickadee-wizard.css' with { type: 'css' };

/**
 * A multi-step form flow that guides users through a sequential process,
 * for workflows like registration, onboarding, or configuration wizards.
 * Provides step progress via a composed `chickadee-progress-stepper` and
 * manages navigation between `chickadee-wizard-step` children. When
 * `linear` is set, steps MUST be completed in order. Authors SHOULD
 * give each step a `name` attribute for the stepper labels.
 *
 * The progress stepper announces step state to screen readers. Tab
 * moves focus between Back, Next, and Finish buttons in the footer.
 *
 * @summary Multi-step form wizard with progress tracking.
 *
 * @slot - SHOULD contain `chickadee-wizard-step` elements. Each step is shown one at a time based on the `current` index.
 *
 * @csspart stepper - The progress stepper component. Padded with `--chickadee-space-xl`.
 * @csspart body - The step content area. Padded with `--chickadee-space-xl`.
 * @csspart footer - The navigation button row. Separated by a top border using `--chickadee-color-border-subtle`.
 *
 * @fires {CustomEvent} step-change - Fired when navigating between steps. CustomEvent with `detail: { current: number }` indicating the new active step index.
 * @fires {Event} finish - Native Event with no custom detail; fired when the user clicks Finish on the last step.
 */
@customElement('chickadee-wizard')
export class ChickadeeWizard extends LitElement {
  static styles = [styles];

  /** Index of the currently active step (0-based). */
  @property({ type: Number, reflect: true }) current = 0;

  /** Whether to enforce sequential step completion. */
  @property({ type: Boolean, reflect: true }) linear = false;

  @state() private _stepCount = 0;

  override willUpdate() {
    import('@chickadee/elements/chickadee-progress-stepper/chickadee-progress-stepper.js');
    import('@chickadee/elements/chickadee-button/chickadee-button.js');
  }

  render() {
    const steps = this.#steps;
    return html`
      <chickadee-progress-stepper part="stepper">
        ${steps.map((step, i) => html`
          <chickadee-progress-step
            state=${i < this.current ? 'complete' : i === this.current ? 'active' : ''}
            >${step.getAttribute('name') ?? `Step ${i + 1}`}</chickadee-progress-step>
        `)}
      </chickadee-progress-stepper>
      <div part="body">
        <!-- Wizard step elements. -->
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
      <div part="footer">
        ${this.current > 0 ? html`
          <chickadee-button variant="secondary" @click=${this.#back}>Back</chickadee-button>` : html`<span></span>`}
        ${this.current < steps.length - 1 ? html`
          <chickadee-button @click=${this.#next}>Next</chickadee-button>` : html`
          <chickadee-button @click=${this.#finish}>Finish</chickadee-button>`}
      </div>
    `;
  }

  get #steps(): Element[] {
    return [...this.querySelectorAll('chickadee-wizard-step')];
  }

  #onSlotChange() {
    const steps = this.#steps;
    this._stepCount = steps.length;
    steps.forEach((step, i) => {
      (step as HTMLElement).hidden = i !== this.current;
    });
  }

  #back() {
    if (this.current > 0) {
      this.current--;
      this.#updateVisibility();
      this.dispatchEvent(new CustomEvent('step-change', {
        detail: { current: this.current }, bubbles: true,
      }));
    }
  }

  #next() {
    if (this.current < this._stepCount - 1) {
      this.current++;
      this.#updateVisibility();
      this.dispatchEvent(new CustomEvent('step-change', {
        detail: { current: this.current }, bubbles: true,
      }));
    }
  }

  #finish() {
    this.dispatchEvent(new Event('finish', { bubbles: true }));
  }

  #updateVisibility() {
    this.#steps.forEach((step, i) => {
      (step as HTMLElement).hidden = i !== this.current;
    });
  }
}

export { ChickadeeWizardStep } from './chickadee-wizard-step.js';

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-wizard': ChickadeeWizard;
  }
}
