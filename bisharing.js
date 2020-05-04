(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="sharing_div" name="sharing_div" class="openbihideonprint">
         <slot name="sharing_content"></slot>
         <form id="form" method="post" accept-charset="utf-8" action="">
            <input id="export_settings_json" name="bie_openbi_export_settings_json" type="hidden">
        </form>
      </div>
    `;

    class BiSharing extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._id = createGuid();

            this._shadowRoot.querySelector("#sharing_div").id = this._id + "_sharing_div";
            this._shadowRoot.querySelector("#form").id = this._id + "_form";

            this.settings = this._shadowRoot.querySelector("#export_settings_json");
            this.settings.id = this._id + "_export_settings_json";

            this._serviceMessage = "";
            this._channel = "";
            this._connectParams = {};

            this._sharing_settings = {};
            this._sharing_settings.dashboard = "";
            this._sharing_settings.pageid = "";
            this._sharing_settings.requestid = "";
            this._sharing_settings.mastersys = "";
            this._sharing_settings.client_type = "";
            this._sharing_settings.client_version = "";
            this._sharing_settings.title = "";
            this._sharing_settings.appid = "";
            this._sharing_settings.urlprefix = "";
            this._sharing_settings.cookie = "";
            this._sharing_settings.user = "";
            this._sharing_settings.lng = "";
            this._sharing_settings.version = "";
            this._sharing_settings.URL = "";

            this._sharing_settings.license = "";
            this._sharing_settings.server_urls = "";

            this._sharing_settings.publish_mode = "MAIL";
            this._sharing_settings.mail_from = "";
            this._sharing_settings.mail_to = "";
            this._sharing_settings.mail_subject = "";
            this._sharing_settings.mail_body = "";
            this._sharing_settings.array_text = "";

            this._updateSettings();
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        // SETTINGS

        get serverURL() {
            return this._sharing_settings.server_urls;
        }
        set serverURL(value) {
            this._sharing_settings.server_urls = value;
            this._updateSettings();
        }

        get licenseKey() {
            return this._sharing_settings.license;
        }
        set licenseKey(value) {
            this._sharing_settings.license = value;
            this._updateSettings();
        }

        get channel() {
            return this._channel;
        }
        set channel(value) {
            this._channel = value;
        }

        // METHODS

        _updateSettings() {
            this.settings.value = JSON.stringify(this._sharing_settings);
        }

        addConnectionParameter(name, value) {
            this._connectParams[name] = value;            
            this._sharing_settings.publish_mode = this._channel + "[" + JSON.stringify(this._connectParams) + "]";
            this._updateSettings();
        }

        clearConnectionParameters() {
            this._connectParams = {};
            this._sharing_settings.publish_mode = this._channel;
            this._updateSettings();
        }

        getServiceMessage() {
            return this._serviceMessage;
        }

        uploadToShare() {
            let settings = JSON.parse(JSON.stringify(this._sharing_settings));

            setTimeout(() => {
                this._upload(settings);
            }, 200);
        }

        _upload(settings) {
            if (this._designMode) {
                return false;
            }

            // select file
            // todo

            settings.URL = location.protocol + "//" + location.host;
            settings.dashboard = location.href;
            settings.title = document.title;
            settings.cookie = document.cookie;

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

            this.dispatchEvent(new CustomEvent("onSend", {
                detail: {
                    settings: settings
                }
            }));


            var lupload = new sap.m.upload.UploadSet({
                height: "100%",
                uploadUrl: settings.server_urls + "/upload.html",
                name: "UploadSet", // .app
                instantUpload: true,
                settings: {
                    id: "UploadSet"
                },
                beforeUploadStarts: () => {
                    this.dispatchEvent(new CustomEvent("onSend", {
                        detail: {
                            settings: settings
                        }
                    }));
                },
                uploadCompleted: () => {
                    this._serviceMessage = oEvent.getParameter("item").getUrl();
                    this.dispatchEvent(new CustomEvent("onSuccess", {
                        detail: {
                            settings: settings
                        }
                    }));
                    // how to get status?
                    // how to get url?
                    //this.dispatchEvent(new CustomEvent("onError", {
                    //    detail: {
                    //        settings: settings
                    //    }
                    //}));

                },
                uploadTerminated: () => {
                }
            });

            lupload.addHeaderField(new sap.ui.core.Item({ key: "bie_openbi_export_settings_json", value: JSON.stringify(settings) }));

            let ldialog = new sap.m.Dialog({
                title: "Upload files",
                endButton: new sap.m.Button({
                    text: "Close",
                    press: () => {
                        ldialog.close();
                    }
                }),
                content: lupload
            });

            ldialog.open();
        }

        _submitUpload(host, exportUrl, form, settings) {

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

                    console.error("Upload failed:", error);
                } else if (filename) {
                    if (filename.indexOf("E:") === 0) {
                        callback(new Error(filename)); // error...
                        return;
                    }

                    this._serviceMessage = "File has been uploaded";
                    this.dispatchEvent(new CustomEvent("onSuccess", {
                        detail: {
                            filename: filename,
                            settings: settings
                        }
                    }));

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

                callback(null, "I:Upload running in separate tab");
            }
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-sharing", BiSharing);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();