(function () {
    let tmpl = document.createElement('template');
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
          </table>
        </fieldset>
        <fieldset>
          <legend>Export</legend>
          <table>
            <tr>
              <td><label for="parseCss">Parse CSS</label></td>
              <td><input id="parseCss" name="parseCss" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="screenWidth">Static Width</label></td>
              <td><input id="screenWidth" name="screenWidth" type="number" step="1"></td>
            </tr>
            <tr>
              <td><label for="screenHeight">Static Height</label></td>
              <td><input id="screenHeight" name="screenHeight" type="number" step="1"></td>
            </tr>
            <tr>
              <td><label for="exportLanguage">Language</label></td>
              <td><input id="exportLanguage" name="exportLanguage" type="text" placeholder="Using client language if emtpy"></td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>PDF</legend>
          <table>
            <tr>
              <td><label for="pdfTemplate">Template</label></td>
              <td><input id="pdfTemplate" name="pdfTemplate" type="text"></td>
            </tr>
            <tr>
              <td colspan="2">
                <details id="pdfExclude">
                  <summary>Visible Components</summary>
                </details>
              </td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>PowerPoint</legend>
          <table>
            <tr>
              <td><label for="pptSeparate">One component per Slide</label></td>
              <td><input id="pptSeparate" name="pptSeparate" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="pptTemplate">Template</label></td>
              <td><input id="pptTemplate" name="pptTemplate" type="text"></td>
            </tr>
            <tr>
              <td colspan="2">
                <details id="pptExclude">
                  <summary>Visible Components</summary>
                </details>
              </td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Word</legend>
          <table>
            <tr>
              <td><label for="docTemplate">Template</label></td>
              <td><input id="docTemplate" name="docTemplate" type="text"></td>
            </tr>
            <tr>
              <td colspan="2">
                <details id="docExclude">
                  <summary>Visible Components</summary>
                </details>
              </td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Excel</legend>
          <table>
            <tr>
              <td><label for="xlsTemplate">Template</label></td>
              <td><input id="xlsTemplate" name="xlsTemplate" type="text"></td>
            </tr>
            <tr>
              <td colspan="2">
                <details id="xlsExclude">
                  <summary>Visible Components</summary>
                </details>
              </td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Publishing</legend>
          <table>
            <tr>
              <td><label for="publishMode">Publish Mode</label></td>
              <td><input id="publishMode" name="publishMode" type="text"></td>
            </tr>
            <tr>
              <td><label for="publishSync">Publish Sync</label></td>
              <td><input id="publishSync" name="publishSync" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="filename">Filename</label></td>
              <td><input id="filename" name="filename" type="text"></td>
            </tr>
            <tr>
              <td><label for="mailFrom">Mail From</label></td>
              <td><input id="mailFrom" name="mailFrom" type="text"></td>
            </tr>
            <tr>
              <td><label for="mailTo">Mail To</label></td>
              <td><input id="mailTo" name="mailTo" type="text"></td>
            </tr>
            <tr>
              <td><label for="mailSubject">Mail Subject</label></td>
              <td><input id="mailSubject" name="mailSubject" type="text"></td>
            </tr>
            <tr>
              <td><label for="mailBody">Mail Body</label></td>
              <td><textarea id="mailBody" name="mailBody"></textarea></td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Background Execution</legend>
          <table>
            <tr hidden>
              <td><label for="oauthId">OAuth Client</label></td>
              <td><select id="oauthId" name="oauthId"><option value=""> - </option></select></td>
            </tr>
            <tr>
              <td><label for="oauthClientId">OAuth Client Id</label></td>
              <td><input id="oauthClientId" name="oauth" type="text"></td>
            </tr>
            <tr>
              <td><label for="oauthClientSecret">OAuth Client Secret</label></td>
              <td><input id="oauthClientSecret" name="oauth" type="password"></td>
            </tr>
            <tr>
              <td><label for="oauthClientRedirectURL">OAuth Client Redirect URL</label></td>
              <td><input id="oauthClientRedirectURL" name="oauth" type="text"></td>
            </tr>
            <tr>
              <td><label for="oauthAuthorizationURL">OAuth Authorization URL</label></td>
              <td><input id="oauthAuthorizationURL" name="oauth" type="text"></td>
            </tr>
            <tr>
              <td><label for="oauthTokenURL">OAuth Token URL</label></td>
              <td><input id="oauthTokenURL" name="oauth" type="text"></td>
            </tr>
            <tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Display</legend>
          <table>
            <tr>
              <td><label for="showTexts">Show Texts</label></td>
              <td><input id="showTexts" name="showTexts" type="checkbox"></td>
             </tr>
            <tr>
              <td><label for="showIcons">Show Icons</label></td>
              <td><input id="showIcons" name="showIcons" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="showComponentSelector">Show Component Selector</label></td>
              <td><input id="showComponentSelector" name="showComponentSelector" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="showViewSelector">Show View Selector</label></td>
              <td><input id="showViewSelector" name="showViewSelector" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="enablePpt">Enable PowerPoint</label></td>
              <td><input id="enablePpt" name="enablePpt" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="enableDoc">Enable Word</label></td>
              <td><input id="enableDoc" name="enableDoc" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="enablePdf">Enable PDF</label></td>
              <td><input id="enablePdf" name="enablePdf" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="enableXls">Enable Excel</label></td>
              <td><input id="enableXls" name="enableXls" type="checkbox"></td>
            </tr>
            <tr>
              <td><label for="enableCsv">Enable CSV</label></td>
              <td><input id="enableCsv" name="enableCsv" type="checkbox"></td>
            </tr>
          </table>
        </fieldset>
        <button type="submit" hidden>Submit</button>
      </form>
    `;

    class BiExportAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));


            this._hoverDiv = document.createElement("div");
            this._hoverDiv.style.border = "5px solid lime";
            this._hoverDiv.style.position = "absolute";
            this._hoverDiv.style.boxSizing = "border-box";
            this._hoverDiv.style.display = "none";

            let hoverDivVisible = false;

            ["pdfExclude", "pptExclude", "docExclude", "xlsExclude"].forEach(id => {
                this._shadowRoot.getElementById(id).addEventListener("change", this._visibleComponentsChange.bind(this));

                this._shadowRoot.getElementById(id).addEventListener("mouseover", e => {
                    if (!hoverDivVisible && e.target.tagName == "LABEL") {
                        let input = e.target.querySelector("input");
                        let id = input.id;

                        let target = document.querySelector("[data-sap-widget-id='" + id + "']");
                        if (target) {
                            let rect = target.getBoundingClientRect();

                            this._hoverDiv.style.top = rect.top + "px";
                            this._hoverDiv.style.left = rect.left + "px";
                            this._hoverDiv.style.width = rect.width + "px";
                            this._hoverDiv.style.height = rect.height + "px";
                            this._hoverDiv.style.display = "block";

                            if (!this._hoverDiv.parentElement) {
                                document.body.appendChild(this._hoverDiv);
                            }

                            hoverDivVisible = true;
                        }
                    }
                });

                this._shadowRoot.getElementById(id).addEventListener("mouseout", e => {
                    if (hoverDivVisible && e.target.tagName == "LABEL") {
                        this._hoverDiv.style.display = "none";

                        hoverDivVisible = false;
                    }
                });
            });
        }

        connectedCallback() {
            fetch("/oauthservice/api/v1/oauthclient?tenant=" + window.TENANT).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Failed to get oauth clients: " + response.status)
            }).then(oauthClients => {
                let selectEle = this._shadowRoot.getElementById("oauthId");
                let clientId = this.getValue("oauthClientId");
                while (selectEle.options.length > 1) {
                    selectEle.options.remove(1);
                }

                oauthClients.forEach(oauthClient => {
                    if (oauthClient.apiAccessEnabled === false && oauthClient.redirectUris[0].endsWith("/sac/oauth.html")) {
                        selectEle.options.add(new Option(oauthClient.name, oauthClient.id, false, oauthClient.clientId == clientId));
                    }
                });

                selectEle.addEventListener("change", () => {
                    let value = selectEle.value;
                    if (value) {
                        let oauth = {};
                        Promise.all([
                            fetch("/oauthservice/api/v1/tenantinfo?tenant=" + window.TENANT).then(response => response.json()).then(tenantOauthInfo => {
                                oauth.authorization_URL = tenantOauthInfo.baseUrl + tenantOauthInfo.authEndpoint;
                                oauth.token_URL = tenantOauthInfo.baseUrl + tenantOauthInfo.tokenEndpoint;
                            }),
                            fetch("/oauthservice/api/v1/oauthclient/" + value + "?tenant=" + window.TENANT).then(response => response.json()).then(oauthClient => {
                                oauth.client_id = oauthClient.clientId;
                                oauth.client_redirect_URL = oauthClient.redirectUris[0];
                            }),
                            fetch("/oauthservice/api/v1/oauthclient/" + value + "/secret?tenant=" + window.TENANT).then(response => response.text()).then(clientSecret => {
                                oauth.client_secret = clientSecret;
                            })
                        ]).then(() => {
                            this.oauth = JSON.stringify(oauth);
                            this._changeProperty("oauth");
                        });
                    } else {
                        this.oauth = null;
                        this._changeProperty("oauth");
                    }
                });
                selectEle.closest("tr").hidden = false;
            });
        }

        disconnectedCallback() {
            if (this._hoverDiv) {
                this._hoverDiv.remove();
            }
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of BiExportAps.observedAttributes) {
                properties[name] = this[name];
            }
            this._firePropertiesChanged(properties);
            return false;
        }
        _change(e) {
            this._changeProperty(e.target.name);
        }
        _changeProperty(propertyName) {
            let properties = {};
            properties[propertyName] = this[propertyName];
            this._firePropertiesChanged(properties);
        }

        _visibleComponentsChange(e) {
            let node = e.currentTarget;
            let visibleComponents = [];

            let inputs = node.querySelectorAll("input");
            for (let i = 0; i < inputs.length; i++) {
                let input = inputs[i];
                visibleComponents.push({
                    component: input.name,
                    isExcluded: !input.checked
                });
            }

            let properties = {};
            this[node.id] = properties[node.id] = visibleComponents.every(v => v.isExcluded) ? "" : JSON.stringify(visibleComponents)
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

        get oauth() {
            if (this.getValue("oauthClientId")) {
                return JSON.stringify({
                    client_id: this.getValue("oauthClientId"),
                    client_secret: this.getValue("oauthClientSecret"),
                    client_redirect_URL: this.getValue("oauthClientRedirectURL"),
                    authorization_URL: this.getValue("oauthAuthorizationURL"),
                    token_URL: this.getValue("oauthTokenURL")
                });
            }
            return null;
        }
        set oauth(value) {
            if (value) {
                let oauth = JSON.parse(value);
                this.setValue("oauthClientId", oauth.client_id);
                this.setValue("oauthClientSecret", oauth.client_secret);
                this.setValue("oauthClientRedirectURL", oauth.client_redirect_URL);
                this.setValue("oauthAuthorizationURL", oauth.authorization_URL);
                this.setValue("oauthTokenURL", oauth.token_URL);
            } else {
                this.setValue("oauthClientId", "");
                this.setValue("oauthClientSecret", "");
                this.setValue("oauthClientRedirectURL", "");
                this.setValue("oauthAuthorizationURL", "");
                this.setValue("oauthTokenURL", "");
            }
        }

        get filename() {
            return this.getValue("filename");
        }
        set filename(value) {
            this.setValue("filename", value);
        }

        get exportLanguage() {
            return this.getValue("exportLanguage");
        }
        set exportLanguage(value) {
            this.setValue("exportLanguage", value);
        }

        get screenWidth() {
            return this.getValue("screenWidth");
        }
        set screenWidth(value) {
            this.setValue("screenWidth", value);
        }

        get screenHeight() {
            return this.getValue("screenHeight");
        }
        set screenHeight(value) {
            this.setValue("screenHeight", value);
        }

        get parseCss() {
            return this.getBooleanValue("parseCss");
        }
        set parseCss(value) {
            this.setBooleanValue("parseCss", value);
        }

        get pdfTemplate() {
            return this.getValue("pdfTemplate");
        }
        set pdfTemplate(value) {
            this.setValue("pdfTemplate", value);
        }

        get pptSeparate() {
            return this.getBooleanValue("pptSeparate");
        }
        set pptSeparate(value) {
            this.setBooleanValue("pptSeparate", value);
        }

        get pptTemplate() {
            return this.getValue("pptTemplate");
        }
        set pptTemplate(value) {
            this.setValue("pptTemplate", value);
        }

        get docTemplate() {
            return this.getValue("docTemplate");
        }
        set docTemplate(value) {
            this.setValue("docTemplate", value);
        }

        get xlsTemplate() {
            return this.getValue("xlsTemplate");
        }
        set xlsTemplate(value) {
            this.setValue("xlsTemplate", value);
        }

        get publishMode() {
            return this.getValue("publishMode");
        }
        set publishMode(value) {
            this.setValue("publishMode", value);
        }

        get publishSync() {
            return this.getBooleanValue("publishSync");
        }
        set publishSync(value) {
            this.setBooleanValue("publishSync", value);
        }

        get mailFrom() {
            return this.getValue("mailFrom");
        }
        set mailFrom(value) {
            this.setValue("mailFrom", value);
        }

        get mailTo() {
            return this.getValue("mailTo");
        }
        set mailTo(value) {
            this.setValue("mailTo", value);
        }

        get mailSubject() {
            return this.getValue("mailSubject");
        }
        set mailSubject(value) {
            this.setValue("mailSubject", value);
        }

        get mailBody() {
            return this.getValue("mailBody");
        }
        set mailBody(value) {
            this.setValue("mailBody", value);
        }

        get showTexts() {
            return this.getBooleanValue("showTexts");
        }
        set showTexts(value) {
            this.setBooleanValue("showTexts", value);
        }

        get showIcons() {
            return this.getBooleanValue("showIcons");
        }
        set showIcons(value) {
            this.setBooleanValue("showIcons", value);
        }

        get showComponentSelector() {
            return this.getBooleanValue("showComponentSelector");
        }
        set showComponentSelector(value) {
            this.setBooleanValue("showComponentSelector", value);
        }

        get showViewSelector() {
            return this.getBooleanValue("showViewSelector");
        }
        set showViewSelector(value) {
            this.setBooleanValue("showViewSelector", value);
        }

        get enablePpt() {
            return this.getBooleanValue("enablePpt");
        }
        set enablePpt(value) {
            this.setBooleanValue("enablePpt", value);
        }

        get enableDoc() {
            return this.getBooleanValue("enableDoc");
        }
        set enableDoc(value) {
            this.setBooleanValue("enableDoc", value);
        }

        get enablePdf() {
            return this.getBooleanValue("enablePdf");
        }
        set enablePdf(value) {
            this.setBooleanValue("enablePdf", value);
        }

        get enableXls() {
            return this.getBooleanValue("enableXls");
        }
        set enableXls(value) {
            this.setBooleanValue("enableXls", value);
        }

        get enableCsv() {
            return this.getBooleanValue("enableCsv");
        }
        set enableCsv(value) {
            this.setBooleanValue("enableCsv", value);
        }

        get pdfExclude() {
            return this.pdf_exclude;
        }
        set pdfExclude(value) {
            this.pdf_exclude = value;
            this._renderVisibleComponents("pdfExclude", this.metadata, value);
        }

        get pptExclude() {
            return this.ppt_exclude;
        }
        set pptExclude(value) {
            this.ppt_exclude = value;
            this._renderVisibleComponents("pptExclude", this.metadata, value);
        }

        get docExclude() {
            return this.doc_exclude;
        }
        set docExclude(value) {
            this.doc_exclude = value;
            this._renderVisibleComponents("docExclude", this.metadata, value);
        }

        get xlsExclude() {
            return this.xls_exclude;
        }
        set xlsExclude(value) {
            this.xls_exclude = value;
            this._renderVisibleComponents("xlsExclude", this.metadata, value);
        }

        get metadata() {
            return this._metadata;
        }
        set metadata(value) {
            this._metadata = value;

            ["pdfExclude", "pptExclude", "docExclude", "xlsExclude"].forEach(id => {
                this._renderVisibleComponents(id, value, this[id]);
            });
        }

        _renderVisibleComponents(id, metadata, value) {
            let node = this._shadowRoot.getElementById(id);

            while (node.lastElementChild != node.firstElementChild) {
                node.lastElementChild.remove();
            }

            let visibleComponents = value ? JSON.parse(value) : [];
            let components = metadata ? JSON.parse(metadata)["components"] : {};
            for (let componentId in components) {
                let component = components[componentId];

                if (component.type == "sdk_com_biexcellence_openbi_sap_sac_export__0") {
                    continue;
                }

                let div = document.createElement("div");
                let label = document.createElement("label");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = componentId;
                checkbox.name = component.name;
                checkbox.checked = visibleComponents.some(v => v.component == component.name && !v.isExcluded);
                let text = document.createTextNode(component.name);

                label.appendChild(checkbox);
                label.appendChild(text);

                div.appendChild(label);

                node.appendChild(div);
            }

            let summary = node.querySelector("summary");
            summary.textContent = "Visible Components (" + (visibleComponents.filter(v => !v.isExcluded).length || Object.keys(components).length) + ")";
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
                "oauth",

                "exportLanguage",
                "screenWidth",
                "screenHeight",
                "parseCss",

                "pdfTemplate",
                "pdfExclude",

                "pptSeparate",
                "pptTemplate",
                "pptExclude",

                "docTemplate",
                "docExclude",

                "xlsTemplate",
                "xlsExclude",

                "publishMode",
                "publishSync",
                "filename",
                "mailFrom",
                "mailTo",
                "mailSubject",
                "mailBody",

                "showTexts",
                "showIcons",
                "showViewSelector",
                "showComponentSelector",
                "enablePpt",
                "enableDoc",
                "enablePdf",
                "enableXls",
                "enableCsv",

                "metadata"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-biexcellence-openbi-sap-sac-export-aps", BiExportAps);
})();