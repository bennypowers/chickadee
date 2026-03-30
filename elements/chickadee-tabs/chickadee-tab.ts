import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-tab.css' with { type: 'css' };

/**
 * A single tab within a chickadee-tabs container, used for switching between
 * content panels. The host element provides the `role="tab"` attribute and
 * manages `aria-selected` for screen reader accessibility. Authors MUST
 * set the `panel` attribute to associate this tab with a chickadee-tab-panel
 * by name. Tab focus is managed by the parent chickadee-tabs element via
 * roving tabindex.
 *
 * @summary A tab that controls which panel is visible.
 *
 * @slot - Tab label text. MUST be provided for screen reader accessibility.

 */
@customElement('chickadee-tab')
export class ChickadeeTab extends LitElement {
  static styles = [styles];

  /** Whether this tab is currently selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Whether this tab is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Name of the associated chickadee-tab-panel element. */
  @property() panel = '';

  override willUpdate() {
    this.role = 'tab';
    this.tabIndex = this.selected ? 0 : -1;
    this.setAttribute('aria-selected', String(this.selected));
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-tab': ChickadeeTab;
  }
}
