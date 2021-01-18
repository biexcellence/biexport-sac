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
            this._shadowRoot.querySelector("#form").id = this._id + "_form";

            this.settings = this._shadowRoot.querySelector("#export_settings_json");
            this.settings.id = this._id + "_export_settings_json";

            this._serviceMessage = "";

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

            this._showIcons = true;
            this._showTexts = false;
            this._showViewSelector = false;
            this._showComponentSelector = false;
            this._enableCSV = false;
            this._enablePPT = true;
            this._enableXLS = true;
            this._enablePDF = true;
            this._enableDOC = true;

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

            this._export_settings.pdf_orient = "L";
            this._export_settings.pdf_header = '<table width=1000px style="font - family: Arial; "><tr><td width=850px>SAC Export</td><td width=150px><img src="" width=150px></table>';
            this._export_settings.pdf_footer = '<table width=1000px style="font - family: Arial;"><tr><td>%PAGE% of %PAGES%</td></tr></table>';
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
            this._export_settings.pdf_template_def = {};
            this._export_settings.header_footer_width = 0;
            this._export_settings.header_footer_css = true;
            this._export_settings.ppt_exclude = "";
            this._export_settings.ppt_template = "";
            this._export_settings.ppt_seperate = "";
            this._export_settings.ppt_template_def = {};

            this._export_settings.doc_exclude = "";
            this._export_settings.doc_template = "";
            this._export_settings.doc_template_def = {};

            this._export_settings.xls_exclude = "";
            this._export_settings.xls_template = "";
            this._export_settings.xls_template_def = {};

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
            this._export_settings.license = "";
            this._export_settings.server_waittime = 0;
            this._export_settings.server_engine = "";
            this._export_settings.server_quality = 0;
            this._export_settings.server_processes = 0;
            this._export_settings.application_array = "";

            this._export_settings.bianalytics = false;
            this._export_settings.parseCssClassFilter = "";

            this._updateSettings();

            this._renderExportButton();
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this._pptMenuItem.setVisible(this.enablePpt);
            this._pptMenuItem.setText(this.showTexts ? this._cPPT_text : null);
            this._pptMenuItem.setIcon(this.showIcons ? this._cPPT_icon : null);

            this._docMenuItem.setVisible(this.enableDoc);
            this._docMenuItem.setText(this.showTexts ? this._cDOC_text : null);
            this._docMenuItem.setIcon(this.showIcons ? this._cDOC_icon : null);

            this._xlsMenuItem.setVisible(this.enableXls);
            this._xlsMenuItem.setText(this.showTexts ? this._cXLS_text : null);
            this._xlsMenuItem.setIcon(this.showIcons ? this._cXLS_icon : null);

            this._csvMenuItem.setVisible(this.enableCsv);
            this._csvMenuItem.setText(this.showTexts ? this._cCSV_text : null);
            this._csvMenuItem.setIcon(this.showIcons ? this._cCSV_icon : null);

            this._pdfMenuItem.setVisible(this.enablePdf);
            this._pdfMenuItem.setText(this.showTexts ? this._cPDF_text : null);
            this._pdfMenuItem.setIcon(this.showIcons ? this._cPDF_icon : null);

            this._exportButton.setVisible(this.showTexts || this.showIcons);
            this._exportButton.setText(this.showTexts ? this._cExport_text : null);
            this._exportButton.setIcon(this.showIcons ? this._cExport_icon : null);
            if (this._designMode) {
                this._exportButton.setEnabled(false);
            }
        }

        _renderExportButton() {
            let menu = new sap.m.Menu({
                title: this._cExport_text,
                itemSelected: oEvent => {
                    let oItem = oEvent.getParameter("item");
                    if (!this.showComponentSelector && !this.showViewSelector) {
                        this.doExport(oItem.getKey());
                    } else {
                        let metadata = getMetadata(/*withoutData*/true);

                        let ltab = new sap.m.IconTabBar({
                            expandable: false
                        });

                        let lcomponent_box;
                        if (this.showComponentSelector && oItem.getKey() != "CSV") {
                            lcomponent_box = new sap.ui.layout.form.SimpleForm({
                                layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                                columnsM: 2,
                                columnsL: 4
                            });

                            let components = metadata.components;
                            if (this["_initialVisibleComponents" + oItem.getKey()] == null) {
                                this["_initialVisibleComponents" + oItem.getKey()] = this[oItem.getKey().toLowerCase() + "SelectedWidgets"] ? JSON.parse(this[oItem.getKey().toLowerCase() + "SelectedWidgets"]) : [];
                            }

                            if (this["_initialVisibleComponents" + oItem.getKey()].length == 0) {
                                let linitial = [];
                                for (let componentId in components) {
                                    let component = components[componentId];
                                    let lcomp = {};
                                    lcomp.component = component.name;
                                    lcomp.isExcluded = false;
                                    linitial.push(lcomp);
                                }
                                this[oItem.getKey().toLowerCase() + "SelectedWidgets"] = JSON.stringify(linitial);
                            }
                            for (let componentId in components) {
                                let component = components[componentId];

                                if (component.type == "sdk_com_biexcellence_openbi_sap_sac_export__0") {
                                    continue;
                                }

                                if (this["_initialVisibleComponents" + oItem.getKey()].length == 0 || this["_initialVisibleComponents" + oItem.getKey()].some(v => v.component == component.name && !v.isExcluded)) {
                                    let ltext = component.name.replace(/_/g, " ");

                                    lcomponent_box.addContent(new sap.m.CheckBox({
                                        id: component.name,
                                        text: ltext,
                                        selected: true,
                                        select: oEvent => {
                                            let visibleComponents = [];
                                            let objIndex = -1;

                                            if (this[oItem.getKey().toLowerCase() + "SelectedWidgets"] != "") {
                                                visibleComponents = JSON.parse(this[oItem.getKey().toLowerCase() + "SelectedWidgets"]);
                                                objIndex = visibleComponents.findIndex(v => v.component == oEvent.getParameter("id"));
                                            }
                                            if (objIndex > -1) {
                                                visibleComponents[objIndex].isExcluded = !oEvent.getParameter("selected");
                                            } else {
                                                visibleComponents.push({
                                                    component: oEvent.getParameter("id"),
                                                    isExcluded: !oEvent.getParameter("selected")
                                                });
                                            }
                                            this[oItem.getKey().toLowerCase() + "SelectedWidgets"] = JSON.stringify(visibleComponents);
                                        }
                                    }));
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

                        let lview_box;
                        if (this.showViewSelector) {
                            lview_box = new sap.ui.layout.form.SimpleForm({
                                layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                                columnsM: 1,
                                columnsL: 1
                            });
                            lview_box.addContent(new sap.m.Toolbar({
                                ariaLabelledBy: "Title1",
                                content: [
                                    new sap.m.Title({ id: "Title1", text: "Application Parameters" }),
                                    new sap.m.ToolbarSpacer(),
                                    new sap.m.Button({ icon: "sap-icon://download" }),
                                    new sap.m.Button({ icon: "sap-icon://upload" })
                                ]
                            }));

                            let vars = metadata.vars;
                            for (let varId in vars) {
                                let varObj = vars[varId];
                                if (varObj.isExposed) {
                                    lview_box.addContent(new sap.m.Label({
                                        text: varObj.description || varObj.name
                                    }));
                                    lview_box.addContent(new sap.m.Input({
                                        id: varObj.name + "_value",
                                        change: oEvent => {
                                            let context = sap.fpa.ui.infra.common.getContext();

                                            this._export_settings.application_array = [];
                                            this._export_settings.application_array.push({ "application": context.getAppArgument().appId });

                                            if (!this._export_settings.array_var) {
                                                this._export_settings.array_var = [];
                                            }
                                            let objIndex = this._export_settings.array_var.findIndex(v => v.parameter == oEvent.getParameter("id").replace("_value", ""));
                                            if (objIndex > -1) {
                                                this._export_settings.array_var[objIndex].values = oEvent.getParameter("value");
                                            } else {
                                                this._export_settings.array_var.push({ "parameter": oEvent.getParameter("id").replace("_value", ""), "values": oEvent.getParameter("value"), "iterative": false, "applications": "" });
                                            }

                                        }
                                        // "valueHelpRequest": this.onHandleVariableSuggest,
                                        // "showValueHelp": true
                                    }));
                                    lview_box.addContent(new sap.m.CheckBox({
                                        id: varObj.name + "_iterative",
                                        text: "Iterative",
                                        select: oEvent => {
                                            let context = sap.fpa.ui.infra.common.getContext();

                                            this._export_settings.application_array = [];
                                            this._export_settings.application_array.push({ "application": context.getAppArgument().appId });

                                            if (!this._export_settings.array_var) {
                                                this._export_settings.array_var = [];
                                            }
                                            let objIndex = this._export_settings.array_var.findIndex(v => v.parameter == oEvent.getParameter("id").replace("_iterative", ""));
                                            if (objIndex > -1) {
                                                this._export_settings.array_var[objIndex].iterative = oEvent.getParameter("selected");
                                            } else {
                                                this._export_settings.array_var.push({ "parameter": oEvent.getParameter("id").replace("_iterative", ""), "values": "", "iterative": oEvent.getParameter("selected"), "applications": "" });
                                            }

                                        }
                                    }));
                                }
                            }

                            lview_box.addContent(new sap.m.Toolbar({
                                ariaLabelledBy: "Title2",
                                content: [
                                    new sap.m.Title({ id: "Title2", text: "Document Delivery" }),
                                    new sap.m.ToolbarSpacer()
                                ]
                            }));

                            lview_box.addContent(new sap.m.Text({
                                text: "The generation of Briefing Books with multiple views might take a while. Activate mail delivery to receive the document via mail"
                            }));
                            lview_box.addContent(new sap.m.CheckBox({
                                text: "Activate Mail Delivery",
                                select: oEvent => {
                                    if (this._mail_to != null) {
                                        this._mail_to.setEnabled(oEvent.getParameter("selected"));
                                    }
                                    if (oEvent.getParameter("selected")) {
                                        this._export_settings.mail_to = sap.fpa.ui.infra.common.getContext().getUser().getEmail();
                                    } else {
                                        this._export_settings.mail_to = "";
                                    }
                                }
                            }));
                            lview_box.addContent(new sap.m.Label({
                                text: "Recipient"
                            }));
                            this._mail_to = new sap.m.Input({
                                id: "mail_to",
                                enabled: false,
                                change: oEvent => {
                                    this._export_settings.mail_to = oEvent.getParameter("value");
                                }
                            });
                            this._mail_to.setValue(sap.fpa.ui.infra.common.getContext().getUser().getEmail());
                            lview_box.addContent(this._mail_to);

                            ltab.addItem(new sap.m.IconTabFilter({
                                key: "contents",
                                text: "Define Briefing Book Views",
                                icon: "",
                                content: [
                                    lview_box
                                ]
                            }));
                        }

                        let dialog = new sap.m.Dialog({
                            title: "Configure Export",
                            contentWidth: "500px",
                            contentHeight: "400px",
                            draggable: true,
                            resizable: true,
                            content: [
                                ltab
                            ],
                            beginButton: new sap.m.Button({
                                text: "Submit",
                                press: () => {
                                    this._updateSettings();
                                    this.doExport(oItem.getKey());
                                    dialog.close();
                                }
                            }),
                            endButton: new sap.m.Button({
                                text: "Cancel",
                                press: () => {
                                    dialog.close();
                                }
                            }),
                            afterClose: () => {
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

            this._pptMenuItem = new sap.m.MenuItem({ key: "PPT" });
            menu.addItem(this._pptMenuItem);

            this._docMenuItem = new sap.m.MenuItem({ key: "DOC" });
            menu.addItem(this._docMenuItem);

            this._xlsMenuItem = new sap.m.MenuItem({ key: "XLS" });
            menu.addItem(this._xlsMenuItem);

            this._csvMenuItem = new sap.m.MenuItem({ key: "CSV" });
            menu.addItem(this._csvMenuItem);

            this._pdfMenuItem = new sap.m.MenuItem({ key: "PDF" });
            menu.addItem(this._pdfMenuItem);

            let buttonSlot = document.createElement("div");
            buttonSlot.slot = "export_button";
            this.appendChild(buttonSlot);

            this._exportButton = new sap.m.MenuButton({ menu: menu, visible: false });
            this._exportButton.placeAt(buttonSlot);
        }

        // DISPLAY

        getButtonIconVisible() {
            return this.showIcons;
        }
        setButtonIconVisible(value) {
            this._setValue("showIcons", value);
        }

        get showIcons() {
            return this._showIcons;
        }
        set showIcons(value) {
            this._showIcons = value;
        }

        getButtonTextVisible() {
            return this.showTexts;
        }
        setButtonTextVisible(value) {
            this._setValue("showTexts", value);
        }

        get showTexts() {
            return this._showTexts;
        }
        set showTexts(value) {
            this._showTexts = value;
        }

        getViewSelectorVisible() {
            return this.showViewSelector;
        }
        setViewSelectorVisible(value) {
            this._setValue("showViewSelector", value);
        }

        get showViewSelector() {
            return this._showViewSelector;
        }
        set showViewSelector(value) {
            this._showViewSelector = value;
        }

        getWidgetSelectorVisible() {
            return this.showComponentSelector;
        }
        setWidgetSelectorVisible(value) {
            this._setValue("showComponentSelector", value);
        }

        get showComponentSelector() {
            return this._showComponentSelector;
        }
        set showComponentSelector(value) {
            this._showComponentSelector = value;
        }

        getPdfButtonVisible() {
            return this.enablePdf;
        }
        setPdfButtonVisible(value) {
            this._setValue("enablePdf", value);
        }

        get enablePdf() {
            return this._enablePDF;
        }
        set enablePdf(value) {
            this._enablePDF = value;
        }

        getPptButtonVisible() {
            return this.enablePpt;
        }
        setPptButtonVisible(value) {
            this._setValue("enablePpt", value);
        }

        get enablePpt() {
            return this._enablePPT;
        }
        set enablePpt(value) {
            this._enablePPT = value;
        }

        getDocButtonVisible() {
            return this.enableDoc;
        }
        setDocButtonVisible(value) {
            this._setValue("enableDoc", value);
        }

        get enableDoc() {
            return this._enableDOC;
        }
        set enableDoc(value) {
            this._enableDOC = value;
        }

        getXlsButtonVisible() {
            return this.enableXls;
        }
        setXlsButtonVisible(value) {
            this._setValue("enableXls", value);
        }

        get enableXls() {
            return this._enableXLS;
        }
        set enableXls(value) {
            this._enableXLS = value;
        }

        getCsvButtonVisible() {
            return this.enableCsv;
        }
        setCsvButtonVisible(value) {
            this._setValue("enableCsv", value);
        }

        get enableCsv() {
            return this._enableCSV;
        }
        set enableCsv(value) {
            this._enableCSV = value;
        }


        // SETTINGS

        getServerUrl() {
            return this.serverURL;
        }
        setServerUrl(value) {
            this._setValue("serverURL", value);
        }

        get serverURL() {
            return this._export_settings.server_urls;
        }
        set serverURL(value) {
            this._export_settings.server_urls = value;
            this._updateSettings();
        }

        getLicenseKey() {
            return this.licenseKey;
        }
        setLicenseKey(value) {
            this._setValue("licenseKey", value);
        }

        get licenseKey() {
            return this._export_settings.license;
        }
        set licenseKey(value) {
            this._export_settings.license = value;
            this._updateSettings();
        }

        getFilename() {
            return this.filename;
        }
        setFilename(value) {
            this._setValue("filename", value);
        }

        get filename() {
            return this._export_settings.filename;
        }
        set filename(value) {
            this._export_settings.filename = value;
            this._updateSettings();
        }

        getExportLanguage() {
            return this.exportLanguage;
        }
        setExportLanguage(value) {
            this._setValue("exportLanguage", value);
        }

        get exportLanguage() {
            return this._export_settings.lng;
        }
        set exportLanguage(value) {
            this._export_settings.lng = value;
            this._updateSettings();
        }

        getStaticWidth() {
            return this.screenWidth;
        }
        setStaticWidth(value) {
            this._setValue("screenWidth", value);
        }

        get screenWidth() {
            return this._export_settings.fixed_width;
        }
        set screenWidth(value) {
            this._export_settings.fixed_width = value;
            this._updateSettings();
        }

        getStaticHeight() {
            return this.screenHeight;
        }
        setStaticHeight(value) {
            this._setValue("screenHeight", value);
        }

        get screenHeight() {
            return this._export_settings.fixed_height;
        }
        set screenHeight(value) {
            this._export_settings.fixed_height = value;
            this._updateSettings();
        }

        getParseCss() {
            return this.parseCss;
        }
        setParseCss(value) {
            this._setValue("parseCss", value);
        }

        get parseCss() {
            return this._export_settings.parse_css;
        }
        set parseCss(value) {
            this._export_settings.parse_css = value;
            this._updateSettings();
        }

        getBiAnalyticsDocument() {
            return this.biAnalyticsDocument;
        }
        setBiAnalyticsDocument(value) {
            this._setValue("biAnalyticsDocument", value);
        }

        get biAnalyticsDocument() {
            return this._export_settings.bianalytics;
        }
        set biAnalyticsDocument(value) {
            this._export_settings.bianalytics = value;
            this._updateSettings();
        }

        getPptSeparateSlides() {
            return this.pptSeparate;
        }
        setPptSeparateSlides(value) {
            this._setValue("pptSeparate", value);
        }

        get pptSeparate() {
            return this._export_settings.ppt_seperate == "X";
        }
        set pptSeparate(value) {
            this._export_settings.ppt_seperate = value ? "X" : "";
            this._updateSettings();
        }

        getPdfTemplate() {
            return this.pdfTemplate;
        }
        setPdfTemplate(value) {
            this._setValue("pdfTemplate", value);
        }

        get pdfTemplate() {
            return this._export_settings.pdf_template;
        }
        set pdfTemplate(value) {
            this._export_settings.pdf_template = value;
            this._updateSettings();
        }

        getPptTemplate() {
            return this.pptTemplate;
        }
        setPptTemplate(value) {
            this._setValue("pptTemplate", value);
        }

        get pptTemplate() {
            return this._export_settings.ppt_template;
        }
        set pptTemplate(value) {
            this._export_settings.ppt_template = value;
            this._updateSettings();
        }

        getDocTemplate() {
            return this.docTemplate;
        }
        setDocTemplate(value) {
            this._setValue("docTemplate", value);
        }

        get docTemplate() {
            return this._export_settings.doc_template;
        }
        set docTemplate(value) {
            this._export_settings.doc_template = value;
            this._updateSettings();
        }

        getXlsTemplate() {
            return this.xlsTemplate;
        }
        setXlsTemplate(value) {
            this._setValue("xlsTemplate", value);
        }

        get xlsTemplate() {
            return this._export_settings.xls_template;
        }
        set xlsTemplate(value) {
            this._export_settings.xls_template = value;
            this._updateSettings();
        }

        get pdfHeader() {
            return this._export_settings.pdf_header;
        }
        set pdfHeader(value) {
            this._export_settings.pdf_header = value;
            this._updateSettings();
        }

        get pdfFooter() {
            return this._export_settings.pdf_footer;
        }
        set pdfFooter(value) {
            this._export_settings.pdf_footer = value;
            this._updateSettings();
        }

        get pdfOrient() {
            return this._export_settings.pdf_orient;
        }
        set pdfOrient(value) {
            this._export_settings.pdf_orient = value;
            this._updateSettings();
        }

        get pdfSelectedWidgets() {
            return this._export_settings.pdf_exclude;
        }
        set pdfSelectedWidgets(value) {
            this._export_settings.pdf_exclude = value;
            this._updateSettings();
        }

        get pptSelectedWidgets() {
            return this._export_settings.ppt_exclude;
        }
        set pptSelectedWidgets(value) {
            this._export_settings.ppt_exclude = value;
            this._updateSettings();
        }

        get docSelectedWidgets() {
            return this._export_settings.doc_exclude;
        }
        set docSelectedWidgets(value) {
            this._export_settings.doc_exclude = value;
            this._updateSettings();
        }

        get xlsSelectedWidgets() {
            return this._export_settings.xls_exclude;
        }
        set xlsSelectedWidgets(value) {
            this._export_settings.xls_exclude = value;
            this._updateSettings();
        }

        getPublishMode() {
            return this.publishMode;
        }
        setPublishMode(value) {
            this._setValue("publishMode", value);
        }

        get publishMode() {
            return this._export_settings.publish_mode;
        }
        set publishMode(value) {
            this._export_settings.publish_mode = value;
            this._updateSettings();
        }

        getPublishSync() {
            return this.publishSync;
        }
        setPublishSync(value) {
            this._setValue("publishSync", value);
        }

        get publishSync() {
            return this._export_settings.publish_sync;
        }
        set publishSync(value) {
            this._export_settings.publish_sync = value;
            this._updateSettings();
        }

        getMailFrom() {
            return this.mailFrom;
        }
        setMailFrom(value) {
            this._setValue("mailFrom", value);
        }

        get mailFrom() {
            return this._export_settings.mail_from;
        }
        set mailFrom(value) {
            this._export_settings.mail_from = value;
            this._updateSettings();
        }

        getMailTo() {
            return this.mailTo;
        }
        setMailTo(value) {
            this._setValue("mailTo", value);
        }

        get mailTo() {
            return this._export_settings.mail_to;
        }
        set mailTo(value) {
            this._export_settings.mail_to = value;
            this._updateSettings();
        }

        getMailSubject() {
            return this.mailSubject;
        }
        setMailSubject(value) {
            this._setValue("mailSubject", value);
        }

        get mailSubject() {
            return this._export_settings.mail_subject;
        }
        set mailSubject(value) {
            this._export_settings.mail_subject = value;
            this._updateSettings();
        }

        getMailBody() {
            return this.mailBody;
        }
        setMailBody(value) {
            this._setValue("mailBody", value);
        }

        get mailBody() {
            return this._export_settings.mail_body;
        }
        set mailBody(value) {
            this._export_settings.mail_body = value;
            this._updateSettings();
        }

        get oauth() {
            return this._export_settings.oauth;
        }
        set oauth(value) {
            this._export_settings.oauth = value;
            this._updateSettings();
        }

        // METHODS

        _updateSettings() {
            this.settings.value = JSON.stringify(this._export_settings);
        }

        _setValue(name, value) {
            this[name] = value;

            let properties = {};
            properties[name] = this[name];
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        addCustomText(name, value) {
            if (!this._export_settings.array_text) {
                this._export_settings.array_text = [];
            }
            this._export_settings.array_text.push({ "name": name, "value": value });
            this._updateSettings();
        }

        clearCustomTexts() {
            this._export_settings.array_text = "";
            this._updateSettings();
        }

        addSelectedWidget(format, comp, isIncluded) {
            let current = this[format.toLowerCase() + "_exclude"] ? JSON.parse(this[format.toLowerCase() + "_exclude"]) : [];
            current.push({ component: comp, isExcluded: !isIncluded });

            this._export_settings[format.toLowerCase() + "_exclude"] = JSON.stringify(current);
            this._updateSettings();
        }
        clearSelectedWidgets(format) {
            this._export_settings[format.toLowerCase() + "_exclude"] = "";
            this._updateSettings();
        }

        getExportTemplate(format) {
            return this["get" + format[0].toUpperCase() + format.substring(1).toLowerCase() + "Template"]();
        }
        setExportTemplate(format, value) {
            this["set" + format[0].toUpperCase() + format.substring(1).toLowerCase() + "Template"](value);
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

        addPdfSection(name, header, footer, content, orientation, iterative) {
            if (!this._export_settings.pdf_page_sections) {
                this._export_settings.pdf_page_sections = [];
            }
            this._export_settings.pdf_page_sections.push({
                "name": name, "header": header, "footer": footer, "template": content, "optimizeheight": false, "iterative": iterative, "orientation": orientation
            });

            // workaround as page section does not support orientation currently
            this._export_settings.pdf_orient = orientation;
            this._updateSettings();
        }
        clearPdfSections() {
            this._export_settings.pdf_page_sections = "";
            this._updateSettings();
        }

        addBriefingBookDefinition(parameters, index, filename, template, customTexts, selectedWidgets, applicationIds) {
            if (!this._export_settings.array_var) {
                this._export_settings.array_var = [];
            }

            let selected = [];
            selectedWidgets.forEach(s => {
                selected.push({
                    component: s, isExclued: false
                });
            });

            let texts = [];
            customTexts.forEach(s => {
                texts.push(JSON.parse(s));
            });


            let params = [];
            parameters.forEach(s => {
                params.push(JSON.parse(s));
            });

            this._export_settings.array_var.push({ "index": index, "filename": filename, "template": template, "texts": texts, "parameters": params, "selected": selected, "applications": applicationIds.join(";") });
            this._updateSettings();
        }
        clearBriefingBookDefinitions() {
            this._export_settings.array_var = "";
            this._updateSettings();
        }

        addExportTemplateSection(format, template, pageBreakAfter, placeholderRedefinitions, placeholderValues) {
            if (this._export_settings[format.toLowerCase() + "_template_def"].sections == null) {
                this._export_settings[format.toLowerCase() + "_template_def"].sections = [];
            }

            let redefinitions = [];
            placeholderRedefinitions.forEach(s => {
                redefinitions.push(JSON.parse(s));
            });

            let values = [];
            placeholderValues.forEach(s => {
                values.push(JSON.parse(s));
            });

            this._export_settings[format.toLowerCase() + "_template_def"].sections.push({
                "template": template, "containsPageBreak": pageBreakAfter, "placeholderValues": values, "placeholderRedefinitions": redefinitions, "content": "[]", "iterative": false
            });
            this._updateSettings();
        }
        clearExportTemplateSections(format) {
            this._export_settings[format.toLowerCase() + "_template_def"] = {};
            this._updateSettings();
        }

        getServiceMessage() {
            return this._serviceMessage;
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

            // try detect runtime settings
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

            settings.metadata = JSON.stringify(getMetadata());

            if (settings.publish_mode === "" || settings.publish_mode === "ONLINE" || settings.publish_mode === "VIEWER" || settings.publish_mode === "PRINT") {
                settings.publish_sync = true;
            }

            this.dispatchEvent(new CustomEvent("onStart", {
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

                    this._createExportForm(settings, html);
                }, reason => {
                    console.error("Error in getHtml:", reason);
                });
            } else {
                this._createExportForm(settings, null);
            }
        }

        _createExportForm(settings, content) {
            this.dispatchEvent(new CustomEvent("onSend", {
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

            this._submitExport(host, url, form, settings);
        }

        _submitExport(host, exportUrl, form, settings) {

            this._serviceMessage = "";

            // handle response types
            let callback = (error, filename, blob) => {
                if (error) {
                    this._serviceMessage = error;
                    this.dispatchEvent(new CustomEvent("onError", {
                        detail: {
                            error: error,
                            settings: settings
                        }
                    }));

                    console.error("Export failed:", error);
                } else if (filename) {
                    if (filename.indexOf("E:") === 0) {
                        callback(new Error(filename)); // error...
                        return;
                    }

                    this._serviceMessage = "Export has been produced";
                    this.dispatchEvent(new CustomEvent("onReturn", {
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
                    } else if (filename.indexOf("I:") !== 0) { // download via filename and not scheduled
                        let downloadUrl = host + "/sac/download.html?FILE=" + encodeURIComponent(filename);

                        window.open(downloadUrl, "_blank");
                    }
                }
            };

            if (exportUrl.indexOf(location.protocol) == 0 || exportUrl.indexOf("https:") == 0) { // same protocol => use fetch?
                fetch(exportUrl, {
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
                                // try again after oauth
                                this._submitExport(host, exportUrl, form, settings);
                            });
                        });
                    } else {
                        throw new Error(response.status + ": " + response.statusText);
                    }
                }).catch(reason => {
                    callback(reason);
                });
            } else { // use form with blank target...
                form.action = exportUrl;
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

    window.biExportGetHtml = window.getHtml = getHtml;
    window.biExportGetMetadata = getMetadata;

    // UTILS

    const cssUrlRegExp = /url\(["']?(.*?)["']?\)/i;
    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;
    const startsWithHttpRegExp = /^http/i;
    const htmlEntitiesRegExp = /[<>&]/;

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getMetadata(withoutData) {
        let shell = commonApp.getShell();
        let documentContext = shell.findElements(true, e => e.getMetadata().hasProperty("resourceType") && e.getProperty("resourceType") == "STORY")[0].getDocumentContext();
        let storyModel = documentContext.get("sap.fpa.story.getstorymodel");
        let entityService = documentContext.get("sap.fpa.bi.entityService");
        let widgetControls = documentContext.get("sap.fpa.story.document.widgetControls");

        let components = {};
        storyModel.getAllWidgets().forEach((widget) => {
            if (widget) { // might be undefined during edit
                let component = {
                    type: widget.class
                }

                let widgetControl = widgetControls.filter((control) => control.getWidgetId() == widget.id)[0];
                if (withoutData !== true && widgetControl) { // control specific stuff
                    if (typeof widgetControl.getTableController == "function") { // table
                        let tableController = widgetControl.getTableController();
                        let view = tableController.getView();
                        let tableCellFactory = view.getTableCellFactory();
                        let regions = tableController.getDataRegions();
                        let region = regions[0];
                        let grid = region.getGrid();
                        let rows = grid.getRows();
                        let cols = grid.getColumns();
                        let cells = region.getCells();

                        component.data = cells.map((row) => row.map((cell) => {
                            let coordinate = cell.getCoordinate();
                            let x = coordinate.getX();
                            let y = coordinate.getY();
                            return {
                                type: cell.getType(),
                                rawVal: cell.getRawVal(),
                                formattedValue: cell.getFormattedValue(),
                                scale: cell.getScale(),
                                refIndex: cell.getRefIndex() || undefined,
                                totalCell: cell.getTotalCell(),
                                level: cell.getLevel(),
                                hasNOPNullValue: cell.getHasNOPNullValue(),
                                style: tableController.getEffectiveCellStyle(cell),
                                html: tableCellFactory && tableCellFactory._oGlobalTableViewMode && tableCellFactory.generateDivStringFromCellContent({
                                    tableRow: y,
                                    tableCol: x,
                                    globalRow: y,
                                    globalCol: x,
                                    colspan: 1,
                                    rowspan: 1,
                                    // referencedRow: null,
                                    // referencedCol: null,
                                    hidden: false,
                                    height: rows[y].data.size,
                                    width: cols[x].data.size
                                })
                            };
                        }));

                        if (region.getShowTitle()) {
                            component.data.shift(); // remove title (removing regionHeaderDummyCell cells)
                        }

                        // make sure react tables are rendered
                        if (view.getReactTableWrapper) {
                            let reactTableWrapper = view.getReactTableWrapper();
                            if (reactTableWrapper) {
                                let tableData = reactTableWrapper.tableData;
                                tableData.widgetHeight = 10000;
                                tableData.widgetWidth = 10000;
                                reactTableWrapper.updateTableData(tableData);
                            }
                        }
                    }
                }

                components[widget.id] = component;
            }
        });
        let datasources = {};
        entityService.getDatasets().forEach((datasetId) => {
            let dataset = entityService.getDatasetById(datasetId);
            datasources[datasetId] = {
                name: dataset.name,
                description: dataset.description,
                model: dataset.model
            };

            storyModel.getWidgetsByDatasetId(datasetId).forEach((widget) => {
                components[widget.id].datasource = datasetId;
            });
        });

        let result = {
            components: components,
            datasources: datasources
        }

        // only for applications (not stories)
        let app;

        let applicationEntity = storyModel.getApplicationEntity();
        if (applicationEntity) {
            app = applicationEntity.app;
        }

        let outlineContainer = shell.findElements(true, e => e.hasStyleClass && e.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"
        if (outlineContainer) { // outlineContainer has more recent data than applicationEntity during edit
            try {
                app = outlineContainer.getReactProps().store.getState().globalState.instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
            } catch (e) { /* ignore */ }
        }

        if (app) {
            let names = app.names;

            for (let key in names) {
                let name = names[key];

                let obj = JSON.parse(key).pop();
                let type = Object.keys(obj)[0];
                let id = obj[type];

                let component = components[id];
                if (component) { // might be undefined during edit
                    component.type = type;
                    component.name = name;
                }
            }

            result.vars = app.globalVars;
        }

        return result;
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
            var value = node.nodeValue;
            if (htmlEntitiesRegExp.test(value)) {
                var el = document.createElement(node.parentNode.tagName);
                el.appendChild(document.createTextNode(value));
                value = el.innerHTML;
            }
            html.push(value);
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
                content = node.innerHTML; // already escaped!
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
                if (node.rel == "preload") {
                    return "";
                }
            // fallthrough
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
                            content = fetch(sheet.href).then(r => r.text()).then(t => {
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
                promises.push(content.then(c => html[index] = c));
            } else {
                html.push(content);
            }
            isEmpty = false;
        } else {
            let child = node.firstChild;
            if ((!child || node.tagName == "COM-BIEXCELLENCE-OPENBI-SAP-SAC-EXPORT") && node.shadowRoot) { // shadowRoot
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
                    reject(new Error("Failed to convert URL to data URL: " + url));
                };
                fileReader.readAsDataURL(b);
            });
        });
    }

    function escapeAttributeValue(value) {
        return value.replace(/"/g, "&quot;");
    }

})();