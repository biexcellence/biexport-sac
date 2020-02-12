(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="export_div" name="export_div" class="openbihideonprint">
         <slot name="export_button"></slot>       
         <form id="form" method="post" accept-charset="utf-8" action="">
            <input id="export_settings_json" name="bie_openbi_export_settings_json" type="hidden">
        </form>
      </div>
    `;

    class BiExport extends HTMLElement {

        constructor() {

            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._id = createGuid();

            this._shadowRoot.querySelector("#export_div").id = this._id + "_export_div";

            this._enableCSV = false;
            this._enablePPT = true;
            this._enableXLS = true;
            this._enablePDF = true;
            this._enableDOC = true;
            this._showIcons = true;
            this._showTexts = false;
            this._showComponentSelector = false;
            this._showViewSelector = false;


            this._cPPT_text = "PowerPoint";
            this._cDOC_text = "Word";
            this._cPDF_text = "PDF";
            this._cXLS_text = "Excel";
            this._cCSV_text = "CSV";
            this._cPPT_icon = "sap-icon://ppt-attachment";
            this._cDOC_icon = "sap-icon://doc-attachment";
            this._cPDF_icon = "sap-icon://pdf-attachment";
            this._cXLS_icon = "sap-icon://excel-attachment";
            this._cCSV_icon = "sap-icon://attachment-text-file";
            this._cExport_text = "Export";
            this._cExport_icon = "sap-icon://download";


            // initialize export form 
            this.form = this._shadowRoot.querySelector("#form");
            this.form.id = this._id + "_form";

            this.settings = this._shadowRoot.querySelector("#export_settings_json");
            this.settings.id = this._id + "_export_settings_json";

            this._export_settings = {};
            this._export_settings.dashboard = "";
            this._export_settings.scroll_height = 0;
            this._export_settings.scroll_width = 0;
            this._export_settings.pageid = "";
            this._export_settings.requestid = "";
            this._export_settings.mastersys = "";
            this._export_settings.client_type = "";
            this._export_settings.client_version = "";
            this._export_settings.title = "";
            this._export_settings.appid = "";
            this._export_settings.urlprefix = "";
            this._export_settings.cookie = "";
            this._export_settings.user = "";
            this._export_settings.lng = "";
            this._export_settings.version = "";
            this._export_settings.cookie = "";
            this._export_settings.format = "";
            this._export_settings.URL = "";

            this._export_settings.pdf_orient = "";
            this._export_settings.pdf_header = "";
            this._export_settings.pdf_footer = "";
            this._export_settings.pdf_size = "";
            this._export_settings.pdf_width = "";
            this._export_settings.pdf_height = "";
            this._export_settings.pdf_border_top = 0;
            this._export_settings.pdf_border_bottom = 0;
            this._export_settings.pdf_border_left = 0;
            this._export_settings.pdf_border_right = 0;
            this._export_settings.pdf_exclude = "";
            this._export_settings.pdf_html_template = "";
            this._export_settings.pdf_template = "";
            this._export_settings.pdf_bookmark_template = "";
            this._export_settings.pdf_include_plain = "";
            this._export_settings.pdf_page_sections = "";
            this._export_settings.pdf_template_def = "";
            this._export_settings.header_footer_width = 0;
            this._export_settings.header_footer_css = true;
            this._export_settings.ppt_exclude = "";
            this._export_settings.ppt_template = "";
            this._export_settings.ppt_seperate = "";
            this._export_settings.ppt_template_def = "";

            this._export_settings.doc_exclude = "";
            this._export_settings.doc_template = "";
            this._export_settings.doc_template_def = "";

            this._export_settings.xls_exclude = "";
            this._export_settings.xls_template = "";

            this._export_settings.filename = "";
            this._export_settings.seperate_files = "";
            this._export_settings.publish_mode = "";
            this._export_settings.publish_sync = false;
            this._export_settings.parse_css = false;
            this._export_settings.mail_to = "";
            this._export_settings.mail_subject = "";
            this._export_settings.mail_body = "";
            this._export_settings.mail_from = "";
            this._export_settings.print_template = "";
            this._export_settings.array_var = "";
            this._export_settings.array_param = "";
            this._export_settings.array_text = "";
            this._export_settings.fixed_width = "0";
            this._export_settings.fixed_height = "0";
            this._export_settings.sessionid = "";
            this._export_settings.executeid = "";
            this._export_settings.scheduling = "";
            this._export_settings.incl_metadata = "";
            this._export_settings.width_from_children = "";
            this._export_settings.parse_all_styles = "";
            this._export_settings.parse_3rdparty = "";
            this._export_settings.messages = "";
            this._export_settings.oauth = null;
            this._export_settings.server_urls = "";
            this._export_settings.server_waittime = 0;
            this._export_settings.server_engine = "";
            this._export_settings.server_quality = 0;
            this._export_settings.server_processes = 0;
            this._export_settings.application_array = "";

            this._export_settings.bianalytics = false;
            this._export_settings.parseCssClassFilter = "";

            this._updateSettings();
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"
                    if (outlineContainer && outlineContainer.getReactProps) {
                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return { result: 1 };
                                }
                            });
                        };
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {

            }
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if (this._buttonSlot) {
                this._buttonSlot.remove();
            }
            this._buttonSlot = document.createElement("div");
            this._buttonSlot.slot = "export_button";
            this.appendChild(this._buttonSlot);

            if (this.showTexts || this.showIcons) {
                var lmenu = new sap.m.Menu({
                    title: "Export",
                    itemSelected: oEvent => {
                        var oItem = oEvent.getParameter("item");
                        if (!this.showComponentSelector && !this.showViewSelector) {
                            this.doExport(oItem.getKey());
                        } else {

                            var ltab = new sap.m.IconTabBar({
                                expandable: false
                            });

                            if (this.showComponentSelector && oItem.getKey() != "CSV") {
                                let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
                                let visibleComponents = this[oItem.getKey().toLowerCase() + "Exclude"] ? JSON.parse(this[oItem.getKey().toLowerCase() + "Exclude"]) : [];

                                var lcomponent_box = new sap.ui.layout.form.SimpleForm({
                                    layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                                    columnsM: 2,
                                    columnsL: 4
                                }); 

                                for (let componentId in components) {
                                    let component = components[componentId];
                                    if (visibleComponents.length == 0 || visibleComponents.some(v => v.component == component.name && !v.isExcluded)) {
                                        if (component.type != "sdk_com_biexcellence_openbi_sap_sac_export__0") {
                                            lcomponent_box.addContent(new sap.m.CheckBox({
                                                id: component.name,
                                                text: component.name,
                                                select: function (oEvent) {
                                                    debugger;
                                                    var objIndex = visibleComponents.findIndex((v => v.component == oEvent.getParameter("id")));
                                                    if (objIndex > -1) {
                                                        visibleComponents[objIndex].isExcluded = !oEvent.getParameter("selected");
                                                    } else {
                                                        var lcomp = {};
                                                        lcomp.component = oEvent.getParameter("id");
                                                        lcomp.isExcluded = !oEvent.getParameter("selected");
                                                        visibleComponents.push(lcomp);
                                                    }
                                                    this[oItem.getKey().toLowerCase() + "Exclude"] = JSON.stringify(visibleComponents);
                                                }
                                            }));
                                        }
                                    }
                                }

                                ltab.addItem(new sap.m.IconTabFilter({
                                    key: "components",
                                    text: "Select Components",
                                    icon: "",
                                    content: [
                                        lcomponent_box
                                    ]
                                }));
                            }
                            if (this.showViewSelector) {
                                let vars = this.metadata ? JSON.parse(this.metadata)["vars"] : {};
                                var lview_box = new sap.ui.layout.form.SimpleForm({
                                    layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                                    columnsM: 3,
                                    columnsL: 3
                                });
                                lview_box.addContent(new sap.m.Toolbar({
                                    ariaLabelledBy="Title1",
                                    content: [
                                        new sap.m.Title({ id: "Title1", text: "Views" }),
                                        new sap.m.ToolbarSpacer(),
                                        new sap.m.Button({ icon: "sap-icon://download" }),
                                        new sap.m.Button({ icon: "sap-icon://upload" })
                                    ]
                                }));

                                for (let varId in vars) {
                                    let varObj = vars[varId];
                                    if (varObj.isExposed) {
                                       lview_box.addContent(new sap.m.Label({
                                           "text": varObj.description
                                        }));
                                    lview_box.addContent(new sap.m.Input({
                                        "id": varObj.name + "_value",
                                        "change": function (oEvent) {
                                            debugger;
                                        }
                                        // "valueHelpRequest": this.onHandleVariableSuggest,
                                        // "showValueHelp": true
                                    }));
                                            lview_box.addContent(new sap.m.CheckBox({
                                                "id": varObj.name + "_iterative",
                                                text: "Iterative",
                                                select: function (oEvent) {
                                                    debugger;
                                                }
                                            }));
                                    }
                                }

                                lview_box.addContent(new sap.m.Toolbar({
                                    ariaLabelledBy="Title2",
                                    content: [
                                        new sap.m.Title({ id: "Title2", text: "Mail" }),
                                        new sap.m.ToolbarSpacer(),
                                    ]
                                }));

                                lview_box.addContent(new sap.m.Text({
                                    "text": "The generation of Briefing Books with multiple views might take a while. Activate mail delivery to receive the document via mail"
                                }));
                                lview_box.addContent(new sap.m.Label({
                                    "text": "Mail Recipient"
                                }));
                                lview_box.addContent(new sap.m.Input({
                                    "id": "mail_to",
                                    "change": function (oEvent) {
                                        debugger;
                                    }
                                }));

                                ltab.addItem(new sap.m.IconTabFilter({
                                    key: "contents",
                                    text: "Define Views",
                                    icon: "",
                                    content: [
                                        lview_box
                                    ]
                                }));
                            }

                            var dialog = new sap.m.Dialog({
                                title: 'Configure Export',
                                contentWidth: "400px",
                                contentHeight: "400px",
                                draggable: true,
                                resizable: true,
                                content: [
                                    ltab
                                ],
                                beginButton: new sap.m.Button({
                                    text: 'Submit',
                                    press: () => {
                                        this.doExport(oItem.getKey());
                                        dialog.close();
                                    }
                                }),
                                endButton: new sap.m.Button({
                                    text: 'Cancel',
                                    press: function () {
                                        dialog.close();
                                    }
                                }),
                                afterClose: function () {
                                    if (lcomponent_box != null) { lcomponent_box.destroy(); }
                                    if (lview_box != null) { lview_box.destroy(); }
                                    ltab.destroy();
                                    dialog.destroy();
                                }
                            });

                            dialog.open();
                        }
                    }
                });

                var ltext = "";
                var licon = "";
                if (this.enablePpt) {
                    if (this.showTexts) { ltext = this._cPPT_text; }
                    if (this.showIcons) { licon = this._cPPT_icon; }
                    lmenu.addItem(new sap.m.MenuItem({ text: ltext, icon: licon, key: "PPT" }));
                }
                if (this.enableDoc) {
                    if (this.showTexts) { ltext = this._cDOC_text; }
                    if (this.showIcons) { licon = this._cDOC_icon; }
                    lmenu.addItem(new sap.m.MenuItem({ text: ltext, icon: licon, key: "DOC" }));
                }
                if (this.enableXls) {
                    if (this.showTexts) { ltext = this._cXLS_text; }
                    if (this.showIcons) { licon = this._cXLS_icon; }
                    lmenu.addItem(new sap.m.MenuItem({ text: ltext, icon: licon, key: "XLS" }));
                }
                if (this.enableCsv) {
                    if (this.showTexts) { ltext = this._cCSV_text; }
                    if (this.showIcons) { licon = this._cCSV_icon; }
                    lmenu.addItem(new sap.m.MenuItem({ text: ltext, icon: licon, key: "CSV" }));
                }
                if (this.enablePdf) {
                    if (this.showTexts) { ltext = this._cPDF_text; }
                    if (this.showIcons) { licon = this._cPDF_icon; }
                    lmenu.addItem(new sap.m.MenuItem({ text: ltext, icon: licon, key: "PDF" }));
                }

                if (this.showTexts) { ltext = this._cExport_text; }
                if (this.showIcons) { licon = this._cExport_icon; }

                var lmenubutton = new sap.m.MenuButton({ text: ltext, icon: licon, menu: lmenu });
                if (this._designMode) {
                    lmenubutton.setEnabled(false);
                }

                lmenubutton.placeAt(this._buttonSlot);
            }
        }

        // DISPLAY

        get showIcons() {
            return this._showIcons;
        }
        set showIcons(value) {
            this._showIcons = value;
        }

        get showViewSelector() {
            return this._showViewSelector;
        }
        set showViewSelector(value) {
            this._showViewSelector = value;
        }

        get showComponentSelector() {
            return this._showComponentSelector;
        }
        set showComponentSelector(value) {
            this._showComponentSelector = value;
        }

        get showTexts() {
            return this._showTexts;
        }
        set showTexts(value) {
            this._showTexts = value;
        }

        get enablePpt() {
            return this._enablePPT;
        }
        set enablePpt(value) {
            this._enablePPT = value;
        }

        get enableDoc() {
            return this._enableDOC;
        }
        set enableDoc(value) {
            this._enableDOC = value;
        }

        get enableXls() {
            return this._enableXLS;
        }
        set enableXls(value) {
            this._enableXLS = value;
        }

        get enablePdf() {
            return this._enablePDF;
        }
        set enablePdf(value) {
            this._enablePDF = value;
        }

        get enableCsv() {
            return this._enableCSV;
        }
        set enableCsv(value) {
            this._enableCSV = value;
        }


        // SETTINGS

        get serverURL() {
            return this._export_settings.server_urls;
        }
        set serverURL(value) {
            this._export_settings.server_urls = value;
            this._updateSettings();
        }

        get oauth() {
            return this._export_settings.oauth;
        }
        set oauth(value) {
            this._export_settings.oauth = value;
            this._updateSettings();
        }

        get filename() {
            return this._export_settings.filename;
        }
        set filename(value) {
            this._export_settings.filename = value;
            this._updateSettings();
        }

        get exportLanguage() {
            return this._export_settings.lng;
        }
        set exportLanguage(value) {
            this._export_settings.lng = value;
            this._updateSettings();
        }

        get screenWidth() {
            return this._export_settings.fixed_width;
        }
        set screenWidth(value) {
            this._export_settings.fixed_width = value;
            this._updateSettings();
        }

        get screenHeight() {
            return this._export_settings.fixed_height;
        }
        set screenHeight(value) {
            this._export_settings.fixed_height = value;
            this._updateSettings();
        }

        get parseCss() {
            return this._export_settings.parse_css;
        }
        set parseCss(value) {
            this._export_settings.parse_css = value;
            this._updateSettings();
        }

        get pdfTemplate() {
            return this._export_settings.pdf_template;
        }
        set pdfTemplate(value) {
            this._export_settings.pdf_template = value;
            this._updateSettings();
        }

        get pptSeparate() {
            return this._export_settings.ppt_seperate == "X";
        }
        set pptSeparate(value) {
            this._export_settings.ppt_seperate = value ? "X" : "";
            this._updateSettings();
        }

        get pptTemplate() {
            return this._export_settings.ppt_template;
        }
        set pptTemplate(value) {
            this._export_settings.ppt_template = value;
            this._updateSettings();
        }

        get docTemplate() {
            return this._export_settings.doc_template;
        }
        set docTemplate(value) {
            this._export_settings.doc_template = value;
            this._updateSettings();
        }

        get xlsTemplate() {
            return this._export_settings.xls_template;
        }
        set xlsTemplate(value) {
            this._export_settings.xls_template = value;
            this._updateSettings();
        }

        get publishMode() {
            return this._export_settings.publish_mode;
        }
        set publishMode(value) {
            this._export_settings.publish_mode = value;
            this._updateSettings();
        }

        get publishSync() {
            return this._export_settings.publish_sync;
        }
        set publishSync(value) {
            this._export_settings.publish_sync = value;
            this._updateSettings();
        }

        get mailFrom() {
            return this._export_settings.mail_from;
        }
        set mailFrom(value) {
            this._export_settings.mail_from = value;
            this._updateSettings();
        }

        get mailTo() {
            return this._export_settings.mail_to;
        }
        set mailTo(value) {
            this._export_settings.mail_to = value;
            this._updateSettings();
        }

        get mailSubject() {
            return this._export_settings.mail_subject;
        }
        set mailSubject(value) {
            this._export_settings.mail_subject = value;
            this._updateSettings();
        }

        get mailBody() {
            return this._export_settings.mail_body;
        }
        set mailBody(value) {
            this._export_settings.mail_body = value;
            this._updateSettings();
        }

        get pdfExclude() {
            return this._export_settings.pdf_exclude;
        }
        set pdfExclude(value) {
            this._export_settings.pdf_exclude = value;
            this._updateSettings();
        }

        get pptExclude() {
            return this._export_settings.ppt_exclude;
        }
        set pptExclude(value) {
            this._export_settings.ppt_exclude = value;
            this._updateSettings();
        }

        get docExclude() {
            return this._export_settings.doc_exclude;
        }
        set docExclude(value) {
            this._export_settings.doc_exclude = value;
            this._updateSettings();
        }

        get xlsExclude() {
            return this._export_settings.xls_exclude;
        }
        set xlsExclude(value) {
            this._export_settings.xls_exclude = value;
            this._updateSettings();
        }

        get metadata() {
            return this._export_settings.metadata;
        }
        set metadata(value) {
            this._export_settings.metadata = value;
            this._updateSettings();
        }

        static get observedAttributes() {
            return [
                "metadata"
            ];
        }

        // METHODS

        _updateSettings() {
            this.settings.value = JSON.stringify(this._export_settings);
        }

        addExportApplication(id) {
            if (!this._export_settings.application_array) {
                this._export_settings.application_array = [];
            }
            this._export_settings.application_array.push({ "application": id });
            this._updateSettings();
        }
        clearExportApplications() {
            this._export_settings.application_array = "";
            this._updateSettings();
        }

        addURLParameter(name, values, iterative, applicationIds) {
            if (!this._export_settings.array_var) {
                this._export_settings.array_var = [];
            }
            this._export_settings.array_var.push({ "parameter": name, "values": values.join(";"), "iterative": iterative, "applications": applicationIds.join(";") });
            this._updateSettings();
        }
        clearURLParameters() {
            this._export_settings.array_var = "";
            this._updateSettings();
        }

        doExport(format, overrideSettings) {
            let settings = JSON.parse(JSON.stringify(this._export_settings));

            setTimeout(() => {
                this._doExport(format, settings, overrideSettings);
            }, 200);
        }

        _doExport(format, settings, overrideSettings) {
            if (this._designMode) {
                return false;
            }

            if (overrideSettings) {
                let set = JSON.parse(overrideSettings);
                set.forEach(s => {
                    settings[s.name] = s.value;
                });
            }

            settings.format = format;
            settings.URL = location.protocol + "//" + location.host;
            settings.dashboard = location.href;
            settings.title = document.title;
            settings.cookie = document.cookie;
            settings.scroll_width = document.body.scrollWidth;
            settings.scroll_height = document.body.scrollHeight;

            if (window.sap && sap.fpa && sap.fpa.ui && sap.fpa.ui.infra) {
                if (sap.fpa.ui.infra.common) {
                    let context = sap.fpa.ui.infra.common.getContext();

                    let app = context.getAppArgument();
                    settings.appid = app.appId;

                    let user = context.getUser();
                    settings.sac_user = user.getUsername();

                    if (settings.lng == "") {
                        settings.lng = context.getLanguage();
                    }
                }
                if (sap.fpa.ui.infra.service && sap.fpa.ui.infra.service.AjaxHelper) {
                    settings.tenant_URL = sap.fpa.ui.infra.service.AjaxHelper.getTenantUrl(false); // true for PUBLIC_FQDN
                }
            }

            if (settings.publish_mode === "" || settings.publish_mode === "ONLINE" || settings.publish_mode === "VIEWER" || settings.publish_mode === "PRINT") {
                settings.publish_sync = true;
            }

            this.dispatchEvent(new CustomEvent("onStartExport", {
                detail: {
                    settings: settings
                }
            }));

            let sendHtml = true;
            if (settings.application_array && settings.oauth) {
                sendHtml = false;
            }
            if (sendHtml) {
                // add settings to html so they can be serialized
                // NOTE: this is not "promise" save!
                this.settings.value = JSON.stringify(settings);

                getHtml(settings).then(html => {
                    this._updateSettings(); // reset settings

                    this._submitExport(settings, html);
                });
            } else {
                this._submitExport(settings, null);
            }
        }

        _submitExport(settings, content) {
            this.dispatchEvent(new CustomEvent("onSendExport", {
                detail: {
                    settings: settings
                }
            }));

            let form = document.createElement("form");

            let settingsEl = form.appendChild(document.createElement("input"));
            settingsEl.name = "bie_openbi_export_settings_json";
            settingsEl.type = "hidden";
            settingsEl.value = JSON.stringify(settings);

            if (content) {
                let contentEl = form.appendChild(document.createElement("input"));
                contentEl.name = "bie_openbi_export_content";
                contentEl.type = "hidden";
                contentEl.value = content;
            }

            let host = settings.server_urls;
            let url = host + "/sac/export.html";

            this._sendExportRequest(url, form, settings);
        }

        _sendExportRequest(url, form, settings) {

            // handle response types
            let callback = (error, filename, blob) => {
                if (error) {
                    this.dispatchEvent(new CustomEvent("onErrorExport", {
                        detail: {
                            error: error,
                            settings: settings
                        }
                    }));
                } else if (filename) {
                    if (filename.indexOf("E:") === 0) {
                        callback(new Error(filename)); // error...
                        return;
                    }

                    this.dispatchEvent(new CustomEvent("onReturnExport", {
                        detail: {
                            filename: filename,
                            settings: settings
                        }
                    }));

                    if (blob) { // download blob
                        let downloadUrl = URL.createObjectURL(blob);
                        let a = document.createElement("a");
                        a.download = filename;
                        a.href = downloadUrl;
                        document.body.appendChild(a);
                        a.click();

                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(downloadUrl);
                        }, 0);
                    } else if (filename.indexOf("I:") !== 0) { // download via filename and not sheduled
                        let downloadUrl = host + "/sac/download.html?FILE=" + encodeURIComponent(filename);

                        window.open(downloadUrl, "_blank");
                    }
                }
            };

            if (url.indexOf(location.protocol) == 0 || url.indexOf("https:") == 0) { // same protocol => use fetch?
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    body: new FormData(form),
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }).then(response => {
                    if (response.ok) {
                        let contentDisposition = response.headers.get("Content-Disposition");
                        if (contentDisposition) {
                            return response.blob().then(blob => {
                                callback(null, contentDispositionFilenameRegExp.exec(contentDisposition)[1], blob);
                            });
                        }
                        return response.text().then(text => {
                            callback(null, text);
                        });
                    } else if (response.status == 401) {
                        return response.text().then(oauthUrl => {
                            let oauthWindow = window.open(oauthUrl, "_blank", "height=500,width=500");
                            if (!oauthWindow || oauthWindow.closed) {
                                throw new Error("OAuth popup bocked");
                            }
                            return new Promise(resolve => {
                                (function checkWindow() {
                                    if (!oauthWindow || oauthWindow.closed) {
                                        resolve();
                                    } else {
                                        setTimeout(checkWindow, 1000);
                                    }
                                })();
                            }).then(() => {
                                this._sendExportRequest(url, form, settings);
                            });
                        });
                    } else {
                        throw new Error(response.status + " - " + response.statusText);
                    }
                }).catch(reason => {
                    callback(reason);
                });
            } else { // use form with blank target...
                form.action = url;
                form.target = "_blank";
                form.method = "POST";
                form.acceptCharset = "utf-8";
                this._shadowRoot.appendChild(form);

                form.submit();

                form.remove();

                callback(null, "I:Export running in separate tab");
            }
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-export", BiExport);

    // PUBLIC API

    window.getHtml = getHtml;

    // UTILS

    const cssUrlRegExp = /url\(["']?(.*?)["']?\)/i;
    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;
    const startsWithHttpRegExp = /^http/i;

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getHtml(settings) {
        let html = [];
        let promises = [];
        cloneNode(document.documentElement, html, promises, settings || {});
        return Promise.all(promises).then(() => {
            if (document.doctype && typeof XMLSerializer != "undefined") { // <!DOCTYPE html>
                html.unshift(new XMLSerializer().serializeToString(document.doctype));
            }

            return html.join("");
        });
    }

    function cloneNode(node, html, promises, settings) {
        if (node.nodeType == 8) return; // COMMENT
        if (node.tagName == "SCRIPT") return; // SCRIPT

        if (node.nodeType == 3) { // TEXT
            html.push(escapeText(node.nodeValue));
            return;
        }

        let name = node.localName;
        let content = null;
        let attributes = Object.create(null);
        for (let i = 0; i < node.attributes.length; i++) {
            let attribute = node.attributes[i];
            attributes[attribute.name] = attribute.value;
        }


        switch (node.tagName) {
            case "INPUT":
                attributes["value"] = node.value;
                delete attributes["checked"];
                if (node.checked) {
                    attributes["checked"] = "checked";
                }
                break;
            case "OPTION":
                delete attributes["selected"];
                if (node.selected) {
                    attributes["selected"] = "selected";
                }
                break;
            case "TEXTAREA":
                content = node.value;
                break;
            case "CANVAS":
                name = "img";
                attributes["src"] = node.toDataURL("image/png");
                break;
            case "IMG":
                if (node.src && !node.src.includes("data:")) {
                    attributes["src"] = getUrlAsDataUrl(node.src).then(d => d, () => node.src);
                }
                break;
            case "LINK":
                if (node.tagName == "LINK" && node.rel == "preload") {
                    return "";
                }
            case "STYLE":
                let sheet = node.sheet;
                if (sheet) {
                    let shadowHost = null;
                    let parent = node.parentNode;
                    while (parent) {
                        if (parent.host) {
                            shadowHost = parent.host;
                            break;
                        }
                        parent = parent.parentNode;
                    }

                    if (shadowHost || settings.parse_css) {
                        if (sheet.href) { // download external stylesheets
                            name = "style";
                            attributes = { "type": "text/css" };
                            content = fetch(sheet.href).then(response => response.text()).then(t => {
                                let style = document.createElement("style");
                                style.type = "text/css";
                                style.appendChild(document.createTextNode(t));
                                document.body.appendChild(style);
                                style.sheet.disabled = true;
                                return getCssText(style.sheet, sheet.href, shadowHost).then(r => {
                                    document.body.removeChild(style);
                                    return r;
                                });
                            }, reason => {
                                return "";
                            });
                        } else {
                            content = getCssText(sheet, document.baseURI, shadowHost);
                        }
                    }
                }
                break;
        }

        if (settings.parse_css) {
            if (attributes["style"]) {
                let style = attributes["style"];
                if (style.includes("url") && !style.includes("data:")) {
                    let url = cssUrlRegExp.exec(style)[1];
                    if (url) {
                        attributes["style"] = getUrlAsDataUrl(toAbsoluteUrl(document.baseURI, url)).then(d => style.replace(url, d), () => style);
                    }
                }
            }
        }


        html.push("<");
        html.push(name);
        for (let name in attributes) {
            let value = attributes[name];

            html.push(" ");
            html.push(name);
            html.push("=\"");
            if (value.then) {
                let index = html.length;
                html.push(""); // placeholder
                promises.push(value.then(v => html[index] = escapeAttributeValue(v)));
            } else {
                html.push(escapeAttributeValue(value));
            }
            html.push("\"");
        }
        html.push(">");
        let isEmpty = true;
        if (content) {
            if (content.then) {
                let index = html.length;
                html.push(""); // placeholder
                promises.push(content.then(c => html[index] = escapeText(c)));
            } else {
                html.push(escapeText(content));
            }
            isEmpty = false;
        } else {
            let child = node.firstChild;
            if (!child && node.shadowRoot) { // shadowRoot
                child = node.shadowRoot.firstChild;
            }
            while (child) {
                html.push(cloneNode(child, html, promises, settings));
                child = child.nextSibling;
                isEmpty = false;
            }
        }
        if (isEmpty && !new RegExp("</" + node.tagName + ">$", "i").test(node.outerHTML)) {
            // no end tag
        } else {
            html.push("</");
            html.push(name);
            html.push(">");
        }
    }

    function getCssText(sheet, baseUrl, shadowHost) {
        return parseCssRules(sheet.rules, baseUrl, shadowHost);
    }
    function parseCssRules(rules, baseUrl, shadowHost) {
        let promises = [];
        let css = [];

        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];

            if (rule.type == CSSRule.MEDIA_RULE) { // media query
                css.push("@media ");
                css.push(rule.conditionText);
                css.push("{");

                let index = css.length;
                css.push(""); // placeholder
                promises.push(parseCssRules(rule.cssRules, baseUrl, shadowHost).then(c => css[index] = c));

                css.push("}");
            } else if (rule.type == CSSRule.IMPORT_RULE) { // @import
                let index = css.length;
                css.push(""); // placeholder
                promises.push(getCssText(rule.styleSheet, baseUrl, shadowHost).then(c => css[index] = c));
            } else if (rule.type == CSSRule.STYLE_RULE) {
                if (shadowHost) { // prefix with shadow host name...
                    css.push(shadowHost.localName);
                    css.push(" ");
                    css.push(rule.selectorText.split(",").join("," + shadowHost.localName));
                } else {
                    css.push(rule.selectorText);
                }
                css.push(" {");
                for (let j = 0; j < rule.style.length; j++) {
                    let name = rule.style[j]
                    let value = rule.style[name];
                    css.push(name);
                    css.push(":");
                    if (name.startsWith("background") && value && value.includes("url") && !value.includes("data:")) {
                        let url = cssUrlRegExp.exec(value)[1];
                        if (url) {
                            let index = css.length;
                            css.push(""); // placeholder
                            promises.push(getUrlAsDataUrl(toAbsoluteUrl(baseUrl, url)).then(d => css[index] = "url(" + d + ")", () => css[index] = value));
                        }
                    }
                    css.push(value);
                    css.push(";");
                }
                css.push("}");
            } else if (rule.type == CSSRule.FONT_FACE_RULE) {
                css.push("@font-face {");
                for (let j = 0; j < rule.style.length; j++) {
                    let name = rule.style[j]
                    let value = rule.style[name];
                    css.push(name);
                    css.push(":");
                    if (name == "src" && value && value.includes("url") && !value.includes("data:")) {
                        let url = cssUrlRegExp.exec(value)[1];
                        if (url) {
                            let index = css.length;
                            css.push(""); // placeholder
                            promises.push(getUrlAsDataUrl(toAbsoluteUrl(baseUrl, url)).then(d => css[index] = "url(" + d + ")", () => css[index] = value));
                        }
                    } else {
                        css.push(value);
                    }
                    css.push(";");
                }
                css.push("}");
            } else {
                css.push(rule.cssText);
            }
        }

        return Promise.all(promises).then(() => css.join(""));
    }

    function toAbsoluteUrl(baseUrl, url) {
        if (startsWithHttpRegExp.test(url) || url.startsWith("//")) { // already absolute
            return url;
        }

        let index = baseUrl.lastIndexOf("/");
        if (index > 8) {
            baseUrl = baseUrl.substring(0, index);
        }
        baseUrl += "/";

        if (url.startsWith("/")) {
            return baseUrl.substring(0, baseUrl.indexOf("/", 8)) + url;
        }
        return baseUrl + url;
    }

    function getUrlAsDataUrl(url) {
        return fetch(url).then(r => r.blob()).then(b => {
            return new Promise((resolve, reject) => {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };
                fileReader.onerror = () => {
                    reject();
                };
                fileReader.readAsDataURL(b);
            });
        });
    }

    function escapeText(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function escapeAttributeValue(value) {
        return value.replace(/"/g, "&quot;");
    }

})();