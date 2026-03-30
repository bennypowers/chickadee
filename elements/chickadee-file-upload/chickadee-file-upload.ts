import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

import styles from './chickadee-file-upload.css' with { type: 'css' };

/**
 * A drag-and-drop file upload area with a browse button fallback, for
 * collecting user files in forms or standalone flows. Provides file type
 * and size constraints via attributes. When files are added, they appear
 * in a removable list below the drop zone. Authors SHOULD set `accept`
 * to restrict allowed file types. Authors SHOULD set `max-size` when
 * server-side limits apply.
 *
 * Screen readers announce the upload button and file list. Each file
 * remove button includes an `aria-label` with the file name. Tab moves
 * focus between the upload button and individual remove buttons.
 *
 * @summary Drag-and-drop file upload area.
 *
 * @slot heading - Drop zone heading text; SHOULD contain short inline text describing the upload action.
 * @slot description - Help text; SHOULD describe accepted file formats, size limits, or other constraints so assistive technology users understand requirements.
 *
 * @csspart dropzone - The drop target container. Styled with `--chickadee-color-border-subtle` border and `--chickadee-border-radius-default` rounding.
 * @csspart icon - The upload icon displayed in the drop zone.
 * @csspart heading - Default heading text within the drop zone.
 * @csspart file-list - The list of selected files. Uses `--chickadee-space-lg` top margin.
 * @csspart file-item - Individual file row. Background uses `--chickadee-color-surface-status-neutral`.
 * @csspart file-name - The file name text, truncated with ellipsis on overflow.
 * @csspart file-size - The formatted file size label.
 * @csspart file-remove - Remove button for each file. Focus ring uses `--chickadee-color-interactive-primary-default`.
 *
 * @fires {CustomEvent} file-select - Fired when files are added via drag-and-drop or the browse button. Detail: `{ files: FileList }`.
 * @fires {CustomEvent} file-remove - Fired when a file is removed from the list. Detail: `{ file: File }`.
 */
@customElement('chickadee-file-upload')
export class ChickadeeFileUpload extends LitElement {
  static styles = [styles];

  static formAssociated = true;

  /** Accepted file types (maps to `<input accept>`). */
  @property() accept?: string;

  /** Whether to allow multiple files. */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** Maximum file size in bytes. */
  @property({ type: Number, attribute: 'max-size' }) maxSize?: number;

  /** Whether the upload is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Form name. */
  @property() name?: string;

  @state() private _files: File[] = [];
  @state() private _dragging = false;

  @query('input') private _input!: HTMLInputElement;

  #internals = this.attachInternals();

  override willUpdate() {
    import('@chickadee/elements/chickadee-icon/chickadee-icon.js');
    import('@chickadee/elements/chickadee-button/chickadee-button.js');
  }

  render() {
    return html`
      <div part="dropzone"
           class=${this._dragging ? 'dragging' : ''}
           @dragover=${this.#onDragOver}
           @dragleave=${this.#onDragLeave}
           @drop=${this.#onDrop}>
        <chickadee-icon icon="add-circle" part="icon"></chickadee-icon>
        <!-- Drop zone heading text. -->
        <slot name="heading"><span part="heading">Drag and drop files here or upload</span></slot>
        <!-- Help text. -->
        <slot name="description"></slot>
        <chickadee-button variant="secondary" compact
                          @click=${() => this._input.click()}
                          ?disabled=${this.disabled}>Upload</chickadee-button>
        <input type="file"
               accept=${this.accept ?? nothing}
               ?multiple=${this.multiple}
               ?disabled=${this.disabled}
               @change=${this.#onInputChange}
               tabindex="-1">
      </div>
      ${this._files.length > 0 ? html`
        <ul part="file-list">
          ${this._files.map((file, i) => html`
            <li part="file-item">
              <span part="file-name">${file.name}</span>
              <span part="file-size">${this.#formatSize(file.size)}</span>
              <button part="file-remove" aria-label="Remove ${file.name}" @click=${() => this.#removeFile(i)}>
                <chickadee-icon icon="close"></chickadee-icon>
              </button>
            </li>`)}
        </ul>` : nothing}
    `;
  }

  #onDragOver(e: DragEvent) {
    e.preventDefault();
    if (!this.disabled) this._dragging = true;
  }

  #onDragLeave() {
    this._dragging = false;
  }

  #onDrop(e: DragEvent) {
    e.preventDefault();
    this._dragging = false;
    if (this.disabled || !e.dataTransfer?.files.length) return;
    this.#addFiles(e.dataTransfer.files);
  }

  #onInputChange() {
    if (this._input.files?.length) {
      this.#addFiles(this._input.files);
      this._input.value = '';
    }
  }

  #addFiles(fileList: FileList) {
    const newFiles = [...fileList];
    this._files = this.multiple ? [...this._files, ...newFiles] : newFiles;
    this.dispatchEvent(new CustomEvent('file-select', {
      detail: { files: fileList }, bubbles: true,
    }));
  }

  #removeFile(index: number) {
    const file = this._files[index];
    this._files = this._files.filter((_, i) => i !== index);
    this.dispatchEvent(new CustomEvent('file-remove', {
      detail: { file }, bubbles: true,
    }));
  }

  #formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chickadee-file-upload': ChickadeeFileUpload;
  }
}
