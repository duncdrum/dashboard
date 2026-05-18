import { LitElement, html, css } from 'lit'
import '@awesome.me/webawesome/dist/components/card/card.js'

export class ExistdbSettings extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 48rem;
    }
  `

  render () {
    return html`
      <wa-card>
        <div slot="header">Settings</div>
        <p>Dashboard settings are not yet available in this release.</p>
        <p>
          Configure eXist-db via <strong>monex</strong>, <strong>Package Manager</strong>, or
          <code>conf.xml</code> on the server.
        </p>
      </wa-card>
    `
  }
}

customElements.define('existdb-settings', ExistdbSettings)
