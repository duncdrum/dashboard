import { LitElement, html, css } from 'lit';
import './existdb-settings.js';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/card/card.js';
import '@awesome.me/webawesome/dist/components/button/button.js';

export class ExistdbDashboard extends LitElement {
  static properties = {
    path: { type: String },
    currentPage: { state: true }
  };

  constructor() {
    super();
    this.path = '';
    this.currentPage = 'launcher';
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      margin: 0;
      padding: 0;
      font-family: var(--wa-font-sans);
      color: var(--wa-color-neutral-900);
    }

    .header {
      background: rgb(0, 136, 204);
      color: white;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .drawer-header {
      text-align: center;
      padding: 2rem 1rem;
      border-bottom: 1px solid var(--wa-color-neutral-200);
    }

    .drawer-header img {
      width: 134px;
      margin-bottom: 0.5rem;
    }

    .drawer-header .subitem {
      font-weight: 300;
      font-size: larger;
      letter-spacing: 4.5px;
      color: var(--wa-color-neutral-600);
    }

    .side-nav {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      font: inherit;
      text-align: left;
      cursor: pointer;
      color: inherit;
    }

    .nav-item:hover,
    .nav-item:focus-visible {
      background: var(--wa-color-neutral-100);
    }

    .nav-item[aria-current='page'] {
      background: var(--wa-color-brand-50, #e3f2fd);
    }

    .menu-icon {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }

    .content-area {
      height: calc(100vh - 60px);
      overflow: auto;
      padding: 2rem;
    }

    wa-drawer::part(panel) {
      width: 256px;
    }

    wa-drawer::part(body) {
      padding: 0;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._onHashChange = () => this._handleRouteChange();
    window.addEventListener('hashchange', this._onHashChange);
    this._handleRouteChange();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._onHashChange);
  }

  _handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/launcher';
    const page = hash.replace('/', '');
    if (page && page !== this.currentPage) {
      this.currentPage = page;
    }
  }

  _navigateTo(page) {
    this.currentPage = page;
    window.location.hash = `/${page}`;
    this.shadowRoot.querySelector('wa-drawer').hide();
  }

  _navItem(page, label, content) {
    const current = this.currentPage === page ? 'page' : undefined;
    return html`
      <button
        type="button"
        class="nav-item"
        aria-current=${current}
        @click=${() => this._navigateTo(page)}
      >
        ${content} ${label}
      </button>
    `;
  }

  render() {
    return html`
      <wa-drawer label="Dashboard" placement="start" class="drawer-placement-start">
        <div slot="label" class="drawer-header">
          <img src="resources/images/existdb-web.svg" alt="eXist-db" />
          <div class="subitem">Dashboard</div>
        </div>

        <nav class="side-nav">
          ${this._navItem(
            'launcher',
            'Launcher',
            html`<img class="menu-icon" src="resources/images/launcher.svg" alt="" />`
          )}
          ${this._navItem(
            'packagemanager',
            'Package Manager',
            html`<wa-icon name="grid-fill"></wa-icon>`
          )}
          ${this._navItem(
            'usermanager',
            'User Manager',
            html`<wa-icon name="people-fill"></wa-icon>`
          )}
          ${this._navItem('backup', 'Backup', html`<wa-icon name="arrow-clockwise"></wa-icon>`)}
          ${this._navItem('settings', 'Settings', html`<wa-icon name="gear-fill"></wa-icon>`)}
          <button
            type="button"
            class="nav-item"
            @click=${() => {
              globalThis.location.href = 'index.html?logout=true';
            }}
          >
            <img class="menu-icon" src="resources/images/logout.svg" alt="" />
            Logout
          </button>
        </nav>
      </wa-drawer>

      <div class="header">
        <wa-button @click=${() => this.shadowRoot.querySelector('wa-drawer').show()}>
          <wa-icon name="list"></wa-icon>
        </wa-button>
        <h1>eXist-db Dashboard</h1>
      </div>

      <div class="content-area">${this._renderPage()}</div>
    `;
  }

  _renderPage() {
    switch (this.currentPage) {
      case 'launcher':
        return html`
          <existdb-launcher-app
            ignores='["packagemanager","packageservice","launcher","usermanager","dashboard"]'
            show-branding="false"
          >
          </existdb-launcher-app>
        `;
      case 'packagemanager':
        return html`<existdb-packagemanager logout="false"></existdb-packagemanager>`;
      case 'usermanager':
        return html`<existdb-usermanager-app logout="false"></existdb-usermanager-app>`;
      case 'backup':
        return html`<existdb-backup-app logout="false"></existdb-backup-app>`;
      case 'settings':
        return html`<existdb-settings></existdb-settings>`;
      default:
        return html`
          <wa-card>
            <div slot="header">Page Not Found</div>
            <p>The page "${this.currentPage}" does not exist.</p>
          </wa-card>
        `;
    }
  }
}

customElements.define('existdb-dashboard', ExistdbDashboard);
