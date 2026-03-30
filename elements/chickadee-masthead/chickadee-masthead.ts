import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-masthead.css' with { type: 'css' };

/**
 * An application header/toolbar that provides branding, primary navigation,
 * and utility actions for a page or application shell. Establishes elevation
 * level 1 via style container queries, using `--chickadee-color-surface-raised`
 * for the background. When `sticky`, remains fixed at the top of the viewport.
 * Authors SHOULD place the masthead as the first landmark in the page.
 *
 * The header element uses `role="banner"` for screen readers. Navigation
 * slot content SHOULD use `<nav>` with an `aria-label`. Tab order follows
 * the slot order: hamburger, logo, default, utility.
 *
 * @summary Application header with branding and navigation.
 *
 * @slot logo - Brand logo or mark; SHOULD contain an image or text element representing the brand identity.
 * @slot - Primary navigation content; SHOULD contain `<nav>` links or a navigation component with appropriate ARIA labeling.
 * @slot utility - Right-aligned utility items; SHOULD contain icon buttons, menus, or avatars for secondary actions.
 * @slot hamburger - Mobile menu trigger; SHOULD be a `chickadee-icon-button` with an accessible label like "Menu".
 *
 * @csspart header - The inner `<header>` element. Uses `--chickadee-space-xl` horizontal padding.
 * @csspart spacer - A flex spacer that pushes utility content to the right edge.
 */
@customElement('chickadee-masthead')
export class ChickadeeMasthead extends LitElement {
  static styles = [styles];

  /** Whether the masthead is sticky at the top of the viewport. */
  @property({ type: Boolean, reflect: true }) sticky = false;

  render() {
    return html`
      <header part="header" role="banner">
        <!-- Mobile menu trigger. -->
        <slot name="hamburger"></slot>
        <!-- Brand logo or mark. -->
        <slot name="logo"></slot>
        <!-- Primary navigation content. -->
        <slot></slot>
        <div part="spacer"></div>
        <!-- Right-aligned utility items. -->
        <slot name="utility"></slot>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-masthead': ChickadeeMasthead;
  }
}
