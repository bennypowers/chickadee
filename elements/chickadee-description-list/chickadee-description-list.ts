import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-description-list.css' with { type: 'css' };

/**
 * Provides a styled description list for displaying key-value pairs.
 * Authors SHOULD provide `<dt>` and `<dd>` pairs. The `orientation`
 * attribute controls layout. Screen readers announce item count
 * and navigate between terms via the semantic `<dl>` element.
 *
 * @summary Displays key-value pairs in a structured list.
 *
 * @slot - Content MUST be `<dt>` and `<dd>` element pairs. Screen readers rely on this semantic structure to convey term-definition relationships.
 *
 * @csspart list - The inner `<dl>` element wrapping all term-description pairs.
 *
 * @cssprop [--chickadee-description-list-gap=var(--chickadee-space-lg)] - Gap between term/description groups. Maps to the `--chickadee-space-lg` design token.
 */
@customElement('chickadee-description-list')
export class ChickadeeDescriptionList extends LitElement {
  static styles = [styles];

  /**
   * Layout orientation.
   * - vertical: terms and descriptions stack
   * - horizontal: terms and descriptions align side-by-side
   */
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Whether to use compact spacing. */
  @property({ type: Boolean, reflect: true }) compact = false;

  render() {
    return html`
      <dl part="list">
        <!-- Term and description pairs. Content MUST be dt and dd elements; screen readers use this structure to announce relationships. -->
        <slot></slot>
      </dl>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-description-list': ChickadeeDescriptionList;
  }
}
