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
          input, textarea {
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
          <legend>Display</legend>
          <table>
            <tr>
              <td><label for="pdfButton">PDF Button</label></td>
              <td><input id="pdfButton" name="pdfButton" type="text"></td>
            </tr>
            <tr>
              <td><label for="pptButton">PPT Button</label></td>
              <td><input id="pptButton" name="pptButton" type="text"></td>
            </tr>
            <tr>
              <td><label for="docButton">DOC Button</label></td>
              <td><input id="docButton" name="docButton" type="text"></td>
            </tr>
            <tr>
              <td><label for="xlsButton">XLS Button</label></td>
              <td><input id="xlsButton" name="xlsButton" type="text"></td>
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
            document.body.appendChild(this._hoverDiv);
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
            let name = e.target.name;
            let properties = {};
            properties[name] = this[name];
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
            this.setBoolValue("parseCss", value);
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
            this.setBoolValue("pptSeparate", value);
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
            this.setBoolValue("publishSync", value);
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

        get pdfButton() {
            return this.getValue("pdfButton");
        }
        set pdfButton(value) {
            this.setValue("pdfButton", value);
        }

        get pptButton() {
            return this.getValue("pptButton");
        }
        set pptButton(value) {
            this.setValue("pptButton", value);
        }

        get docButton() {
            return this.getValue("docButton");
        }
        set docButton(value) {
            this.setValue("docButton", value);
        }

        get xlsButton() {
            return this.getValue("xlsButton");
        }
        set xlsButton(value) {
            this.setValue("xlsButton", value);
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
        setBoolValue(id, value) {
            this._shadowRoot.getElementById(id).checked = value;
        }

        static get observedAttributes() {
            return [
                "serverURL",

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

                "pdfButton",
                "pptButton",
                "docButton",
                "xlsButton",

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