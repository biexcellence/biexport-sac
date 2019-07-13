(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <form id="form">
        <fieldset>
        <legend>biExport Parameters</legend>
          <table>
            <tr>
              <td><label for="serverURL">Server URL</label></td>
              <td><input id="serverURL" name="serverURL" type="text"></td>
            </tr>
            <tr>
              <td><label for="filename">Filename</label></td>
              <td><input id="filename" name="filename" type="text"></td>
            </tr>
            <tr>
              <td><label for="exportLanguage">Language</label></td>
              <td><input id="exportLanguage" name="exportLanguage" type="text"></td>
            </tr>
            <tr>
              <td><label for="screenWidth">Static Width</label></td>
              <td><input id="screenWidth" name="screenWidth" type="number" step="1"></td>
            </tr>
            <tr>
              <td><label for="screenHeight">Static Height</label></td>
              <td><input id="screenHeight" name="screenHeight" type="number" step="1"></td>
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
          </table>
        </fieldset>
        <fieldset>
        <legend>PPT</legend>
          <table>
            <tr>
              <td><label for="pptTemplate">Template</label></td>
              <td><input id="pptTemplate" name="pptTemplate" type="text"></td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
        <legend>DOC</legend>
          <table>
            <tr>
              <td><label for="docTemplate">Template</label></td>
              <td><input id="docTemplate" name="docTemplate" type="text"></td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
        <legend>XLS</legend>
          <table>
            <tr>
              <td><label for="xlsTemplate">Template</label></td>
              <td><input id="xlsTemplate" name="xlsTemplate" type="text"></td>
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
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of observedAttributes()) {
                properties[name] = this[name];
            }
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
            return false;
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

        get pdfTemplate() {
            return this.getValue("pdfTemplate");
        }
        set pdfTemplate(value) {
            this.setValue("pdfTemplate", value);
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

        getValue(id) {
            return this._shadowRoot.getElementById(id).value;
        }
        setValue(id, value) {
            this._shadowRoot.getElementById(id).value = value;
        }

        static get observedAttributes() {
            return [
                "serverURL",
                "filename",
                "exportLanguage",
                "screenWidth",
                "screenHeight",
                "pdfTemplate",
                "pptTemplate",
                "docTemplate",
                "xlsTemplate",
                "publishMode",
                "mailFrom",
                "mailTo",
                "mailSubject",
                "mailBody",
                "pdfButton",
                "pptButton",
                "docButton",
                "xlsButton"
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