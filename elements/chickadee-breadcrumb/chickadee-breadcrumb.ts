import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-breadcrumb.css' with { type: 'css' };

/**
 * A breadcrumb trail for showing the current page within a site
 * hierarchy. Provides a `<nav>` landmark with an ordered list.
 * Authors SHOULD supply `<a>` elements for ancestors and a `<span>`
 * for the current page. The last item SHOULD have
 * `aria-current="page"`. Separators render automatically via CSS.
 * Tab and Enter allow keyboard navigation of links.
 *
 * @summary Shows the current location within a navigation hierarchy.
 *
 * @slot - Breadcrumb items as inline elements. SHOULD contain `<a>` elements for navigable ancestors and a `<span aria-current="page">` for the current page.
 *
 * @csspart nav - The `<nav>` landmark wrapper.
 * @csspart list - The `<ol>` containing slotted breadcrumb items.
 *
 * @cssprop [--chickadee-breadcrumb-separator-color] - Separator character color. Defaults to `--chickadee-color-border-subtle`.
 */
@customElement('chickadee-breadcrumb')
export class ChickadeeBreadcrumb extends LitElement {
  static styles = [styles];

  /** Accessible label for the navigation landmark. */
  @property() label = 'Breadcrumb';

  render() {
    return html`
      <nav aria-label=${this.label} part="nav">
        <ol part="list">
          <!-- Breadcrumb items. The last item SHOULD have aria-current="page". -->
          <slot></slot>
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-breadcrumb': ChickadeeBreadcrumb;
  }
}
