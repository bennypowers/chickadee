import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-wizard-step.css' with { type: 'css' };

/**
 * A single step within a `chickadee-wizard`, for grouping related form
 * fields or informational content into one stage of a multi-step flow.
 * The `name` attribute provides the label shown in the progress stepper.
 * Authors SHOULD set `name` to a short, descriptive label. The parent
 * wizard controls visibility via the `hidden` attribute.
 *
 * Screen readers announce the step content when it becomes visible.
 * Focus SHOULD be managed by the parent wizard; Tab navigates within
 * the step content naturally.
 *
 * @summary Individual step content within a wizard.
 *
 * @slot - SHOULD contain form fields or informational content for this step. Ensure all form controls have accessible labels.
 */
@customElement('chickadee-wizard-step')
export class ChickadeeWizardStep extends LitElement {
  static styles = [styles];

  /** Step title displayed in the progress stepper. */
  @property() name?: string;

  render() {
    return html`
      <!-- Step body content. -->
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-wizard-step': ChickadeeWizardStep;
  }
}
