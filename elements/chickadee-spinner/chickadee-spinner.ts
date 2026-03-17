import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-spinner.css' with { type: 'css' };

/**
 * A spinner indicates an action is in progress. It SHOULD be used when
 * loading content or processing a request. Authors SHOULD provide a text
 * label via the default slot to describe what is loading. Screen readers
 * announce the spinner via `role="status"` and `aria-live="polite"` on
 * the SVG element.
 *
 * @summary Animated loading indicator with optional text label.
 *
 * @csspart track - The background circle (track).
 * @csspart indicator - The animated arc (loading indicator).
 */
@customElement('chickadee-spinner')
export class ChickadeeSpinner extends LitElement {
  static styles = [styles];

  /**
   * Preset size for the spinner.
   * - lg: 64px (default)
   * - md: 48px
   * - sm: 16px
   */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'lg';

  render() {
    return html`
      <svg role="status" viewBox="0 0 100 100" aria-live="polite">
        <!-- Background track circle -->
        <circle part="track" class="track"
                cx="50" cy="50" r="40"
                fill="none"
                vector-effect="non-scaling-stroke" />
        <!-- Animated loading indicator arc -->
        <circle part="indicator" class="indicator"
                cx="50" cy="50" r="40"
                fill="none"
                vector-effect="non-scaling-stroke" />
      </svg>
      <!-- Optional text label describing the loading state. -->
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-spinner': ChickadeeSpinner;
  }
}
