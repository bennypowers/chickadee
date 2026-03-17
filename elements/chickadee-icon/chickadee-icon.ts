import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './chickadee-icon.css' with { type: 'css' };

/**
 * A decorative icon element. Renders SVG icons from the bundled icon set.
 * Icons are lazy-loaded on first use. The icon SHOULD be treated as
 * decorative by default (hidden from the accessibility tree). When the icon
 * conveys meaning, authors MUST set the `accessible-label` attribute, which
 * adds `role="img"` and `aria-label` via ElementInternals.
 *
 * Keyboard interaction: none (icons are not interactive). Use
 * chickadee-icon-button for interactive icon actions.
 *
 * @summary Renders a decorative SVG icon from the bundled icon set.
 *
 * @slot - Fallback content displayed while the icon loads or if the icon name is invalid.
 *
 * @fires load - Fired when the icon SVG has loaded and rendered.
 * @fires {ErrorEvent} error - Fired when the icon fails to load.
 */
@customElement('chickadee-icon')
export class ChickadeeIcon extends LitElement {
  static styles = [styles];

  /** Icon name. Must match a file in the bundled icon set. */
  @property({ reflect: true }) icon?: string;

  /**
   * Icon set. Determines the subdirectory to load from.
   * - ui: standard UI icons (16px default)
   */
  @property({ reflect: true }) set: 'ui' = 'ui';

  /**
   * Accessible label for the icon. When set, adds role="img" and aria-label
   * to make the icon meaningful to screen readers.
   */
  @property({ attribute: 'accessible-label' }) accessibleLabel?: string;

  @state() private content?: Element | null;

  #internals = this.attachInternals();

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has('icon') || changed.has('set')) {
      this.#load();
    }
    if (changed.has('accessibleLabel')) {
      this.#internals.ariaLabel = this.accessibleLabel ?? null;
      this.#internals.role = this.accessibleLabel ? 'img' : 'presentation';
    }
  }

  render() {
    return html`
      <div id="container" aria-hidden="true">${this.content ?? ''}<!--
        Fallback content displayed while the icon loads
      --><span part="fallback" ?hidden=${!!this.content}><!--
        --><slot></slot></span>
      </div>
    `;
  }

  async #load() {
    const { set = 'ui', icon } = this;
    if (!icon) {
      this.content = null;
      return;
    }
    try {
      const mod = await import(`./icons/${set}/${icon}.js`);
      this.content = mod.default.cloneNode(true);
      this.dispatchEvent(new Event('load', { bubbles: true }));
    } catch (e) {
      this.content = null;
      this.dispatchEvent(new ErrorEvent('error', {
        message: `Could not load icon "${icon}" from set "${set}".`,
      }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-icon': ChickadeeIcon;
  }
}
