import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

setBasePath('/node_modules/@shoelace-style/shoelace/dist/');

class ExistdbDashboard extends LitElement {
  static properties = {
    path: { type: String },
    currentPage: { state: true },
    componentLoaded: { state: true }
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
      font-family: var(--sl-font-sans);
      color: var(--sl-color-neutral-900);
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
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .drawer-header img {
      width: 134px;
      margin-bottom: 0.5rem;
    }

    .drawer-header .subitem {
      font-weight: 300;
      font-size: larger;
      letter-spacing: 4.5px;
      color: var(--sl-color-neutral-600);
    }

    sl-menu {
      --sl-spacing-medium: 0;
    }

    sl-menu-item {
      --padding: 0.75rem 1rem;
    }

    sl-menu-item::part(base) {
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

    sl-drawer::part(panel) {
      width: 256px;
    }

    sl-drawer::part(body) {
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
    if (this.componentLoaded[page]) return;

    const componentMap = {
      'launcher': { tag: 'existdb-launcher-app', src: 'bower_components/existdb-launcher/existdb-launcher.js' },
      'packagemanager': { tag: 'existdb-packagemanager', src: 'bower_components/existdb-packagemanager/existdb-packagemanager.js' },
      'usermanager': { tag: 'existdb-usermanager-app', src: 'bower_components/existdb-usermanager/existdb-usermanager.js' },
      'backup': { tag: 'existdb-backup-app', src: 'bower_components/existdb-backup/existdb-backup.js' },
      'settings': { tag: 'existdb-settings', src: 'existdb-settings.js' }
    };

    const component = componentMap[page];
    if (component && !customElements.get(component.tag)) {
      import(component.src).then(() => {
        this.componentLoaded = { ...this.componentLoaded, [page]: true };
      }).catch(err => {
        console.error(`Failed to load component: ${page}`, err);
      });
    } else {
      this.componentLoaded = { ...this.componentLoaded, [page]: true };
    }
  }

  _navigateTo(page) {
    this.currentPage = page;
    window.location.hash = `/${page}`;
    this._loadComponent(page);
    this.shadowRoot.querySelector('sl-drawer').hide();
  }

  _logout() {
    window.location.href = 'index.html?logout=true';
  }

  render() {
    return html`
      <sl-drawer label="Dashboard" placement="start" class="drawer-placement-start">
        <div slot="label" class="drawer-header">
          <img src="resources/images/existdb-web.svg" alt="eXist-db">
          <div class="subitem">Dashboard</div>
        </div>

        <sl-menu>
          <sl-menu-item @click=${() => this._navigateTo('launcher')}>
            <img slot="prefix" class="menu-icon" src="resources/images/launcher.svg" alt="">
            Launcher
          </sl-menu-item>
          <sl-menu-item @click=${() => this._navigateTo('packagemanager')}>
            <sl-icon slot="prefix" name="grid-fill"></sl-icon>
            Package Manager
          </sl-menu-item>
          <sl-menu-item @click=${() => this._navigateTo('usermanager')}>
            <sl-icon slot="prefix" name="people-fill"></sl-icon>
            User Manager
          </sl-menu-item>
          <sl-menu-item @click=${() => this._navigateTo('backup')}>
            <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
            Backup
          </sl-menu-item>
          <sl-menu-item @click=${() => this._navigateTo('settings')}>
            <sl-icon slot="prefix" name="gear-fill"></sl-icon>
            Settings
          </sl-menu-item>
          <sl-menu-item @click=${this._logout}>
            <img slot="prefix" class="menu-icon" src="resources/images/logout.svg" alt="">
            Logout
          </sl-menu-item>
        </sl-menu>
      </sl-drawer>

      <div class="header">
        <sl-icon-button name="list" label="Menu" @click=${() => this.shadowRoot.querySelector('sl-drawer').show()}></sl-icon-button>
        <h1>eXist-db Dashboard</h1>
      </div>

      <div class="content-area">
        ${this._renderPage()}
      </div>
    `;
  }

  _renderPage() {
    if (!this.componentLoaded[this.currentPage]) {
      return html`
        <div class="loading">
          <sl-spinner style="font-size: 3rem;"></sl-spinner>
        </div>
      `;
    }

    switch (this.currentPage) {
      case 'launcher':
        return html`
          <existdb-launcher-app 
            ignores='["packagemanager","packageservice","launcher","usermanager","dashboard"]'
            show-branding="false">
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
          <sl-card>
            <div slot="header">Page Not Found</div>
            <p>The page "${this.currentPage}" does not exist.</p>
          </sl-card>
        `;
    }
  }
}

customElements.define('existdb-dashboard', ExistdbDashboard);
