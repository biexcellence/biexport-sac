(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="biexport">
        <button id="pdfButton">PDF Export</button>
        <button id="pptButton">PPT Export</button>
        <button id="docButton">DOC Export</button>
        <button id="xlsButton">XLS Export</button>
        <form id="form" method="post" accept-charset="utf-8" action="">
            <input id="settings" name="bie_openbi_export_settings_json" type="hidden">
        </form>
      <div>
    `;

    class BiExport extends HTMLElement {

        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this.buttonPdf = this._shadowRoot.querySelector("#pdfButton");
            this.buttonPdf.onclick = () => this.startExport("PDF");

            this.buttonPpt = this._shadowRoot.querySelector("#pptButton");
            this.buttonPpt.onclick = () => this.startExport("PPTX");

            this.buttonDoc = this._shadowRoot.querySelector("#docButton");
            this.buttonDoc.onclick = () => this.startExport("DOCX");

            this.buttonXls = this._shadowRoot.querySelector("#xlsButton");
            this.buttonXls.onclick = () => this.startExport("XLSX");

            this.form = this._shadowRoot.querySelector("#form");
            this.settings = this._shadowRoot.querySelector("#settings");

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
            this._export_settings.parse_css = "";
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
            this._export_settings.server_urls = "";
            this._export_settings.server_waittime = 0;
            this._export_settings.server_engine = "";
            this._export_settings.server_quality = 0;
            this._export_settings.server_processes = 0;
            this._export_settings.application_array = "";

            this._export_settings.bianalytics = false;
            this._export_settings.parseCssClassFilter = "";

            this.updateSettings();
        }

        // BUTTONS

        get pdfButton() {
            return this.buttonPdf.textContent;
        }
        set pdfButton(value) {
            this.buttonPdf.textContent = value;
            this.buttonPdf.style.display = value ? "" : "none";
        }

        get pptButton() {
            return this.buttonPpt.textContent;
        }
        set pptButton(value) {
            this.buttonPpt.textContent = value;
            this.buttonPpt.style.display = value ? "" : "none";
        }

        get docButton() {
            return this.buttonDoc.textContent;
        }
        set docButton(value) {
            this.buttonDoc.textContent = value;
            this.buttonDoc.style.display = value ? "" : "none";
        }

        get xlsButton() {
            return this.buttonXls.textContent;
        }
        set xlsButton(value) {
            this.buttonXls.textContent = value;
            this.buttonXls.style.display = value ? "" : "none";
        }

        // SETTINGS

        get serverURL() {
            return this._export_settings.server_urls;
        }
        set serverURL(value) {
            this._export_settings.server_urls = value;
            this.updateSettings();
        }

        get filename() {
            return this._export_settings.filename;
        }
        set filename(value) {
            this._export_settings.filename = value;
            this.updateSettings();
        }

        get exportLanguage() {
            return this._export_settings.lng;
        }
        set exportLanguage(value) {
            this._export_settings.lng = value;
            this.updateSettings();
        }

        get screenWidth() {
            return this._export_settings.fixed_width;
        }
        set screenWidth(value) {
            this._export_settings.fixed_width = value;
            this.updateSettings();
        }

        get screenHeight() {
            return this._export_settings.fixed_height;
        }
        set screenHeight(value) {
            this._export_settings.fixed_height = value;
            this.updateSettings();
        }

        get pdfTemplate() {
            return this._export_settings.pdf_template;
        }
        set pdfTemplate(value) {
            this._export_settings.pdf_template = value;
            this.updateSettings();
        }

        get pptTemplate() {
            return this._export_settings.ppt_template;
        }
        set pptTemplate(value) {
            this._export_settings.ppt_template = value;
            this.updateSettings();
        }

        get docTemplate() {
            return this._export_settings.doc_template;
        }
        set docTemplate(value) {
            this._export_settings.doc_template = value;
            this.updateSettings();
        }

        get xlsTemplate() {
            return this._export_settings.xls_template;
        }
        set xlsTemplate(value) {
            this._export_settings.xls_template = value;
            this.updateSettings();
        }

        get publishMode() {
            return this._export_settings.publish_mode;
        }
        set publishMode(value) {
            this._export_settings.publish_mode = value;
            this.updateSettings();
        }

        get mailFrom() {
            return this._export_settings.mail_from;
        }
        set mailFrom(value) {
            this._export_settings.mail_from = value;
            this.updateSettings();
        }

        get mailTo() {
            return this._export_settings.mail_to;
        }
        set mailTo(value) {
            this._export_settings.mail_to = value;
            this.updateSettings();
        }

        get mailSubject() {
            return this._export_settings.mail_subject;
        }
        set mailSubject(value) {
            this._export_settings.mail_subject = value;
            this.updateSettings();
        }

        get mailBody() {
            return this._export_settings.mail_body;
        }
        set mailBody(value) {
            this._export_settings.mail_body = value;
            this.updateSettings();
        }

        set execute(value) {
            if (value && value.format) {
                this.startExport(value.format);
            }
        }

        // METHODS

        updateSettings() {
            this.settings.value = JSON.stringify(this._export_settings);
        }

        startExport(format, overrideSettings) {
            let settings = JSON.parse(JSON.stringify(this._export_settings));

            setTimeout(() => {
                this.doExport(format, settings, overrideSettings);
            }, 200);
        }

        doExport(format, settings, overrideSettings) {
            if (isDesignmode()) {
                return false;
            }

            if (overrideSettings) {
                let set = JSON.parse(overrideSettings);
                set.forEach((s) => {
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

            if (settings.publish_mode === "" || settings.publish_mode === "ONLINE" || settings.publish_mode === "VIEWER" || settings.publish_mode === "PRINT") {
                settings.publish_sync = true;
            }

            this.dispatchEvent(new Event("onStartExport", {
                detail: settings
            }));

            let sendHtml = true;
            if (sendHtml) {
                getHtml().then((html) => {
                    this.submitExport(settings, html);
                });
            } else {
                this.submitExport(settings, null);
            }
        }

        submitExport(settings, content) {
            this.dispatchEvent(new Event("onSendExport", {
                detail: settings
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
            let target = "_biexportresult_" + createGuid();

            // handle response types
            let callback = window[target] = (error, filename, blob) => {
                if (error) {
                    this.dispatchEvent(new Event("onErrorExport", {
                        detail: error
                    }));
                } else if (blob) { // download blob
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
                } else if (filename) { // download via filename
                    this.dispatchEvent(new Event("onReturnExport", {
                        detail: settings
                    }));

                    let downloadUrl = host + "/sac/download.html?FILE=" + encodeURIComponent(filename);

                    window.open(downloadUrl, "_blank");
                }

                delete window[target];
            };

            if (url.indexOf(location.protocol) == 0 || url.indexOf("https:") == 0) { // same protocol => use fetch?
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    body: new FormData(form),
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }).then((response) => {
                    if (response.ok) {
                        let contentDisposition = response.headers.get("Content-Disposition");
                        if (contentDisposition) {
                            return response.blob().then((blob) => {
                                callback(null, /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)[1], blob);
                            });
                        }
                        return response.text().then((text) => {
                            callback(null, text);
                        });
                    } else {
                        throw new Error(response.status + " - " + response.statusText);
                    }
                }).catch((reason) => {
                    callback(reason);
                });
            } else { // use form with blank target...
                form.action = url + "?callback=" + target;
                form.target = "_blank";
                form.method = "POST";
                form.acceptCharset = "utf-8";
                this._shadowRoot.appendChild(form);

                form.submit();

                form.remove(); // TODO: browser support

                if (settings.publish_mode !== "ONLINE" && settings.publish_mode !== "PRINT" && settings.publish_mode !== "VIEWER") {
                    this.dispatchEvent(new Event("onReturnExport", {
                        detail: settings
                    }));
                } else {
                    // else: relax domain 
                    try {
                        parent.document.domain = document.domain.split('.').slice(-2).join('.');
                        document.domain = document.domain.split('.').slice(-2).join('.');
                    }
                    catch (e) { /* ignore */ }
                }
            }
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-export", BiExport);

    // UTILS

    // detect designmode:
    // - mode=edit => designmode
    // - no mode => designmode
    // else => runtimemode (embed / present / view)
    function isDesignmode() {
        return location.href.indexOf("mode=edit") > -1 || location.href.indexOf("mode=") == -1;
    }

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getHtml(cb) {
        let promises = [];
        let html = cloneNode(document.documentElement, promises);
        return Promise.all(promises).then(() => {
            if (document.doctype && typeof XMLSerializer != "undefined") { // <!DOCTYPE html>
                html = new XMLSerializer().serializeToString(document.doctype) + html;
            }

            return cb && cb(html) || html;
        });
    }

    function cloneNode(node) {
        if (node.nodeType == 8) {
            return "<!--" + node.nodeValue + "-->";
        }
        if (node.nodeType == 3) {
            return node.nodeValue.replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;");
        }

        if (node.tagName == "SCRIPT") return "";

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
                if (node.src && node.src.indexOf("data:") != 0) {
                    let actualWidth = node.naturalWidth || node.width;
                    let actualHeight = node.naturalHeight || node.height;

                    let canvas = document.createElement("canvas");
                    canvas.width = node.width;
                    canvas.height = node.height;

                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(node, 0, 0, actualWidth, actualHeight, 0, 0, canvas.width, canvas.height);

                    // try catch for now...
                    // should create a new image with temp.setAttribute("crossOrigin", "anonymous"); and use that instead
                    try {
                        attributes["src"] = canvas.toDataURL("image/png");
                    } catch (e) { }
                }
                break;
            case "STYLE":
                let sheet = node.sheet;
                if (sheet) {
                    let css = [];

                    let shadowHost = null;
                    let parent = node.parentNode;
                    while (parent) {
                        if (parent.host) {
                            shadowHost = parent.host;
                            break;
                        }
                        parent = parent.parentNode;
                    }

                    if (shadowHost) { // prefix with shadow host name...
                        for (let i = 0; i < sheet.rules.length; i++) {
                            let rule = sheet.rules[i];
                            css.push(shadowHost.localName);
                            css.push(" ");
                            css.push(rule.selectorText.split(",").join("," + shadowHost.localName));
                            css.push(" ");
                            css.push("{");
                            for (let j = 0; j < rule.style.length; j++) {
                                let name = rule.style[j]
                                css.push(name);
                                css.push(":");
                                css.push(rule.style[name]);
                                css.push(";");
                            }
                            css.push("}");
                        }
                    }

                    content = css.join("");
                }
                break;
        }


        let html = [];
        html.push("<");
        html.push(name);
        for (let name in attributes) {
            html.push(" ");
            html.push(name);
            html.push("=\"");
            html.push(attributes[name].replace(/"/g, "&quot;"));
            html.push("\"");
        }
        html.push(">");
        let isEmpty = true;
        if (content) {
            html.push(content.replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;"));
            isEmpty = false;
        } else {
            let child = node.firstChild;
            if (!child && node.shadowRoot) { // shadowRoot
                child = node.shadowRoot.firstChild;
            }
            while (child) {
                html.push(cloneNode(child));
                child = child.nextSibling;
                isEmpty = false;
            }
        }
        if (true || !isEmpty) {
            html.push("</");
            html.push(name);
            html.push(">");
        }

        return html.join("");
    }


    function cloneNodeOld(node, promises) {
        let clone = node.nodeType == 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);

        let child = node.firstChild;
        if (!child && node.shadowRoot) { // shadowRoot
            child = node.shadowRoot.firstChild;
        }
        if (!child && node.tagName == "IFRAME" && (node.name || "").indexOf("_export_iframe") == -1) { // IFRAME
            try {
                child = node.contentWindow.document.body.firstChild;
            } catch (e) { /* ignore */ }
        }
        while (child) {
            if (child.nodeType != 1 || child.tagName != "SCRIPT") { // ignore text and script nodes
                clone.appendChild(cloneNode(child, promises));
            }
            child = child.nextSibling;
        }

        if (node.nodeType == 1) {
            let scrollTop = node.scrollTop;
            if (scrollTop) {
                clone.setAttribute("data-scroll-top", scrollTop);
            }
            let scrollLeft = node.scrollLeft;
            if (scrollLeft) {
                clone.setAttribute("data-scroll-left", scrollLeft);
            }

            switch (node.tagName) {
                case "INPUT":
                    clone.setAttribute("value", node.value);
                    clone.removeAttribute("checked");
                    if (node.checked) {
                        clone.setAttribute("checked", "checked");
                    }
                    break;
                case "OPTION":
                    clone.removeAttribute("selected");
                    if (node.selected) {
                        clone.setAttribute("selected", "selected");
                    }
                    break;
                case "TEXTAREA":
                    clone.textContent = node.value;
                    break;
                case "CANVAS":
                    clone = document.createElement("img");
                    for (let i = 0; i < node.attributes.length; i++) {
                        let attribute = node.attributes[i];
                        clone.setAttribute(attribute.name, attribute.value);
                    }
                    clone.setAttribute("src", node.toDataURL("image/png"));
                    break;
                case "IMG":
                    if (node.src && node.src.indexOf("data:") != 0) {
                        let actualWidth = node.naturalWidth || node.width;
                        let actualHeight = node.naturalHeight || node.height;

                        let canvas = document.createElement("canvas");
                        canvas.width = node.width;
                        canvas.height = node.height;

                        let ctx = canvas.getContext("2d");
                        ctx.drawImage(node, 0, 0, actualWidth, actualHeight, 0, 0, canvas.width, canvas.height);

                        clone.src = ctx.toDataURL("image/png");
                    }
                    break;
            }
        }

        if (clone.shadowRoot) {
            let styleSheets = clone.shadowRoot.styleSheets;
            for (let i = 0; i < styleSheets.length; i++) {
                let sheet = styleSheets[i];
                let rules = sheet.cssRules;
                for (let j = 0; j < rules.length; j++) {
                    let rule = rules[j];

                    rule.selectorText = clone.tagName + " " + rule.selectorText;
                }
            }
        }

        return clone;
    }

})();