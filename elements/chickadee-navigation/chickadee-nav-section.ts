import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-nav-section.css' with { type: 'css' };

/**
 * A labeled group within a navigation sidebar, for organizing related
 * navigation items under a collapsible heading. Provides visual separation
 * when used inside a `chickadee-navigation` element. Authors SHOULD set
 * `heading` to describe the section's category.
 *
 * Keyboard interaction: the heading button is focusable via Tab and toggles
 * `expanded` on Enter or Space. Screen readers announce the `aria-expanded`
 * state of the heading button.
 *
 * @summary Labeled group within sidebar navigation, for organizing related items.
 *
 * @slot - Section content. SHOULD contain `chickadee-nav-item` block elements for navigation links. Each item MUST have accessible text content; screen readers navigate these as part of the `<nav>` ARIA landmark.
 *
 * @csspart heading - The collapsible heading button. Styled with `--chickadee-font-size-body-text-xs` and `--chickadee-font-weight-bold` tokens.
 * @csspart items - The container for slotted navigation items. Hidden when `expanded` is false.
 */
@customElement('chickadee-nav-section')
export class ChickadeeNavSection extends LitElement {
  static styles = [styles];

  /** Visible heading text for the section, displayed as a collapsible toggle button. */
  @property() heading?: string;

  /** Whether the section is expanded (items visible). */
  @property({ type: Boolean, reflect: true }) expanded = true;

  render() {
    return html`
      ${this.heading ? html`
        <button part="heading"
                aria-expanded=${String(this.expanded)}
                @click=${() => this.expanded = !this.expanded}>
          ${this.heading}
        </button>` : nothing}
      <div part="items">
        <!-- Section content. SHOULD contain chickadee-nav-item block elements for navigation links. Each item MUST have accessible text; screen readers navigate these within the ARIA landmark. -->
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-nav-section': ChickadeeNavSection;
  }
}
