import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-accordion-item.css' with { type: 'css' };

/**
 * A single collapsible section within an accordion. The header slot provides
 * the clickable trigger, and the default slot holds the expandable body
 * content. Authors MUST use this inside chickadee-accordion. Authors SHOULD
 * AVOID placing interactive elements in the header slot.
 *
 * Keyboard interaction: the header button is focusable and activates on
 * Enter or Space. The `aria-expanded` attribute reflects the expanded state
 * for screen readers.
 *
 * @summary Single collapsible section within an accordion.
 *
 * @slot header - Clickable header content for the accordion item. MUST contain descriptive text for screen reader accessibility, as this text serves as the button label.
 * @slot - Expandable body content revealed when the item is expanded. Content SHOULD be block-level elements for proper spacing. Screen readers access this region when expanded.
 *
 * @csspart header - Container for the clickable header button. Use to customize header layout and spacing.
 * @csspart body - Collapsible region wrapping the content. Animates via CSS grid-template-rows using `--chickadee-space-lg` token for padding.
 * @csspart content - Inner wrapper for the expandable body content. Controls overflow during animation.
 * @csspart toggle-icon - Chevron icon indicating expand/collapse state. Sized by the `--chickadee-icon-size` token.
 *
 * @fires {Event} expand - Fired when the item is expanded. Native Event with no custom detail.
 * @fires {Event} collapse - Fired when the item is collapsed. Native Event with no custom detail.

 */
@customElement('chickadee-accordion-item')
export class ChickadeeAccordionItem extends LitElement {
  static styles = [styles];

  /** Whether the item body content is visible. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** Whether the item is disabled and cannot be toggled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has('expanded') || changed.has('disabled')) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  #toggle() {
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(new Event(this.expanded ? 'expand' : 'collapse', { bubbles: true }));
  }

  render() {
    return html`
      <div part="header">
        <button aria-expanded="${this.expanded}"
                ?disabled="${this.disabled}"
                @click="${this.#toggle}">
          <!-- Clickable header content for the accordion item. MUST contain descriptive text. -->
          <slot name="header"></slot>
          <chickadee-icon icon="chevron-down" part="toggle-icon"></chickadee-icon>
        </button>
      </div>
      <div part="body" role="region">
        <div part="content">
          <!-- Expandable body content revealed when the item is expanded. -->
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-accordion-item': ChickadeeAccordionItem;
  }
}
