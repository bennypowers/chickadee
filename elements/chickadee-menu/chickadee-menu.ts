import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import styles from './chickadee-menu.css' with { type: 'css' };

/**
 * A dropdown menu for presenting a list of actions or options. Provides
 * ARIA `role="menu"` for screen reader navigation. Authors SHOULD pair this
 * with a trigger button. Keyboard: Arrow keys move focus, Home/End jump to
 * first/last, Escape closes, Enter/Space activates.
 *
 * @summary Dropdown menu for presenting a list of actions or options.
 *
 * @slot - Menu content. SHOULD contain `chickadee-menu-item` and `chickadee-menu-group` elements. Each item MUST have an accessible label for screen readers.
 *
 * @csspart menu - The popover container with `role="menu"`. Styled with `--chickadee-color-surface-overlay` background and `--chickadee-shadow-xl` elevation token.
 *
 * @fires {Event} close - Fired when the menu is closed via Escape, light-dismiss, or item selection. Native Event with no custom detail.
 * @fires {CustomEvent} select - Fired when an item is selected. CustomEvent with `detail: { item: ChickadeeMenuItem }` referencing the selected menu item element.
 */
@customElement('chickadee-menu')
export class ChickadeeMenu extends LitElement {
  static styles = [styles];

  /** Whether the menu is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  @query('[popover]') private _popover!: HTMLElement;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this.#positionPopover();
        this._popover.showPopover();
      } else {
        try { this._popover.hidePopover(); } catch { /* already hidden */ }
      }
    }
  }

  #positionPopover() {
    const rect = this.getBoundingClientRect();
    this._popover.style.top = `${rect.bottom}px`;
    this._popover.style.left = `${rect.left}px`;
  }

  render() {
    return html`
      <div popover="auto"
           role="menu"
           part="menu"
           @toggle=${this.#onToggle}
           @click=${this.#onClick}
           @keydown=${this.#onKeydown}>
        <!-- Menu content. SHOULD contain chickadee-menu-item and chickadee-menu-group block elements. Each item MUST have accessible text for screen reader ARIA navigation. -->
        <slot></slot>
      </div>
    `;
  }

  get #items(): HTMLElement[] {
    return [...this.querySelectorAll('chickadee-menu-item:not([disabled])')];
  }

  #onClick(e: Event) {
    const item = (e.target as Element).closest('chickadee-menu-item');
    if (item && !item.hasAttribute('disabled')) {
      this.dispatchEvent(new CustomEvent('select', { detail: { item }, bubbles: true }));
      this.open = false;
    }
  }

  #onKeydown(e: KeyboardEvent) {
    const items = this.#items;
    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = current;
    if (e.key === 'ArrowDown') next = (current + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (current - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    items[next]?.focus();
  }

  #onToggle(e: ToggleEvent) {
    if (e.newState === 'closed') {
      this.open = false;
      this.dispatchEvent(new Event('close', { bubbles: true }));
    }
  }
}

export { ChickadeeMenuItem } from './chickadee-menu-item.js';
export { ChickadeeMenuGroup } from './chickadee-menu-group.js';

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-menu': ChickadeeMenu;
  }
}
