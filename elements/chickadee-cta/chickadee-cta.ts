import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './chickadee-cta.css' with { type: 'css' };

/**
 * A call-to-action for navigation. Authors MUST provide `href`. AVOID
 * using this for actions -- use chickadee-button instead. Focus delegates
 * to the inner anchor. Screen readers announce it as a link.
 *
 * Keyboard: Enter activates (native anchor). Tab focuses via
 * delegatesFocus.
 *
 * @summary Styled navigation link for primary, secondary, and tertiary CTAs.
 *
 * @fires {MouseEvent} click - Fired when the CTA is clicked. Native MouseEvent with no custom detail; use `event.target` to identify the originating CTA.
 */
@customElement('chickadee-cta')
export class ChickadeeCta extends LitElement {
  static styles = [styles];

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * The visual variant of the CTA.
   * - primary: filled pill with brand color background
   * - secondary: outlined pill with strong border
   * - tertiary: outlined pill with subtle border, blue text
   * - (unset): inline link with trailing arrow icon
   */
  @property({ reflect: true }) variant?: 'primary' | 'secondary' | 'tertiary';

  /** The URL to navigate to. Required. */
  @property() href?: string;

  /** Where to open the linked URL. */
  @property() target?: string;

  /** Relationship of the linked URL. */
  @property() rel?: string;

  /** Download filename hint. */
  @property() download?: string;

  /** Whether to render a compact (smaller) CTA. */
  @property({ type: Boolean, reflect: true }) compact = false;

  override willUpdate() {
    if (!this.variant) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  render() {
    return html`
      <!-- The inner anchor element -->
      <a part="anchor"
         href=${ifDefined(this.href)}
         target=${ifDefined(this.target)}
         rel=${ifDefined(this.rel)}
         download=${ifDefined(this.download)}>
        <span id="text">
          <!-- CTA label text. MUST contain descriptive text for the navigation target. -->
          <slot></slot>
        </span>${!this.variant ? html`
        <chickadee-icon id="arrow" icon="arrow-right"></chickadee-icon>` : nothing}
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-cta': ChickadeeCta;
  }
}
