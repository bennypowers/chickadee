import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-menu-group.css' with { type: 'css' };

/**
 * A labeled group within a `chickadee-menu`, for organizing related actions
 * under a heading. Provides `role="group"` with an `aria-label` derived from
 * the `label` attribute for screen reader navigation. Authors SHOULD set
 * `label` to describe the group's purpose.
 *
 * Keyboard interaction: Arrow keys in the parent menu navigate through items
 * within groups seamlessly. Tab order follows DOM order.
 *
 * @summary Labeled group within a dropdown menu, for organizing related actions.
 *
 * @slot - Grouped menu content. SHOULD contain `chickadee-menu-item` block elements. Each item MUST have an accessible label; the group's ARIA `aria-label` is derived from `label` for screen reader context.
 *
 * @csspart label - The group heading text. Styled with `--chickadee-font-size-body-text-xs` and `--chickadee-font-weight-bold` tokens.
 */
@customElement('chickadee-menu-group')
export class ChickadeeMenuGroup extends LitElement {
  static styles = [styles];

  /** Visible heading text displayed above the group's items and used as the ARIA label. */
  @property() label?: string;

  connectedCallback() {
    super.connectedCallback();
    this.role = 'group';
    if (this.label) this.ariaLabel = this.label;
  }

  render() {
    return html`
      ${this.label ? html`<span part="label">${this.label}</span>` : nothing}
      <!-- Grouped menu content. SHOULD contain chickadee-menu-item block elements. Each item MUST have accessible text; the ARIA group label is derived from the label attribute for screen readers. -->
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-menu-group': ChickadeeMenuGroup;
  }
}
