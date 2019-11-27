/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { classMap } from 'lit-html/directives/class-map.js';
import { LitElement, html, css } from 'lit-element';

/**
 * @attr {String} type - type of the message. Can be info (Default), success or error.
*/

export class GvMessage extends LitElement {

  static get properties () {
    return {
      type: { type: String },
    };
  }

  static get styles () {
    return [
      // language=CSS
      css`        
          :host {
            box-sizing: border-box;
            display: inline-block;
            margin: 0.2rem;
            vertical-align: middle;
          }
          /* BASE */
          div {
              border: 1px solid black;
              box-sizing: border-box;
              border-radius: 4px;
              font-style: normal;
              font-weight: normal;
              line-height: normal;
              padding: 12px 8px;
          }

          /* COLOR */
          div.info {
            border-color: #1D3730;
            background-color: #FAFAFA;
            color: #1D3730;
          }

          div.success {
            border-color: #193E34;
            background-color: #D5FDCB;
            color: #193E34;
          }

          div.error {
            border-color: #820014;
            background-color: #FFCCC7;
            color: #820014;
          }
      `,
    ];
  }

  render () {

    const modes = {
      info: (!this.type || (this.type !== 'success' && this.type !== 'error')),
      success: (this.type === 'success'),
      error: (this.type === 'error'),
    };

    return html`
      <div class=${classMap(modes)}>
        <slot></slot>
      </div>
    `;
  }

}

window.customElements.define('gv-message', GvMessage);