import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-empty-state.css' with { type: 'css' };

/**
 * Provides a placeholder for empty content areas. Authors SHOULD use this
 * when a page or container has no content to display. Focus SHOULD be
 * managed by action buttons in the actions slot. The icon is decorative
 * and SHOULD use aria-hidden to hide from screen readers.
 *
 * @summary Placeholder content for empty views.
 *
 * @slot icon - Large decorative icon or illustration. Content SHOULD be an SVG, `<img>`, or `chickadee-icon` element. Decorative images SHOULD use `alt=""` or `aria-hidden="true"`.
 * @slot heading - Heading text. SHOULD contain a heading element (h2-h6) at an appropriate level for the document outline. Screen readers use the heading to identify the empty state region.
 * @slot - Description text (block-level elements such as `<p>`) explaining the empty state and guiding the user.
 * @slot actions - Action buttons. SHOULD contain `chickadee-button` elements. These buttons receive keyboard focus via Tab navigation.
 *
 * @cssprop [--chickadee-empty-state-max-width=480px] - Maximum content width. Override to constrain or expand the layout within a container.
 */
@customElement('chickadee-empty-state')
export class ChickadeeEmptyState extends LitElement {
  static styles = [styles];

  /** Shorthand icon name. Renders a `chickadee-icon` when set. */
  @property() icon?: string;

  /**
   * Size variant.
   * - lg: full-size layout (default)
   * - sm: compact layout for inline empty states
   */
  @property({ reflect: true }) variant: 'lg' | 'sm' = 'lg';

  override willUpdate() {
    if (this.icon) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    return html`
      <!-- Decorative icon or illustration. SHOULD use aria-hidden="true" on decorative images. Accepts img, SVG, or chickadee-icon elements. -->
      <slot name="icon">${this.icon ? html`
        <chickadee-icon icon=${this.icon}></chickadee-icon>` : nothing}</slot>
      <!-- Heading text. SHOULD contain a heading element (h2-h6) at the appropriate level; screen readers use it to identify the empty state. -->
      <slot name="heading"></slot>
      <!-- Description text as block-level elements like p explaining why the view is empty and guiding the user. -->
      <slot></slot>
      <!-- Action buttons. SHOULD contain chickadee-button elements that receive keyboard focus via Tab. -->
      <slot name="actions"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-empty-state': ChickadeeEmptyState;
  }
}
