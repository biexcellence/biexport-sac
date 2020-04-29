(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
          fieldset {
              margin-bottom: 10px;
              border: 1px solid #afafaf;
              border-radius: 3px;
          }
          table {
              width: 100%;
          }
          input, textarea, select {
              font-family: "72",Arial,Helvetica,sans-serif;
              width: 100%;
              padding: 4px;
              box-sizing: border-box;
              border: 1px solid #bfbfbf;
          }
          input[type=checkbox] {
              width: inherit;
              margin: 6px 3px 6px 0;
              vertical-align: middle;
          }
      </style>
      <form id="form" autocomplete="off">
        <fieldset>
          <legend>General</legend>
          <table>
            <tr>
              <td><label for="serverURL">Server URL</label></td>
              <td><input id="serverURL" name="serverURL" type="text"></td>
            </tr>
            <tr>
              <td><label for="licenseKey">License Key</label></td>
              <td><input id="licenseKey" name="licenseKey" type="text"></td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Notification Editor</legend>
          <table>
            <tr>
              <td colspan="2"><slot name="notifcationHtml"></slot></td>
            </tr>
          </table>
        </fieldset>
        <button type="submit" hidden>Submit</button>
      </form>
    `;

    class BiNotificationAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));

            // visible components
            let slotId = "notifcationHtml";
            let id = "notificationBody;
                
            let textEditor = new sap.ui.richtexteditor.RichTextEditor({
                editorType: EditorType.TinyMCE4,
                width: "100%",
                height: "600px",
                customToolbar: true,
                showGroupFont: true,
                showGroupLink: true,
                showGroupInsert: true,
                value: sHtmlValue,
                ready: function () {
                    this.addButtonGroup("styleselect").addButtonGroup("table");
                }
            });

                let excludeSlot = document.createElement("div");
                excludeSlot.slot = slotId;
                this.appendChild(excludeSlot);

            textEditor.addStyleClass("sapUiSizeCompact");
            textEditor.placeAt(excludeSlot);
        }

        connectedCallback() {
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of BiNotificationAps.observedAttributes) {
                properties[name] = this[name];
            }
            this._firePropertiesChanged(properties);
            return false;
        }
        _change(e) {
            this._changeProperty(e.target.name);
        }
        _changeProperty(name) {
            let properties = {};
            properties[name] = this[name];
            this._firePropertiesChanged(properties);
        }

        _firePropertiesChanged(properties) {
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        get serverURL() {
            return this.getValue("serverURL");
        }
        set serverURL(value) {
            this.setValue("serverURL", value);
        }

        get licenseKey() {
            return this.getValue("licenseKey");
        }
        set licenseKey(value) {
            this.setValue("licenseKey", value);
        }

        getValue(id) {
            return this._shadowRoot.getElementById(id).value;
        }
        setValue(id, value) {
            this._shadowRoot.getElementById(id).value = value;
        }

        getBooleanValue(id) {
            return this._shadowRoot.getElementById(id).checked;
        }
        setBooleanValue(id, value) {
            this._shadowRoot.getElementById(id).checked = value;
        }

        static get observedAttributes() {
            return [
                "serverURL",
                "licenseKey",
                "notifcationBody"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-biexcellence-openbi-sap-sac-notification-aps", BiNotificationAps);
})();