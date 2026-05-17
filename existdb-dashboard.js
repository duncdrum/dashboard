import { LitElement, html, css } from 'lit';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import '@awesome.me/webawesome/dist/components/menu/menu.js';
import '@awesome.me/webawesome/dist/components/menu-item/menu-item.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/icon-button/icon-button.js';
import '@awesome.me/webawesome/dist/components/spinner/spinner.js';
import '@awesome.me/webawesome/dist/components/card/card.js';
import '@awesome.me/webawesome/dist/components/alert/alert.js';
import { setBasePath } from '@awesome.me/webawesome/dist/webawesome.js';

setBasePath('/node_modules/@awesome.me/webawesome/dist/');

class ExistdbDashboard extends LitElement {
  static properties = {
    path: { type: String },
    currentPage: { state: true },
    componentLoaded: { state: true },
  };

  constructor() {
    super();
    this.path = '';
    this.currentPage = 'launcher';
    this.componentLoaded = {};
    this._loadComponent('launcher');
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

    wa-menu {
      --wa-spacing-medium: 0;
    }

    wa-menu-item {
      --padding: 0.75rem 1rem;
    }

    wa-menu-item::part(base) {
      padding: var(--padding);
    }

    .menu-icon {
      width: 36px;
      height: 36px;
      margin-right: 8px;
    }

    .content-area {
      height: calc(100vh - 60px);
      overflow: auto;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
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
    window.addEventListener('hashchange', () => this._handleRouteChange());
    this._handleRouteChange();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', () => this._handleRouteChange());
  }

  _handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/launcher';
    const page = hash.replace('/', '');
    if (page && page !== this.currentPage) {
      this.currentPage = page;
      this._loadComponent(page);
    }
  }

  _loadComponent(page) {
    // Sub-components are loaded via HTML imports in admin.xql
    // Mark them as loaded immediately
    this.componentLoaded = { ...this.componentLoaded, [page]: true };
  }

  _navigateTo(page) {
    this.currentPage = page;
    window.location.hash = `/${page}`;
    this._loadComponent(page);
    this.shadowRoot.querySelector('wa-drawer').hide();
  }

  _logout() {
    window.location.href = 'index.html?logout=true';
  }

  render() {
    return html`
      <wa-drawer label="Dashboard" placement="start" class="drawer-placement-start">
        <div slot="label" class="drawer-header">
          <img src="resources/images/existdb-web.svg" alt="eXist-db" />
          <div class="subitem">Dashboard</div>
        </div>

        <wa-menu>
          <wa-menu-item @click=${() => this._navigateTo('launcher')}>
            <img slot="start" class="menu-icon" src="resources/images/launcher.svg" alt="" />
            Launcher
          </wa-menu-item>
          <wa-menu-item @click=${() => this._navigateTo('packagemanager')}>
            <wa-icon slot="start" name="grid-fill"></wa-icon>
            Package Manager
          </wa-menu-item>
          <wa-menu-item @click=${() => this._navigateTo('usermanager')}>
            <wa-icon slot="start" name="people-fill"></wa-icon>
            User Manager
          </wa-menu-item>
          <wa-menu-item @click=${() => this._navigateTo('backup')}>
            <wa-icon slot="start" name="arrow-clockwise"></wa-icon>
            Backup
          </wa-menu-item>
          <wa-menu-item @click=${() => this._navigateTo('settings')}>
            <wa-icon slot="start" name="gear-fill"></wa-icon>
            Settings
          </wa-menu-item>
          <wa-menu-item @click=${this._logout}>
            <img slot="start" class="menu-icon" src="resources/images/logout.svg" alt="" />
            Logout
          </wa-menu-item>
        </wa-menu>
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
    if (!this.componentLoaded[this.currentPage]) {
      return html`
        <div class="loading">
          <wa-spinner style="font-size: 3rem;"></wa-spinner>
        </div>
      `;
    }

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
