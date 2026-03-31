import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ChickadeeAccordionItem } from './chickadee-accordion-item.js';

export { ChickadeeAccordionItem };

import styles from './chickadee-accordion.css' with { type: 'css' };

/**
 * An accordion provides a way for authors to organize content into
 * collapsible sections, allowing users to expand one or more sections at a
 * time. Each section MUST contain a chickadee-accordion-item with a header
 * slot. Accordion items SHOULD have descriptive header content for screen
 * readers. By default, only one item can be expanded; set `multiple` to
 * allow several. Keyboard interaction: Tab moves focus between accordion
 * headers; Enter or Space toggles the focused item. The element manages
 * ARIA expanded state on each item.
 *
 * @summary Organizes content into collapsible sections.
 *
 * @slot - chickadee-accordion-item elements. Each item SHOULD have descriptive header text for screen reader accessibility.
 */
@customElement('chickadee-accordion')
export class ChickadeeAccordion extends LitElement {
  static styles = [styles];

  /** Whether multiple items can be expanded at the same time. */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** Whether to render borders around the accordion. */
  @property({ type: Boolean, reflect: true }) bordered = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('expand', this.#onExpand);
  }

  #onExpand(e: Event) {
    if (this.multiple) return;
    const target = e.target as ChickadeeAccordionItem;
    for (const item of this.querySelectorAll('chickadee-accordion-item')) {
      if (item !== target) item.expanded = false;
    }
  }

  render() {
    return html`
      <!-- Use this slot for chickadee-accordion-item elements. -->
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-accordion': ChickadeeAccordion;
  }
}
