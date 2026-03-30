import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-tab-panel.css' with { type: 'css' };

/**
 * A panel associated with a chickadee-tab, used for displaying content when
 * its tab is selected. The `name` attribute links this panel to its tab via
 * the tab's `panel` attribute. The parent chickadee-tabs element controls
 * visibility by setting the `hidden` attribute. Authors SHOULD provide
 * `role="tabpanel"` content that is focusable or contains focusable elements
 * for keyboard accessibility. Content SHOULD be block-level elements.
 *
 * @summary Content panel controlled by a tab.
 *
 * @slot - Panel content for the selected tab. Content SHOULD be block-level elements. Screen readers announce the panel via ARIA `aria-labelledby` referencing the associated tab.

 */
@customElement('chickadee-tab-panel')
export class ChickadeeTabPanel extends LitElement {
  static styles = [styles];

  /** Identifier matched by a tab's `panel` attribute. */
  @property({ reflect: true }) name = '';

  override connectedCallback() {
    super.connectedCallback();
    this.role = 'tabpanel';
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-tab-panel': ChickadeeTabPanel;
  }
}
