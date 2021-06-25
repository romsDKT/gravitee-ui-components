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
import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import '../atoms/gv-link';
import '../organisms/gv-vertical-menu'
import { until } from 'lit-html/directives/until';
import { isSameRoutes } from '../lib/utils';
import { dispatchCustomEvent } from '../lib/events';
import { classMap } from 'lit-html/directives/class-map';

/**
 * A main nav
 *
 * ## Details
 * * has @theme facet
 *
 * @fires gv-nav:click - Custom event when nav item is clicked
 *
 * @attr {Array<{active: Boolean, icon: String, path: String, title: Promise<String>, target: String}>} routes - definition of routes
 */
export class GvNav extends LitElement {
  static get properties() {
    return {
      routes: { type: Array },
      _routes: { type: Array },
      small: { type: Boolean },
      _compact: { type: Boolean, attribute: false },
      vertical: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        nav {
          position: relative;
          display: flex;
          transition: all 150ms ease-in-out;
        }

        .container {
        display: flex;
        flex-direction: column;
        width: fit-content;
        margin: 10px;
        }

        gv-link {
          --gv-link--ta: end;
        }

        .vertical {
          display: flex;
          flex-direction: column;
        }

        .vertical gv-link {
          width: 100%;
        }

        .compact {
          --gv-link-a--ph: 10px;
        }

        #shadowLink {
          position: absolute;
          display: inline-flex;
          opacity: 0.5;
          top: 0;
          left: 0;
          transition: transform 250ms ease-in-out, width 250ms;
        }

        .notSelected {
          display: none !important;
        }
      `,
    ];
  }

  _onClick(event) {
    event.stopPropagation();
    const { detail } = event;
    const { title, target } = detail;
    // console.log("title," {title})
    if (target === '_blank') {
      dispatchCustomEvent(this, 'click', detail);
    } else {
      if (!this._isLocked) {
        this._isLocked = true;
        let nextIndex = 0;
        this._routes.forEach((route, index) => {
          console.log('route -> ', route, 'index -> ', index)
          console.log("route.title ->", route.title, 'title', title)
          if (route.title === title) {
            route.active = true;
            nextIndex = index;
          } else {
            delete route.active;
          }
          return route;
        });

        const activeLink = this.shadowRoot.querySelector('gv-link[active]');
        const nextLink = this.shadowRoot.querySelectorAll('gv-link')[nextIndex];
        if (activeLink) {
          console.log('activeLink , ', activeLink)
          const shadowLink = activeLink.cloneNode(true);
          const { height, width } = activeLink.getBoundingClientRect();

          shadowLink.id = 'shadowLink';
          shadowLink.style.top = `${activeLink.offsetTop}px`;
          shadowLink.style.left = `${activeLink.offsetLeft}px`;
          shadowLink.style.width = `${width}px`;
          shadowLink.style.height = `${height}px`;

          activeLink.removeAttribute('active');
          activeLink.style.height = `${height}px`;

          this.shadowRoot.querySelector('nav').prepend(shadowLink);
          const left = nextLink.offsetLeft - activeLink.offsetLeft;
          const top = nextLink.offsetTop - activeLink.offsetTop;

          shadowLink.style.transform = `translate(${left}px,${top}px)`;

          setTimeout(() => {
            nextLink.setAttribute('active', true);
            console.log("'nextLink '", nextLink)
            this.shadowRoot.querySelector('nav').removeChild(shadowLink);
            this._isLocked = false;
            dispatchCustomEvent(this, 'click', detail);
          }, 250);
        } else {
          nextLink.setAttribute('active', true);
          this._isLocked = false;
          dispatchCustomEvent(this, 'click', detail);
        }
      }
    }
  }

  constructor() {
    super();
    /** @protected */
    this._routes = [];
    this.navRoutes = [];
    this.routesInGroups = [];
    this.allRoutes = [...this.navRoutes, ...this.routesInGroups];
    this.vertical = false;
  }

  set routes(routes) {
    if (routes) {
      Promise.resolve(routes).then((_routes) => {
        if (!isSameRoutes(this._routes, _routes)) {
          this._routes = _routes;
        }
      });
    }
  }

  _getLink(route, index) {
    return Promise.resolve(route)
      .then((_route) => {
        return html` <gv-link
          @gv-link:click=${this._onClick}
          .active="${_route.active}"
          .icon="${_route.icon}"
          .path="${_route.path}"
          .target="${_route.target}"
          ?small="${this.small}"
          .title="${_route.title}"
          .help="${until(_route.help, null)}"
          ?vertical="${this.vertical}"
        ></gv-link>`;
      })
      .catch(() => {
        delete this.allRoutes[index];
      });
  }

  updated(_changedProperties) {
    if (_changedProperties.has('_routes')) {
      this._compact = this._routes && this._routes.length > 5;
    }
  }

  getRouteGroups() {
    const groups = [];
    const regex = /^\/(?<groupToCreate>[a-zA-Z0-9]+)\/.*/g
    this._routes.forEach(route => {
      if (route.path.match(regex)) {
        const { groups: { groupToCreate } } = /^\/(?<groupToCreate>[a-zA-Z0-9]+)\/.*/g.exec(route.path);
        if (!this.routesInGroups.includes(route)) {
          this.routesInGroups.push(route)
        }
        if (!groups.includes(groupToCreate)) {
          groups.push(groupToCreate)
        }
      } else {
        if (!this.navRoutes.includes(route))
          this.navRoutes.push(route)
      }
    })
    return groups;
  }

  render() {
    const groups = this.getRouteGroups();
    const itemsTemplates = [];
    if (groups) {
      for (let i = 0; i < groups.length; i++) {
        itemsTemplates.push(html`
        <div class='container'> ${groups[i]}
        ${repeat(
          this.routesInGroups.filter(route => route.path.includes(groups[i])),
          (route) => route,
          (route, index) => until(this._getLink(route, index), html`<gv-link class="${this.notSelected}" skeleton .vertical="${this.vertical}"></gv-link>`),
        )}
        </div>
        `)
      }
    }
    if (this._routes) {
      itemsTemplates.push(html`
        ${repeat(
        this.navRoutes,
        (route) => route,
        (route, index) => until(this._getLink(route, index), html`<gv-link skeleton .vertical="${this.vertical}"></gv-link>`),
      )}
`)
    }

    return html`<nav class="${classMap({ compact: this._compact, vertical: this.vertical })}">
    ${itemsTemplates}
    </nav>`;
  }
}

window.customElements.define('gv-nav', GvNav);

