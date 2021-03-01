import { LitElement, html, css } from 'lit-element';
import '../atoms/gv-icon';
import { dispatchCustomEvent } from '../lib/events';

/**
 * A modal that shows up on top of your page
 *
 * @fires gv-modal:closed - Event fired when modal is closed.
 *
 * @cssprop {Length} [--gv-modal-animation-duration=0.3s ] - Duration of the animation
 * @cssprop {Length} [--gv-modal-z-index=100 ] - z-index for modal
 * @cssprop {Color} [--gv-modal-bgc=rgba(30, 30, 30, 0.6) ] - Modal background color
 * @cssprop {Length} [--gv-modal-content-z-index=101 ] - z-index for modal content
 * @cssprop {Length} [--gv-modal-width=280px ] - model width
 * @cssprop {Length} [--gv-modal-min-width=250px ] - modal min-width
 * @cssprop {Length} [--gv-modal-max-width=100vw ] - modal max-width
 * @cssprop {Length} [--gv-modal-height=auto ] - modal height
 * @cssprop {Length} [--gv-modal-min-height=auto ] - modal min height
 * @cssprop {Length} [--gv-modal-max-height=100vh ] - modal max height
 * @cssprop {Color} [--gv-modal-content-bgc=var(--gv-theme-neutral-color-light, #efefef) ] - Modal content background color
 * @cssprop {Length} [--gv-modal-content-shadow-displacement=0px ] - Modal shadow displacement
 * @cssprop {Length} [--gv-modal-content-shadow-blur=16px ] - Modal shadow blur
 * @cssprop {Color} [--gv-modal-content-shadow-color=#383e3f ] - Modal shadow color
 * @cssprop {Length} [--gv-modal-border-radius=4px ] - Modal border radius
 * @cssprop {Length} [--gv-modal-content-padding=1em ] - Modal content padding
 * @cssprop {Length} [--gv-modal-close-icon-s=24px ] - Modal close icon size
 * @cssprop {Color} [--gv-modal-close-icon-c=red ] - Modal close icon size
 */
export class GvModal extends LitElement {
  static get properties() {
    return {
      _toChange: { type: Boolean },
      /**
       * If true the modal box is in opened status.
       */
      opened: { type: Boolean },
      /**
       * If true the modal box displays a close icon
       */
      showCloseIcon: { type: Boolean },
      /**
       * The title of the modal dialog
       */
      // ⚠️ it cannot be simply named `title` otherwise the browser consider it
      // as a `title` property and use it to display a tooltip
      modalTitle: { type: String },
      /**
       * If true the modal box blocks the screen. That is, when you click in the background layer, the modal box do not close.
       */
      blocking: { type: Boolean },
    };
  }

  constructor() {
    super();
    this._toChange = false;
    this.opened = false;
    this.showCloseIcon = false;
    this.blocking = false;
  }

  static get styles() {
    return [
      // language=css
      css`
        * {
          box-sizing: border-box;
        }
        :host {
          display: block;
        }
        section {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 100vw;
          display: none;
          transition: opacity var(--gv-modal-animation-duration, 0.3s) ease-in;
          -webkit-transition: opacity var(--gv-modal-animation-duration, 0.3s) ease-in;
          align-items: center;
          justify-content: center;
          z-index: var(--gv-modal-z-index, 100);
          background-color: var(--gv-modal-bgc, rgba(30, 30, 30, 0.6));
        }
        .content {
          display: block;
          position: relative;
          z-index: var(--gv-modal-content-z-index, 101);
          width: var(--gv-modal-width, 280px);
          min-width: var(--gv-modal-min-width, 250px);
          max-width: var(--gv-modal-max-width, 100vw);
          height: var(--gv-modal-height, auto);
          min-height: var(--gv-modal-min-height, auto);
          max-height: var(--gv-modal-max-height, 100vh);
          background-color: var(--gv-modal-content-bgc, var(--gv-theme-neutral-color-light, #efefef));
          box-shadow: var(--gv-modal-content-shadow-displacement, 0px) var(--gv-modal-content-shadow-displacement, 0px)
            var(--gv-modal-content-shadow-blur, 16px) var(--gv-modal-content-shadow-color, #383e3f);
          border-radius: var(--gv-modal-border-radius, 4px);
          padding: var(--gv-modal-content-padding, 1em);
        }
        article {
          overflow: auto;
          max-height: 100%;
          height: 100%;
        }
        .transparent {
          opacity: 0;
        }
        .opaque {
          opacity: 1;
          display: flex !important;
        }
        .opened {
          display: flex !important;
        }
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
        }
        .title {
          font-weight: bold;
          font-size: large;
        }
        gv-icon {
          --gv-icon--s: var(--gv-modal-close-icon-s, 24px);
          --gv-icon--c: var(--gv-modal-close-icon-c, red);

          display: inline-block;
          z-index: 1002;
          cursor: pointer;
        }
      `,
    ];
  }

  render() {
    return html`
      <section
        class="${this.getModalClass(this.opened, this._toChange)}"
        @click="${this._backgroundModalClick}"
        @transitionend="${this.animationEnd}"
      >
        <div class="content" @click="${this.contentClick}">
          <div class="header">
            <span class="title">${this.modalTitle}</span>
            ${this.showCloseIcon ? html`<gv-icon shape="general:close" @click="${this.close}"></gv-icon>` : ''}
          </div>
          <article>
            <slot></slot>
          </article>
        </div>
      </section>
    `;
  }

  getModalClass(opened, _toChange) {
    if (!opened && !_toChange) {
      return 'transparent';
    }
    if (opened && _toChange) {
      return 'transparent opened';
    }
    if (opened && !_toChange) {
      return 'opaque';
    }
    if (!opened && _toChange) {
      return 'transparent opened';
    }
  }

  open() {
    this.opened = true;
    this._toChange = true;
    setTimeout(() => {
      this._toChange = false;
    }, 50);
  }

  _backgroundModalClick(e) {
    if (!this.blocking) {
      this.close();
      dispatchCustomEvent(this, 'closed');
    }
  }

  close() {
    this.opened = false;
    this._toChange = true;
    dispatchCustomEvent(this, 'closed');
  }

  animationEnd() {
    this._toChange = false;
  }

  contentClick(e) {
    e.stopPropagation();
  }
}
window.customElements.define('gv-modal', GvModal);