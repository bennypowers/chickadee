import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { ChickadeeTab } from './chickadee-tab.js';

import styles from './chickadee-tabs.css' with { type: 'css' };

export { ChickadeeTab } from './chickadee-tab.js';
export { ChickadeeTabPanel } from './chickadee-tab-panel.js';

let tabIdCounter = 0;

/**
 * A tabbed interface container that provides a way for authors to organize
 * content into panels, allowing users to switch between views. Tab elements
 * MUST be placed in the `tab` slot; panels go in the default slot. Arrow
 * keys navigate between tabs using roving tabindex. The element
 * automatically wires ARIA attributes between tabs and panels for screen
 * reader accessibility. Supports horizontal and vertical orientations,
 * plus a boxed variant.
 *
 * @summary Tabbed container for organizing content into panels.
 *
 * @csspart tablist - The tab list container with `role="tablist"`. Style to customize tab bar layout and the `--chickadee-color-border-subtle` indicator line.
 *
 * @slot tab - chickadee-tab elements. Each tab MUST have a `panel` attribute matching a panel's `name`. Screen readers rely on proper ARIA tab-panel association for accessible navigation.
 * @slot - chickadee-tab-panel elements. Each panel MUST have a `name` attribute. Panel content SHOULD be focusable or contain focusable elements for keyboard accessibility.
 *
 * @fires {CustomEvent} tab-select - Fired when a tab is selected. CustomEvent with `detail: { tab: ChickadeeTab }` referencing the selected tab element.
 */
@customElement('chickadee-tabs')
export class ChickadeeTabs extends LitElement {
  static styles = [styles];

  /**
   * Orientation of the tab list.
   * - horizontal: tabs in a row (default)
   * - vertical: tabs in a column
   */
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Visual variant.
   * - default: underline indicator
   * - boxed: tabs enclosed in a bordered container
   */
  @property({ reflect: true }) variant: 'default' | 'boxed' = 'default';

  get #tabs(): ChickadeeTab[] {
    return [...this.querySelectorAll<ChickadeeTab>('chickadee-tab')];
  }

  get #panels() {
    return [...this.querySelectorAll('chickadee-tab-panel')];
  }

  #selectTab(tab: ChickadeeTab) {
    for (const t of this.#tabs) t.selected = (t === tab);
    for (const p of this.#panels) p.hidden = (p.getAttribute('name') !== tab.panel);
    this.dispatchEvent(new CustomEvent('tab-select', { detail: { tab }, bubbles: true }));
  }

  #onTabSlotChange() {
    this.#wireAria();
  }

  #onPanelSlotChange() {
    this.#wireAria();
  }

  #wireAria() {
    for (const tab of this.#tabs) {
      if (!tab.id) tab.id = `chickadee-tab-${++tabIdCounter}`;
      const panel = this.#panels.find(p => p.getAttribute('name') === tab.panel);
      if (panel) {
        if (!panel.id) panel.id = `chickadee-tab-panel-${tabIdCounter}`;
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
      }
    }
  }

  #onClick(e: Event) {
    const tab = (e.target as HTMLElement).closest?.('chickadee-tab') as ChickadeeTab | null;
    if (tab && !tab.disabled && this.contains(tab)) {
      this.#selectTab(tab);
    }
  }

  #onKeydown(e: KeyboardEvent) {
    const tabs = this.#tabs.filter(t => !t.disabled);
    const current = tabs.findIndex(t => t.selected);
    const isHoriz = this.orientation === 'horizontal';
    let next = current;
    if ((isHoriz && e.key === 'ArrowRight') || (!isHoriz && e.key === 'ArrowDown')) {
      next = (current + 1) % tabs.length;
    } else if ((isHoriz && e.key === 'ArrowLeft') || (!isHoriz && e.key === 'ArrowUp')) {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    this.#selectTab(tabs[next]);
    tabs[next].focus();
  }

  render() {
    return html`
      <div part="tablist"
           role="tablist"
           aria-orientation=${this.orientation}
           @click=${this.#onClick}
           @keydown=${this.#onKeydown}>
        <!-- chickadee-tab elements. Each tab MUST have a panel attribute matching a panel name. -->
        <slot name="tab" @slotchange=${this.#onTabSlotChange}></slot>
      </div>
      <!-- chickadee-tab-panel elements. Each panel MUST have a name attribute. -->
      <slot @slotchange=${this.#onPanelSlotChange}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-tabs': ChickadeeTabs;
  }
}
