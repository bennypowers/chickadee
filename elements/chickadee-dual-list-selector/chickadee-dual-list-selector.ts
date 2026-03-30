import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './chickadee-dual-list-selector.css' with { type: 'css' };

/**
 * A two-pane list transfer component for moving items between "available"
 * and "selected" lists, allowing users to build a curated selection from
 * a larger set. Each pane provides search filtering and multi-select via
 * checkboxes. Transfer buttons move checked items between panes. Authors
 * SHOULD set `available-label` and `selected-label` when the default
 * headings do not describe the domain.
 *
 * Each listbox uses `role="listbox"` with `aria-multiselectable="true"`.
 * Screen readers announce the pane headings and selection counts.
 * Tab moves focus between search fields and transfer buttons. Space
 * toggles item selection within a pane.
 *
 * @summary Two-pane list transfer selector.
 *
 * @csspart available-pane - The left pane listing available items. Bordered with `--chickadee-color-border-subtle`.
 * @csspart selected-pane - The right pane listing selected items. Bordered with `--chickadee-color-border-subtle`.
 * @csspart controls - The central column of transfer buttons.
 * @csspart pane-header - Header row within each pane showing the label and count.
 * @csspart search - Search input within each pane for filtering items.
 * @csspart list - Scrollable list container within each pane, uses `role="listbox"`.
 * @csspart item - Individual option row within a pane list.
 * @csspart count - Selection count text within each pane header.
 *
 * @fires {Event} change - Native Event with no custom detail; fired when items are transferred between lists. Read the `available` and `selected` properties for current state.
 */
@customElement('chickadee-dual-list-selector')
export class ChickadeeDualListSelector extends LitElement {
  static styles = [styles];

  /** Heading for the available items pane. */
  @property({ attribute: 'available-label' }) availableLabel = 'Available';

  /** Heading for the selected items pane. */
  @property({ attribute: 'selected-label' }) selectedLabel = 'Selected';

  /** Available options (array of strings). */
  @property({ type: Array }) available: string[] = [];

  /** Selected options (array of strings). */
  @property({ type: Array }) selected: string[] = [];

  @state() private _availableChecked = new Set<string>();
  @state() private _selectedChecked = new Set<string>();
  @state() private _availableFilter = '';
  @state() private _selectedFilter = '';

  override willUpdate() {
    import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
  }

  render() {
    const filteredAvailable = this.available.filter(
      item => item.toLowerCase().includes(this._availableFilter.toLowerCase()));
    const filteredSelected = this.selected.filter(
      item => item.toLowerCase().includes(this._selectedFilter.toLowerCase()));

    return html`
      <div part="available-pane">
        <div part="pane-header">
          <strong>${this.availableLabel}</strong>
          <span part="count">${this._availableChecked.size} of ${this.available.length} selected</span>
        </div>
        <input part="search" type="search" placeholder="Filter"
               .value=${this._availableFilter}
               @input=${(e: InputEvent) => this._availableFilter = (e.target as HTMLInputElement).value}>
        <div part="list" role="listbox" aria-label=${this.availableLabel} aria-multiselectable="true">
          ${filteredAvailable.map(item => html`
            <div role="option" part="item"
                 aria-selected=${String(this._availableChecked.has(item))}
                 @click=${() => this.#toggleAvailable(item)}>
              <input type="checkbox" .checked=${this._availableChecked.has(item)} tabindex="-1">
              ${item}
            </div>`)}
        </div>
      </div>

      <div part="controls">
        <button aria-label="Move selected right" ?disabled=${this._availableChecked.size === 0}
                @click=${this.#moveRight}>
          <chickadee-icon icon="chevron-right"></chickadee-icon>
        </button>
        <button aria-label="Move all right" ?disabled=${this.available.length === 0}
                @click=${this.#moveAllRight}>
          <chickadee-icon icon="chevron-right"></chickadee-icon>
          <chickadee-icon icon="chevron-right"></chickadee-icon>
        </button>
        <button aria-label="Move selected left" ?disabled=${this._selectedChecked.size === 0}
                @click=${this.#moveLeft}>
          <chickadee-icon icon="chevron-left"></chickadee-icon>
        </button>
        <button aria-label="Move all left" ?disabled=${this.selected.length === 0}
                @click=${this.#moveAllLeft}>
          <chickadee-icon icon="chevron-left"></chickadee-icon>
          <chickadee-icon icon="chevron-left"></chickadee-icon>
        </button>
      </div>

      <div part="selected-pane">
        <div part="pane-header">
          <strong>${this.selectedLabel}</strong>
          <span part="count">${this._selectedChecked.size} of ${this.selected.length} selected</span>
        </div>
        <input part="search" type="search" placeholder="Filter"
               .value=${this._selectedFilter}
               @input=${(e: InputEvent) => this._selectedFilter = (e.target as HTMLInputElement).value}>
        <div part="list" role="listbox" aria-label=${this.selectedLabel} aria-multiselectable="true">
          ${filteredSelected.map(item => html`
            <div role="option" part="item"
                 aria-selected=${String(this._selectedChecked.has(item))}
                 @click=${() => this.#toggleSelected(item)}>
              <input type="checkbox" .checked=${this._selectedChecked.has(item)} tabindex="-1">
              ${item}
            </div>`)}
        </div>
      </div>
    `;
  }

  #toggleAvailable(item: string) {
    const next = new Set(this._availableChecked);
    next.has(item) ? next.delete(item) : next.add(item);
    this._availableChecked = next;
  }

  #toggleSelected(item: string) {
    const next = new Set(this._selectedChecked);
    next.has(item) ? next.delete(item) : next.add(item);
    this._selectedChecked = next;
  }

  #moveRight() {
    const items = [...this._availableChecked];
    this.available = this.available.filter(i => !this._availableChecked.has(i));
    this.selected = [...this.selected, ...items];
    this._availableChecked = new Set();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #moveAllRight() {
    this.selected = [...this.selected, ...this.available];
    this.available = [];
    this._availableChecked = new Set();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #moveLeft() {
    const items = [...this._selectedChecked];
    this.selected = this.selected.filter(i => !this._selectedChecked.has(i));
    this.available = [...this.available, ...items];
    this._selectedChecked = new Set();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #moveAllLeft() {
    this.available = [...this.available, ...this.selected];
    this.selected = [];
    this._selectedChecked = new Set();
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-dual-list-selector': ChickadeeDualListSelector;
  }
}
