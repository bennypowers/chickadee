import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-card.css' with { type: 'css' };

/**
 * Groups related content in an elevated container with optional header,
 * body, image, and footer sections. Authors SHOULD use the `variant`
 * attribute to match elevation context. Selectable cards provide keyboard
 * interaction via Enter and Space keys. Screen readers announce the
 * selected state through `aria-pressed` on the interactive overlay.
 *
 * @summary Groups related content in an elevated container.
 *
 * @slot header - Card header content. SHOULD contain a heading element (h2-h6) for the document outline. Heading level SHOULD reflect the card's position in the page hierarchy.
 * @slot - Card body content. Accepts block-level elements such as paragraphs and lists.
 * @slot footer - Card footer content. SHOULD contain action buttons or metadata. Interactive elements in the footer are accessible via Tab.
 * @slot image - Hero image area. SHOULD contain an `<img>` element with descriptive `alt` text for screen readers.
 *
 * @csspart header - The header section container.
 * @csspart body - The body section container.
 * @csspart footer - The footer section container.
 * @csspart image - The image section container.
 *
 * @cssprop [--chickadee-card-border-radius=var(--chickadee-border-radius-default)] - Card corner radius. Maps to the `--chickadee-border-radius-default` design token.
 * @cssprop [--chickadee-card-padding=var(--chickadee-space-xl)] - Card section padding. Maps to the `--chickadee-space-xl` design token.
 *
 * @fires {Event} select - Fired when a selectable card is clicked or activated via keyboard. Native Event with no custom detail; check `event.target.selected` for the new state.
 */
@customElement('chickadee-card')
export class ChickadeeCard extends LitElement {
  static styles = [styles];

  /**
   * The visual variant of the card.
   * - default: elevated with box-shadow
   * - flat: bordered, no shadow
   * - rounded: larger border radius
   */
  @property({ reflect: true }) variant: 'default' | 'flat' | 'rounded' = 'default';

  /** Whether the card can be selected by clicking. */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /** Whether the card is currently selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Makes the entire card a navigation link. */
  @property() href?: string;

  /** Whether to use compact (reduced) padding. */
  @property({ type: Boolean, reflect: true }) compact = false;

  render() {
    return html`
      <!-- Hero image area. SHOULD contain an img element with descriptive alt text for screen readers. -->
      <slot name="image" part="image"></slot>
      <!-- Card header. SHOULD contain a heading element (h2-h6) for the document outline at the appropriate level. -->
      <slot name="header" part="header"></slot>
      <!-- Card body content. Accepts block-level elements such as paragraphs, lists, and inline text. -->
      <slot part="body"></slot>
      <!-- Card footer. SHOULD contain action buttons or metadata. Interactive elements receive keyboard focus via Tab. -->
      <slot name="footer" part="footer"></slot>
      ${this.href ? html`<a href=${this.href} aria-label=${nothing} tabindex="-1"></a>` : nothing}
      ${this.selectable ? html`<div class="select-overlay"
                                    tabindex="0"
                                    role="button"
                                    aria-pressed=${String(this.selected)}
                                    @click=${this.#onSelect}
                                    @keydown=${this.#onKeydown}></div>` : nothing}
    `;
  }

  #onSelect() {
    this.selected = !this.selected;
    this.dispatchEvent(new Event('select', { bubbles: true }));
  }

  #onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.#onSelect();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-card': ChickadeeCard;
  }
}
