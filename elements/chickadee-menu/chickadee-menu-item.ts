import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-menu-item.css' with { type: 'css' };

/**
 * An actionable item within a `chickadee-menu`. Renders as a link when `href`
 * is set. Provides `role="menuitem"` for ARIA compliance. The `danger`
 * attribute SHOULD be used for destructive actions. AVOID disabling items
 * without context. Keyboard: Arrow keys focus, Enter/Space activates.
 * Screen readers announce item text as accessible name.
 *
 * @summary Actionable item within a dropdown menu.
 *
 * @slot - Item label text. SHOULD contain concise inline text describing the action. Used as the ARIA accessible name for screen readers; MUST be descriptive enough for users who cannot see the icon.
 * @slot icon - Leading icon. SHOULD contain a `chickadee-icon` element. For accessibility, decorative icons SHOULD use `aria-hidden`; meaningful icons MUST have a `label` attribute.
 * @slot description - Secondary description text. SHOULD contain inline text elements providing additional context. Screen readers announce this after the main label for ARIA context.
 *
 * @csspart content - The text content wrapper containing label and description.
 * @csspart description - The secondary description text rendered from the `description` attribute shorthand. Styled with `--chickadee-font-size-body-text-xs` token.
 * @csspart check - The selection checkmark icon, visible when `selected` is set. Styled with `--chickadee-color-interactive-primary-default` token.
 * @csspart link - The anchor element rendered when `href` is set.
 *
 * @cssprop [--chickadee-color-interactive-fill-plain-hover] - Hover/focus background color. Maps to the `--chickadee-color-interactive-fill-plain-hover` design token.
 * @cssprop [--chickadee-color-text-status-danger] - Text color for danger items. Maps to the `--chickadee-color-text-status-danger` design token.
 */
@customElement('chickadee-menu-item')
export class ChickadeeMenuItem extends LitElement {
  static styles = [styles];

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the item represents a destructive action. */
  @property({ type: Boolean, reflect: true }) danger = false;

  /** Leading icon name shorthand. */
  @property() icon?: string;

  /** Secondary description text shorthand. */
  @property() description?: string;

  /** Makes the item a navigation link. */
  @property() href?: string;

  /** Whether the item is selected (shows a checkmark). */
  @property({ type: Boolean, reflect: true }) selected = false;

  connectedCallback() {
    super.connectedCallback();
    this.role = 'menuitem';
    this.tabIndex = 0;
  }

  override willUpdate() {
    if (this.icon || this.selected) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    const content = html`
      <!-- Leading icon. SHOULD contain a chickadee-icon element. For accessibility, decorative icons SHOULD use aria-hidden. -->
      <slot name="icon">${this.icon ? html`
        <chickadee-icon icon=${this.icon}></chickadee-icon>` : nothing}</slot>
      <span part="content">
        <!-- Item label text. SHOULD contain concise inline text. Used as the ARIA accessible name for screen readers. -->
        <slot></slot>
        <!-- Secondary description text. SHOULD contain inline text providing additional context about the action. -->
        <slot name="description">${this.description ? html`
          <span part="description">${this.description}</span>` : nothing}</slot>
      </span>
      ${this.selected ? html`<chickadee-icon icon="check-circle-fill" part="check"></chickadee-icon>` : nothing}
    `;

    return this.href
      ? html`<a href=${this.href} part="link">${content}</a>`
      : content;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-menu-item': ChickadeeMenuItem;
  }
}
