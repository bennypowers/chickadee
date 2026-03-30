import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-nav-item.css' with { type: 'css' };

/**
 * A navigation item within a sidebar, for linking to application pages.
 * Renders as a link when `href` is set, otherwise as a button. The `active`
 * attribute SHOULD be set to indicate the current page; it renders
 * `aria-current="page"` for screen readers. Authors SHOULD provide an `icon`
 * for visual recognition in collapsed mode.
 *
 * Keyboard interaction: focusable via Tab. Enter or Space activates the
 * link or toggles sub-navigation when `expandable`. Screen readers announce
 * the item text as the accessible name and the `aria-current` state.
 *
 * @summary Navigation link within a sidebar, for linking to application pages.
 *
 * @slot - Item label text. SHOULD contain concise inline text describing the destination. Used as the ARIA accessible name; MUST be descriptive for screen reader users who cannot see the icon.
 * @slot icon - Leading icon. SHOULD contain a `chickadee-icon` element. For accessibility, decorative icons SHOULD use `aria-hidden`; critical in collapsed mode where the icon is the only visible indicator.
 * @slot subnav - Nested sub-navigation. SHOULD contain `chickadee-nav-item` block elements for hierarchical navigation. Screen readers navigate these within the parent ARIA landmark context. Visible when `expanded` is true.
 *
 * @csspart link - The anchor or button element. Styled with `--chickadee-color-interactive-fill-plain-hover` hover background and `--chickadee-color-interactive-primary-default` active indicator tokens.
 * @csspart text - The text label wrapper. Truncates with ellipsis on overflow.
 * @csspart expand-icon - The chevron icon for expandable items. Rotates 180deg when `expanded`. Styled with `--chickadee-size-icon-sm` token.
 * @csspart subnav - The container for nested navigation items. Indented with `--chickadee-space-xl` padding.
 *
 * @cssprop [--chickadee-color-interactive-fill-plain-hover] - Hover and focus background color. Maps to the `--chickadee-color-interactive-fill-plain-hover` design token.
 * @cssprop [--chickadee-color-interactive-primary-default] - Active item indicator and focus outline color. Maps to the `--chickadee-color-interactive-primary-default` design token.
 */
@customElement('chickadee-nav-item')
export class ChickadeeNavItem extends LitElement {
  static styles = [styles];

  /** URL for the navigation link destination. When set, renders as an anchor element. */
  @property() href?: string;

  /** Whether this item represents the current page. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Leading icon name shorthand. */
  @property() icon?: string;

  /** Whether this item has expandable sub-navigation. */
  @property({ type: Boolean, reflect: true }) expandable = false;

  /** Whether the sub-navigation is expanded. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  override willUpdate() {
    if (this.icon) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    const content = html`
      <!-- Leading icon. SHOULD contain a chickadee-icon element. For accessibility, decorative icons SHOULD use aria-hidden; critical in collapsed mode. -->
      <slot name="icon">${this.icon ? html`
        <chickadee-icon icon=${this.icon}></chickadee-icon>` : nothing}</slot>
      <span part="text">
        <!-- Item label text. SHOULD contain concise inline text describing the destination. Used as the ARIA accessible name for screen readers. -->
        <slot></slot>
      </span>
      ${this.expandable ? html`
        <chickadee-icon icon="chevron-down" part="expand-icon"></chickadee-icon>` : nothing}
    `;

    return html`
      ${this.href
        ? html`<a part="link" href=${this.href} aria-current=${this.active ? 'page' : nothing}>${content}</a>`
        : html`<button part="link" @click=${this.#onClick} aria-current=${this.active ? 'page' : nothing}>${content}</button>`}
      ${this.expandable ? html`
        <div part="subnav">
          <!-- Nested sub-navigation. SHOULD contain chickadee-nav-item block elements. Screen readers navigate these within the parent ARIA landmark context. -->
          <slot name="subnav"></slot>
        </div>` : nothing}
    `;
  }

  #onClick() {
    if (this.expandable) {
      this.expanded = !this.expanded;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-nav-item': ChickadeeNavItem;
  }
}
