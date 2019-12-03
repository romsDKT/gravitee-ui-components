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
import { css, LitElement } from 'lit-element';
import { html } from 'lit-html';
import { skeleton } from '../styles';
import '../atoms/gv-metric';
import { classMap } from 'lit-html/directives/class-map';
import { i18n } from '../lib/i18n';

/**
 * Api metrics information component
 *
 * @attr {Promise<ApiMetrics>} metrics - Metrics of an API.
 * @attr {RatingSummary} rating - Ratings of an API.

 */
export class GvMetrics extends LitElement {

  static get properties () {
    return {
      metrics: { type: Object },
      _metrics: { type: Object, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
          .metrics {
              display: flex;
              justify-content: space-evenly;
          }

          .skeleton {
              background-color: #aaa;
              border-color: #777;
              color: transparent;
              transition: 0.5s;
          }
      `,
    ];
  }

  constructor () {
    super();
    this._skeleton = true;
    this._error = false;
  }

  set metrics (metrics) {
    Promise.resolve(metrics)
      .then((metrics) => {
        if (metrics) {
          this._skeleton = false;
          this._empty = Object.keys(metrics).length === 0;
          this._metrics = metrics;
        }
      }).catch(() => {
        this._error = true;
        this._skeleton = false;
      });
  }

  _getSubscribers () {
    if (this._metrics) {
      return this._metrics.subscribers;
    }
    return null;
  }

  _getHits () {
    if (this._metrics) {
      return this._metrics.hits;
    }
    return null;
  }

  _getHealth () {
    if (this._metrics) {
      return !isNaN(this._metrics.health)
        ? Intl.NumberFormat.call(this, navigator.language, { style: 'percent', maximumFractionDigits: 2 }).format(this._metrics.health) 
        : ''
      ;
    }
    return null;
  }

  _renderMetric (icon, name, value) {
    return (value || this._skeleton)
      ? html`<gv-metric .skeleton="${this._skeleton}" icon="${icon}" name="${name}" value="${value}"></gv-metric>`
      : html``;
  }

  render () {
    const modes = {
      skeleton: this.skeleton,
      metrics: true,
    };

    return html`
      <div class=${classMap(modes)}>
        ${this._renderMetric('communication:group', i18n('gv-metrics.subscribers'), this._getSubscribers())}
        ${this._renderMetric('general:cursor', i18n('gv-metrics.hits'), this._getHits())}
        ${this._renderMetric('general:heart', i18n('gv-metrics.health'), this._getHealth())}
      </div>
    `;
  }

}

window.customElements.define('gv-metrics', GvMetrics);