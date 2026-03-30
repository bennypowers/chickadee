import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-navigation.css' with { type: 'css' };

/**
 * A sidebar navigation for application-level page navigation. Provides a
 * `<nav>` ARIA landmark with an accessible label for screen readers. Authors
 * SHOULD set `label` to describe purpose. Use `collapsed` when space is
 * limited. Keyboard: Tab navigates items in DOM order.
 *
 * @summary Sidebar navigation for application-level page navigation.
 *
 * @slot - Navigation content. SHOULD contain `chickadee-nav-item` and `chickadee-nav-section` elements. Each item MUST have an accessible label for screen readers.
 *
 * @csspart nav - The `<nav>` landmark element. Styled with `--chickadee-color-surface-raised` background token.
 *
 * @cssprop [--chickadee-navigation-width=240px] - Sidebar width. Maps to the `--chickadee-navigation-width` design token. Overridden to 64px when `collapsed`.
 */
@customElement('chickadee-navigation')
export class ChickadeeNavigation extends LitElement {
  static styles = [styles];

  /** Accessible label for the navigation landmark. */
  @property() label = 'Navigation';

  /** Whether the nav is collapsed to icon-only mode. */
  @property({ type: Boolean, reflect: true }) collapsed = false;

  render() {
    return html`
      <nav aria-label=${this.label} part="nav">
        <!-- Navigation content. SHOULD contain chickadee-nav-item and chickadee-nav-section block elements. Each item MUST have accessible text for screen reader ARIA landmark navigation. -->
        <slot></slot>
      </nav>
    `;
  }
}

export { ChickadeeNavSection } from './chickadee-nav-section.js';
export { ChickadeeNavItem } from './chickadee-nav-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-navigation': ChickadeeNavigation;
  }
}
