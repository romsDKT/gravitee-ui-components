import{classMap as o}from"lit-html/directives/class-map.js";import{LitElement as t,html as e,css as r}from"lit-element";import{skeleton as n}from"../styles/skeleton.js";export class GvButton extends t{static get properties(){return{disabled:{type:Boolean},primary:{type:Boolean},outlined:{type:Boolean},skeleton:{type:Boolean}}}static get styles(){return[n,r`:host{box-sizing:border-box;display:inline-block;margin:.2rem;vertical-align:top}button{background:#fff;border:1px solid #000;display:block;font-size:14px;font-family:inherit;margin:0;padding:0 .5rem;border-radius:.15rem;cursor:pointer;font-weight:700;min-height:2rem;text-transform:uppercase;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;width:100%;background-color:var(--btn-color);border-color:var(--btn-color);color:#fff;box-shadow:0 0 0 0 rgba(255,255,255,0);transition:75ms ease-in-out}button.default{--btn-color:var(--btn-default, #009B5B)}button.primary{--btn-color:var(--btn-primary, #193E34)}button.outlined{background-color:#fff;color:var(--btn-color)}button.simple{border-color:#aaa}button:enabled:focus{box-shadow:0 0 0 .2em rgba(50,115,220,.25);outline:0}button:enabled:hover{box-shadow:0 1px 3px #888}button:enabled:active{box-shadow:none;outline:0}button:disabled{cursor:default;opacity:.5}button.skeleton{background-color:#aaa;border-color:#777;color:transparent}button::-moz-focus-inner{border:0}`]}render(){const t={primary:this.primary,skeleton:this.skeleton,default:!this.primary,outlined:this.outlined};return e`<button type="button" class="${o(t)}" .disabled="${this.disabled||this.skeleton}"><slot></slot></button>`}}window.customElements.define("gv-button",GvButton);
//# sourceMappingURL=gv-button.js.map