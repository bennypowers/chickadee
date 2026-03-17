import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './chickadee-progress-step.css' with { type: 'css' };

const STATE_ICONS = new Map(Object.entries({
  active: 'resources-full',
  complete: 'check-circle-fill',
  warn: 'warning-fill',
  fail: 'error-fill',
}));

/**
 * A single step in a progress stepper. Each step MUST have text content
 * (the step title). Steps SHOULD have a `state` attribute. The step icon
 * is derived from the state, or can be overridden with `icon`.
 *
 * Use inside chickadee-progress-stepper. Screen readers announce each
 * step as a listitem with aria-current="step" on the active step.
 *
 * @summary Single step in a progress stepper with state-driven icon.
 *
 * @slot - Step title as inline text (1-3 words). MUST be provided for screen reader accessibility. The title serves as the step's accessible name.
 * @slot description - Optional prose description (around 40 characters). SHOULD contain a `<p>` or inline text only. AVOID block-level content, links, or images.
 * @slot icon - Overrides the state-derived icon. SHOULD contain a chickadee-icon element. AVOID overriding warn or fail state icons, since those states have prescribed icons for accessibility.
 */
@customElement('chickadee-progress-step')
export class ChickadeeProgressStep extends LitElement {
  static styles = [styles];

  /**
   * The state of this step.
   * - active: currently in progress
   * - complete: finished successfully
   * - warn: succeeded with warnings
   * - fail: step failed
   * - (unset): inactive / upcoming
   */
  @property({ reflect: true }) state?: 'active' | 'complete' | 'warn' | 'fail';

  /** Optional description text. Overridden by the description slot. */
  @property({ reflect: true }) description?: string;

  /** Custom icon name, overrides the state-derived icon. */
  @property() icon?: string;

  /** URL to make the step title a link. */
  @property({ reflect: true }) href?: string;

  override connectedCallback() {
    super.connectedCallback();
    this.role = 'listitem';
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has('state') || changed.has('icon')) {
      import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    }
  }

  get #iconName(): string | undefined {
    if (this.icon) return this.icon;
    if (this.state) return STATE_ICONS.get(this.state);
    return undefined;
  }

  render() {
    const iconName = this.#iconName;
    return html`
      <div id="container">
        <!-- Custom icon for the step. SHOULD contain a chickadee-icon element. AVOID overriding warn or fail icons since those have prescribed accessibility semantics. Accepts any inline element. -->
        <slot name="icon">${iconName ? html`
          <chickadee-icon icon=${iconName}></chickadee-icon>` : html`
          <span class="no-icon"></span>`}
        </slot>${this.href ? html`
        <a id="label" href=${this.href}
           aria-current=${ifDefined(this.state === 'active' ? 'step' : undefined)}>
          <slot></slot>
        </a>` : html`
        <strong id="label"
                aria-current=${ifDefined(this.state === 'active' ? 'step' : undefined)}>
          <slot></slot>
        </strong>`}
        <!-- Optional prose description for the step. SHOULD be inline text or a p element, around 40 characters. AVOID block-level content or links. The description is announced by screen readers after the step title. -->
        <slot name="description" id="description">${this.description ?? ''}</slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-progress-step': ChickadeeProgressStep;
  }
}
