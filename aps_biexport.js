(function() {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <form id="form">
        <fieldset>
        <legend>biExport Properties</legend>
          <table>
            <tr>
              <td>Server URL</td>
              <td><input id="serverURL" type="text" name="serverURL"></td>
            </tr>
          </table>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    `;

    class BiExportAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        serverURL: this.serverURL
                    }
                }
            }));
            return false;
        }
    
        get serverURL() {
            return this._shadowRoot.getElementById("serverURL").value;
        }
        set serverURL(value) {
            this._shadowRoot.getElementById("serverURL").value = value;
        }

        static get observedAttributes() {
            return ["serverURL"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-biexcellence-openbi-sap-sac-export-aps", BiExportAps);
})();