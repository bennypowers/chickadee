import { LitElement, html, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './chickadee-avatar.css' with { type: 'css' };

/**
 * An avatar displays a user image, initials derived from their name, or a
 * generic person placeholder. Use the `src` attribute for a photo, the `name`
 * attribute for initials, or leave both unset for the fallback icon.
 * Authors SHOULD provide `alt` text when `src` is set for screen reader
 * accessibility. When only `name` is provided, the element sets `role="img"`
 * and an ARIA label automatically. The avatar is not focusable and does not
 * accept keyboard interaction; Tab and focus behavior is inherited from the
 * surrounding context.
 *
 * @summary Displays a user photo, initials, or placeholder icon.
 *
 * @csspart image - The img element when `src` is set.
 * @csspart initials - The span element showing derived initials when `name` is set.
 * @csspart placeholder - The SVG placeholder icon when neither `src` nor `name` is set.
 *
 * @cssprop [--chickadee-avatar-background] - Avatar background color. References the `--chickadee-color-surface-*` design tokens. Defaults to a neutral gray via `light-dark()`.
 * @cssprop [--chickadee-avatar-color] - Text and icon color within the avatar. References the `--chickadee-color-text-*` design tokens. Defaults to a neutral gray via `light-dark()`.
 */
@customElement('chickadee-avatar')
export class ChickadeeAvatar extends LitElement {
  static styles = [styles];

  /** Image URL for the avatar photo. */
  @property({ reflect: true }) src?: string;

  /** Alt text for the avatar image. */
  @property({ reflect: true }) alt?: string;

  /** Full name used to derive initials. */
  @property({ reflect: true }) name?: string;

  /** Preset size for the avatar. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  #internals = this.attachInternals();

  get #initials(): string {
    if (!this.name) return '';
    const parts = this.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]![0] ?? '' : '';
    return (first + last).toUpperCase();
  }

  override willUpdate() {
    if (this.src) {
      this.#internals.role = null;
      this.#internals.ariaLabel = null;
    } else if (this.name) {
      this.#internals.role = 'img';
      this.#internals.ariaLabel = this.name;
    } else {
      this.#internals.role = 'img';
      this.#internals.ariaLabel = 'User avatar';
    }
  }

  render() {
    if (this.src) {
      return html`<img src=${this.src} alt=${this.alt ?? ''} part="image">`;
    } else if (this.name) {
      return html`<span part="initials">${this.#initials}</span>`;
    } else {
      return html`
        <!-- Placeholder person silhouette icon -->
        <svg part="placeholder" viewBox="0 0 24 24" aria-hidden="true">
          ${svg`<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>`}
        </svg>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-avatar': ChickadeeAvatar;
  }
}
